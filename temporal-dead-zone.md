# The Temporal Dead Zone (TDZ)

## What is it?

In JavaScript, `let` and `const` declarations are **hoisted** — the engine registers
the variable name at the top of its scope before any code runs. But unlike `var`, they
are **not initialised** until the line where you declare them is actually executed.

The gap between the start of the scope and the initialisation line is called the
**Temporal Dead Zone**. Reading a variable inside its TDZ throws a `ReferenceError`.

---

## A simple example

```js
console.log(x); // ✅  undefined  (var is hoisted AND initialised)
var x = 5;

console.log(y); // ❌  ReferenceError: Cannot access 'y' before initialization
let y = 5;
```

---

## Why does it happen?

Think of it in three phases for `let`/`const`:

| Phase | What happens |
|---|---|
| **Hoisting** | Name `y` is registered in the scope |
| **TDZ** | `y` exists but is forbidden to read |
| **Initialisation** | `const y = 5` runs — TDZ ends, `y` is usable |

---

## A sneaky real-world case

The TDZ bites you most when you use a variable *in the same file* but *above* where
it is declared — especially with styled-components, module-level constants, or circular
references:

```js
// ❌ Crashes at runtime
const Box = styled.div`
  animation: ${fadeIn} 0.4s ease;   // reads fadeIn here...
`;

const fadeIn = keyframes`            // ...but declared here
  from { opacity: 0; }
  to   { opacity: 1; }
`;
```

```js
// ✅ Works — declare first, use second
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Box = styled.div`
  animation: ${fadeIn} 0.4s ease;
`;
```

---

## Why not just use `var`?

`var` would silently "work" in the broken example above — but only because it
initialises to `undefined` immediately, so `${undefined}` would produce
`animation: undefined 0.4s ease` in the CSS string. You'd get a **silent bug**
instead of a crash. The TDZ is actually `let`/`const` *protecting* you by failing
loudly.

---

## Quick rules to avoid it

1. **Declare before you use.** Put constants and helpers at the top of the file.
2. **Prefer `const` over `var`** — you want the loud error, not the silent one.
3. **Watch out in module-level code** — class fields, styled-components, and anything
   evaluated at import time are common traps.
4. **Your bundler won't always save you** — the TDZ is a runtime error; build tools
   may not catch it.

---

## One-line summary

> `let`/`const` variables exist from the start of their scope, but you can't touch
> them until the line that declares them has run.
