# Building from Source for Firefox

This additional README file is required when uploading the extension to Firefox.f

## requires  npm: "^8.5.1",
https://nodejs.org/en/download/

## Building from Sources
In the project directory run:

### `npm run installAllDependencies`

This command installs a package and any packages that it depends on.

### `npm run buildFirefox`

Builds the app for Firefox production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.


# Note
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
