# Running

Configure the right `REACT_APP_API_URL` in the .env.development and `.env.production`. 

    npm install
    npm run start
   
## Development

Make sure to install the following plugins for VSCode:
- vscode-styled-components
- Prettier - Code formatter (after installation, enable "Format On Save" in your IDE)


### Code Conventions

1. Aim to write understandable code. Remember the dicto of Abelson & Sussman: "Programs must be written for people to read, and only incidentally for machines to execute".
2. User camelCase for Folder names
3. Use PascalCase for Javascript file names
4. Separate styling of styled components in a different file (e.g. Exercises.js and Exercises.js.sc)
6. When importing styled components: import a full file as `s` 
then refer to the components as `s.Component` as in the following
example. This makes it clear what's a styled component and what's
a normal component


```
    import * as s from "./Exercises.sc";
    ... 
    <s.ExercisesColumn>
    ... 
```

## Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project expects /teacher-dashboard to be deployed at localhost:3000 - that's another zeeguu project
