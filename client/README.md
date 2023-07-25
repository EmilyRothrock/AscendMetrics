# Codebase Organization
Below you will find details about the directories and files of the **client** module of the AscendMetrics project.
## public
Contains any static files that will be served as they are e.g. images, icons, and sometimes html.
## src
### assets
Contains static files that the code will reference e.g. images, fonts, or additional CSS files.
### components
Contains all the React components, the building blocks of UI.
### features
As opposed to page-based organization, this encourages the flexible reuse of code between pages
### services
Contains code related to making API calls or other services.
### utils
Contains utility functions e.g. date formatters, validators, or helper functions.
### vite-env.d.ts
This file is for declaring types for any global variables that are provided via environment variables or other global configuration.
## .eslintrc.cjs
This file is for configuring ESLint, which is a tool that analyzes your code and catches common bugs as well as enforcing a style guide.
## tsconfig.json and tsconfig.node.json
These files are used to specify the root files and the compiler options required to compile the project. The tsconfig.node.json is a specific TypeScript configuration for Node.js development.
## vite.config.ts
This file is for Vite configuration. You can specify plugins and other Vite options here. It's read by Vite to determine how to bundle and serve your app.