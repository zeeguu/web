# Getting Started with The Zeeguu Reader

The latest version of the code is always online at [Zeeguu Reader Extension on GitHub](https://github.com/zeeguu/browser-extension).

## Requires npm: "^8.5.1",

https://nodejs.org/en/download/

# To Start Developing

## Clone with --recursive

Clone with --recursive, because the repo uses zeeguu/web as a submodule.
We need this because we reuse as much code as possible from zeeguu-web.

```
git clone https://github.com/zeeguu/browser-extension --recursive
```

**Windows Users:** If you are using Windows please note that Git attempts to use the SSH login to clone the repository. So make sure this is configured in your account and use the following command:

```
git clone git@github.com:zeeguu/browser-extension.git --recursive
```

## Using Docker

After cloning the repositories, you can also build the extension using docker, to avoid differences between OSs.

To build the docker image you run:

`docker build -f Dockerfile.development -t zeeguu_extension .`

With the image created you can now run the following commands to build the extension:

`docker-compose up build_chrome` for the Chrome Extension and `docker-compose up build_firefox` for the Firefox Extension.

## Install Dependencies in both extension and submodule

Run the following two steps in order and chose the third based on the desired target platform:

```
npm run installDeps
```

**Windows Users:** In windows the command to use is: `npm run installDepsWindows`

## Build for Chrome

### `npm run build`

Builds the app for Chrome production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

**Windows Users:** In windows the command to use is: `npm run buildWindows`

The build is minified and the filenames include the hashes.\
Go to chrome://extensions/ and unpack the build folder

## Build for Firefox

In the project directory, you can run:

### `npm run buildFirefox`

Builds the app for Firefox production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

## Notes

### Testing the extension in development mode

- we have to add localhost to externally connectable in manifest.json, otherwise chrome.runtime can't
  send a message to the extension from checkExtensionCommunication.js>checkExtensionInstalled()
  (this is captured in manifest.chrome.dev.json - however, i don't like the duplication betweem the two files...)

```
    "externally_connectable": {
        "matches": ["*://*.zeeguu.org/*", "*://localhost/*"]
    },
```

- also, for the communication with Chrome to work one needs to add the id of the extension
  in the .dev.env file (REACT_APP_EXTENSION_ID=...)
- for the communication with Firefox to work in development localhost has to be added to content_scripts; as done in manifest.firefox.dev.json

```
  "content_scripts": [
    {
      "matches": ["*://*.zeeguu.org/*", "*://localhost/*"],
      "js": ["injectOnZeeguuOrg.js"]
    }
  ],
```
