# Running

Copy `.env.development.default` to `.env.development`.
Configure the right `REACT_APP_API_URL` in the .env.development and `.env.production`.

    npm install
    npm run start

## Setting up the Development Environment

Make sure to install the following plugins for VSCode:

- vscode-styled-components
- Prettier - Code formatter (after installation, enable "Format On Save" in your IDE)

## Coding Conventions and Goals

#### 1. Strive to write programs "for people to read, and only incidentally for machines to execute" (Abelson && Sussman)

#### 2. Naming conventions:

- camelCase for Folder names;
- PascalCase for Javascript file names

#### 3. Separate styled components from React components in JSX

When importing styled components: import a full file as `s`
then refer to the components as `s.Component` as in the following
example. This makes it clear what's a styled component and what's
a normal component

```
    import * as s from "./Exercises.sc";
    ...
    <s.ExercisesColumn>
    ...
```

#### 4. Separate styling from the code (e.g. `Exercises.js` and `Exercises.js.sc`)

#### 5. Avoid hardcoded string contstans

You're more prone to a mis-typing error that way.
If you define a constant, you can benefit from auto-completion from your IDE.

#### 6. General functions should be defined in general modules (e.g. utils)

E.g. If you end up definig a general `random` function, or a `isUppercaseString(obj)` function, etc.
inside a component defintion, you're better moving them out of there. Two reasons:

1. it's likely that you'll need to use them in other places than that component
2. keeping things at the same abstraction level: the code in a component should worry about the main business of that
   component; not about defining generic functions.

### 7. Use onNotify / Notify pattern when handling Parent/Child updates in React

E.g. If a child can update an element which requires a re-render from the parent,
the pattern should be:

```js
export default function Parent({}) {
...
    onNotifyChange()
    {
        // Handle the change from the child component
    }

...

    <Child
        notifyChange={onNotifyChange}
    />
}
```

## Style Guidelines for the UI

#### General Rules

- Buttons: Use Title Case for all button labels. (Example: "Save Changes", "Log In")
- UI Text Elements (e.g. forms, descriptions): Use Sentence case. (Example: "Enter your email address.")

#### Specific Terminology

- Use the noun "Login" when referring to credentials or in titles. (Example: "Login details", "Secure Login")
- Use the verb "Log In" for the action. (Example: "Log In" button, "Log in to your account")

#### Language Preference

- We use US English for spelling and terminology. (Example: "color" instead of "colour", "practice" instead of "practise")

## Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project expects /teacher-dashboard to be deployed at localhost:3000 - that's another zeeguu project
