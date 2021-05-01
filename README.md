# Running

Configure the right `REACT_APP_API_URL` in the .env.development and `.env.production`. 

    npm install
    npm run start
   
## Development

Make sure to install the following plugins for VSCode:
- vscode-styled-components
- Prettier - Code formatter (after installation, enable "Format On Save" in your IDE)




### Coding Conventions and Goals

#### 1. Strive to write programs "for people to read, and only incidentally for machines to execute" (Abelson && Sussman)

#### 2. Naming conventions: 

   * camelCase for Folder names; 
   * PascalCase for Javascript file names 
    
3. When importing styled components: import a full file as `s` 
then refer to the components as `s.Component` as in the following
example. This makes it clear what's a styled component and what's
a normal component


```
    import * as s from "./Exercises.sc";
    ... 
    <s.ExercisesColumn>
    ... 
```
4. Separate styling from the code (e.g. `Exercises.js` and `Exercises.js.sc`)
## Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project expects /teacher-dashboard to be deployed at localhost:3000 - that's another zeeguu project
