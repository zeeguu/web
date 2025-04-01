# Development Notes

# 1. ⚠️ Clone `--recursive`

Clone with the `--recursive` option, because the repo uses zeeguu/web as a submodule.
We need this because we reuse as much code as possible from zeeguu-web.

```
git clone git@github.com:zeeguu/browser-extension.git --recursive
```

# 2. Building on Windows or MacOs/Linux

### 2.1 Install Dependencies in both extension and the submodule

**Linux/MacOS**

```
npm run installDeps
```

**Windows** 
```
npm run installDepsWindows
```



### 2.2.a. Build for Chrome

Builds the app for Chrome production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

**Linux/MacOS**

```
npm run build
```

**Windows** 

```
npm run buildWindows
```

The build is minified and the filenames include the hashes.\
Go to chrome://extensions/ and unpack the build folder

### 2.2.b. Build for Firefox

In the project directory, you can run:

```
npm run buildFirefox
```

Builds the app for Firefox production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

# 3. Testing the Extension Build

After building the extension, you can test it by going into the extensions in your browser (i.e. chrome://extensions/) and clicking `Load unpacked`. 

![image](https://github.com/zeeguu/browser-extension/assets/17390076/6d7c4b0e-ddbf-406b-9ca0-04b46dc56225)

This will open a File explorer where you should select the `build` folder. This loads the new extension which will connect to the Zeeguu API and can be used for testing.

![image](https://github.com/zeeguu/browser-extension/assets/17390076/a7ea3553-1f89-4ac7-b892-92c595e1dc08)


# (Optional) Building Using Docker

_If you prefer to build using docker you can use this instead of 2._

After cloning the repositories, you can also build the extension using docker, to avoid differences between OSs.

To build the docker image you run:

```
docker build -f Dockerfile.development -t zeeguu_extension .
```

With the image created you can now run the following commands to build the extension:

`docker-compose up build_chrome` for the Chrome Extension and `docker-compose up build_firefox` for the Firefox Extension.

# Notes

## Requires npm: "^8.5.1",

https://nodejs.org/en/download/


## Testing the extension in development mode

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
