[![Firebase CI](https://github.com/wyhinton/DIYCartographyDisplay/actions/workflows/firebase.js.yml/badge.svg)](https://github.com/wyhinton/DIYCartographyDisplay/actions/workflows/firebase.js.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: Typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg)
[![Framework: React](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg)

![College of Design](/.github/images/cod.jpg)

# 🗺️ Mapping Urban Change: DIY Cartography

Interactive display and archive of students' work from NCSU's Art and Design course, DIY Cartography. Includes a dynamic timeline and sortable database of student-made maps of North Carolina, Wake County, and Raleigh.
Students examine their local geographies through a combination of expressive aesthetics, infographics, collage, and historical research.
This website offers NCSU design college an opportunity to display innovative work by students for recruitment and engagement in an accessible manner, and provides
inspiration and reference for future classes.

Live demo:
[https://studentmapdisplay.web.app/](https://studentmapdisplay.web.app/)

## Quick Start

1. Clone the repository and change directory.

```
git clone https://github.com/wyhinton/DIYCartographyDisplay.git
cd DIYCartographyDisplay
```

2. Install yarn dependencies

```
yarn install
```

3. Run the app locally.

```
yarn start
```

## App Design

- Google Sheets backend, and Google Photos for image hosting
- 100% use of functional react components
- Use of data types as classes to keep data strongly typed and modular
- Centralized state management provided via an [easy-peasy](https://easy-peasy.vercel.app/) store

## Maintenance

- It's possible that the current google spreadsheets API could be deprecated. Google Sheets APIv4 now requires a token, and while v3 is not yet deprecated, a different CMS service might need to be used in the future.
- Google Photo's might change their Photo API, causing a need for the image URL's to be updated in the CMS, sharing options to be changed, etc.

## Browser Stack

- [Material UI](https://material-ui.com/)
- [Evergreen UI](https://evergreen.segment.com/)
- [React Slick ](https://github.com/akiran/react-slick)
- [React-magnifier](https://github.com/samuelmeuli/react-magnifier)
- [React Grid Gallery](https://github.com/benhowell/react-grid-gallery)
- [React Time Series Chart](https://github.com/esnet/react-timeseries-charts)
