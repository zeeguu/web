# Running

Configure the right `REACT_APP_API_URL` in the .env.development and `.env.production`. 

    npm install
    npm run start
   
## Development

Make sure to install the following plugins for VSCode:
- vscode-styled-components
- Prettier - Code formatter 

Write good code.

### Code Conventions
- folderNames are camelCase
- js files are named with PascalCase
- when importing styled components import a full file as `s` 
then refer to the components as `s.Component` as in the following
example. This makes it clear what's a styled component and what's
a normal component


    `import * as s from "./Exercises.sc";` 
    ... 
    <s.ExercisesColumn>
    ... 



## Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project expects /teacher-dashboard to be deployed at localhost:3000 - that's another zeeguu project
