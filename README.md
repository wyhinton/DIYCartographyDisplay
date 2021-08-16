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
- Centralized state management provided via an [easy-peasy](https://easy-peasy.vercel.app/) store

## Maintenance

- Adding more student maps:
  1. Add info to CMS systems
     1. Upload the maps to the diycartography@gmail.com Google Photos account
     2. Hit the "Add Sheet button" on our active Google Sheet. Using the exact same format for years 2016/2018/2020, Input all the data for the students into the new sheet. Make sure to fill any empty values with an "NA".
  2. Update the source code
     1. Add the new sheet to the pool of requested sheets
     2. Add new enum variants for the class year to the `AuthorDisciplineFilter` and `FilterGroup` enums
     3. Add a new section to the Toolbar component
  3. Build and deploy
     1. A github action is set up to build, then deploy the build, to Firebase hosting. This action is triggered when pushing to the repo. So just run `git add .`, `git commit -m 'my update'`, `git push`, and you should see the action boot up.
-

## Notes

- This project contains slightly modified versions of the source libraries for [React Time Series Chart](https://github.com/esnet/react-timeseries-charts) and [React Grid Gallery](https://github.com/benhowell/react-grid-gallery). The modifications to React Time Series chart allow for circular event markers, while the modifications to React Grid Gallery removes the built in Lightbox component and enables smoother image loading.
- The only environment variables in use here is an api token for using v4 of the google sheets API.
- This project uses the free Google Sheets API tier. This means there is a limit 500 requests per 100 seconds, and 100 requests per 100 seconds per user. There is no daily usage limit. See [https://developers.google.com/sheets/api/reference/limits](https://developers.google.com/sheets/api/reference/limits)

## Browser Stack

- [Material UI](https://material-ui.com/) - Theming, grid layouts, and ui components
- [Evergreen UI](https://evergreen.segment.com/) - Icons, UI components
- [React Slick ](https://github.com/akiran/react-slick) - Lightbox image carousel
- [React-magnifier](https://github.com/samuelmeuli/react-magnifier) - Magnifying lightbox images
- [React Grid Gallery](https://github.com/benhowell/react-grid-gallery) - Justified gallery of all the map images
- [React Time Series Chart](https://github.com/esnet/react-timeseries-charts) - Timeline
- []
