# frc — Flutter Run, Colored

**`frc` is a drop-in replacement for `flutter run`.** It runs your Flutter app exactly the same way, but splits the firehose of console output into two colors so your eyes know what to look at.

| Color | Meaning |
|---|---|
| Neon green | Your app's own logs (`debugPrint` / `print`) — the stuff with actual *logic* you care about |
| Gray | Android/engine system noise (`Choreographer`, `ProfileInstaller`, `FlutterJNI`, back-gesture callbacks, etc.) |

---

## The problem

Running `flutter run` (or hitting F5 in VS Code) dumps everything into one console — your `debugPrint("Person loaded: $person")` looks identical to ten lines of Android system chatter:

```
I/Choreographer( 7499): Skipped 31 frames!
D/FlutterJNI( 7499): Sending viewport metrics to the engine.
D/WindowOnBackDispatcher( 7499): setTopOnBackInvokedCallback (unwrapped)...
I/flutter ( 7499): Person(id: 1, name: John Doe, email: john@example.com)   <- the one line you actually wanted
D/ProfileInstaller( 7499): Installing profile for com.example.app
```

`frc` colors that last line neon green and grays out everything else, so it jumps out without scrolling/searching.

---

## Install

### On this machine
Already linked globally — `frc` works from any Flutter project, no setup needed.

### On a new machine

```bash
git clone https://github.com/Autthawigorn/flutter-run-colored.git
cd flutter-run-colored
pnpm link --global .
```

That's it — put the cloned folder anywhere you want, path doesn't matter.

**Requirements:** Node.js, pnpm, and the Flutter SDK on your `PATH`.

---

## Usage

```bash
cd <any flutter project>
frc
```

Any flag you'd normally pass to `flutter run` works the same way:

```bash
frc -d emulator-5554
```

Hot reload (`r`), hot restart (`R`), and quit (`q`) all work exactly like a normal `flutter run` session.

---

## How it works

`frc` is a ~20-line Node.js script ([bin/cli.js](bin/cli.js)) that:

1. Spawns `flutter run` as a child process, passing your stdin straight through (so hot reload keypresses still work)
2. Reads every line of its stdout/stderr
3. If the line contains `flutter (` (the tag Android logcat gives to your app's print/debugPrint output), prints it in neon green — otherwise gray

No dependencies, no build step.

---

## Customize the colors

Edit the `GRAY` / `NEON` constants at the top of [bin/cli.js](bin/cli.js) — they're just ANSI 256-color codes:

```js
const GRAY = '\x1b[38;5;244m';
const NEON = '\x1b[38;5;46m';
```

Changes apply immediately, no relink needed (the global link points straight at this source file).
