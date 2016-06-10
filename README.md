# govstrap
A frontend toolkit to build .gov.uk based forms inspired by elements and digital marketplace toolkit.

You can see [Govstrap in action here](http://govstrap.herokuapp.com/).
Or you can include the ['govstrap' NPM package](https://www.npmjs.com/package/govstrap) in your Node app

## Purpose
The idea behind this framework is to build upon the work done in govuk elements, and provide:

### Nunjucks macros, filters and fragments
The primary difference between govstrap and element is that govstrap provides a collection of
reusable nunjucks code that can be used in a project to allow rapid development of form driven
government applications written in node.

This project will be developed in parallel with UKTI web services.

### SASS styles and mixins
The nunjucks macros are created to use the styles created in the GDS Elements and toolkit
projects, but there are additional styles and macros that are required.

### Re-usable ES6 modules
A library of useful javascript components is included with this toolkit. The components
are written in ES6. Currently they have only been tested using ES6 package management (import)
though in theory they could also use require. A transpiler and module bundler such as webpack 
are required to transpile to ES5 and manage dependencies.

Rather then use frameworks like React and Angular, the Javascript modules follow the 'decorator'
pattern, enhancing standard HTML markup.

The project includes a node application that serves a gallery, demonstrating how elements
can be built an used.
