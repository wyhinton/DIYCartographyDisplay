[![Firebase CI](https://github.com/wyhinton/DIYCartographyDisplay/actions/workflows/firebase.js.yml/badge.svg)](https://github.com/wyhinton/DIYCartographyDisplay/actions/workflows/firebase.js.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: Typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg)
[![Framework: React](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg)

# Mapping Urban Change: DIY Cartography
Interactive display and archive of students' work from the class DIY cartography. Includes a dynamic timline and sortable database of student-made maps of North Carolina, Wake County, and Raleigh.
Students examine their local geographies through a combination of expressive aesthetics, infographics, collage, and historical research. 
This website offers NCSU design college an opportunity to display innovative work by students for recruitment and engagement in an accesible manner, and provides 
inspiration and reference for future classes. 

# Table of Contents
- [Quick Start](#quick-start)
- [Dev Environment](#dev-environment)
  - [Chrome Plugins](#chrome-plugins)
  - [VSCode](#vs-code)
  - [CLIs](#clis)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Configs](#configs)
- [Documentation](#documentation)

# Quick Start

1. Clone the repository and change directory.

```
git clone https://github.com/wyhinton/DIYCartographyDisplay.git
cd react-image-compressor
```

2. Install yarn dependencies

```
yarn install
```

3. Run the app locally.

```
yarn start
```

# Dev Environment
## Chrome Plugins 
- [Redux DevTool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) - for debugging application's state
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - inspect the React component hierarchies 
## VSCode
## CLIs 
- git
- yarn

# Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn doc`
Outputs a README.md via the jsdoc-to-markdown package. See [Documentation](#documentation) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Prerequisites
Prerequisites
  - Experience with React or similar JS front end Framework
  - Experience with typescript or other typed programming lanaguage
  - Experience with git 
  - See [typescript-cheatsheets] for comprehensive getting started guide to using Typescript and React
# Configs
## Typescript
### ```tsconfig.json```
Describes the settings type script compiler with use for the project. This projects tsconfig is the default one geneated by ```npx create-react-app my-app --template typescript```. For a full list of settings see [this page](https://www.typescriptlang.org/tsconfig) from the official typescript docs. 
### ```decs.d.ts```
Describe the shape of JavaScript values to the TypeScript compiler. Or put another way, it is the way to describe, (usually in an external file), the types present in an external JavaScript code. Allows us to use javascript libaries which like type definitions.
## Firebase
### ```firebase.json```
Configuration options for our firebase project. Notably the ```public``` is set to our ```build``` folder rather than ```public```. We need to build our project with ```yarn build``` if we want our deployment to update with changes from our ```src```.
### ```.firebaserc```
Specifies the deploy target for our app, in this case, my personal project in my personal firebase account, "studentmapdisplay".
## Eslint
### ```.eslintrc```
### ```.eslintignore```
## JSDoc
### ```jsdoc.conf.json```
Configures jsdoc settings.
### ```README_TEMPLATE.hbs```
Provides jsdoc-to-markdown with template markdown. See [Create a README template](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/Create-a-README-template) from the jsdoc-to-markdown wiki. Documentation not generated via JSDoc Comments is added.

# Components

- `Lightbox`


<a name="App"></a>

## App()
<p>Core component, intializet request for sheet data via fetchStudentSheets and fetchEventSpreadsheet</p>

**Kind**: global function  

* * *

# Documentation

&copy; 2016-Present NCSU