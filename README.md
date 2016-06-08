# govstrap
A frontend toolkit to build .gov.uk based forms inspired by elements and digital marketplace toolkit.

## Purpose
The idea behind this framework is to build upon the work done in govuk elements, and provide:

### Nunjucks macros, filters and fragments
The primary difference between govstrap and element is that govstrap provides a collection of
reusable nunjucks code that can be used in a project to allow rapid deveopment of form driven
government applications written in node client side javascript.

This project will be developed in parallel to the UKTI Datahub project and used to build it's
interface elements.

### SASS styles and mixins
The nunjucks macros are created to use the styles created in the GDS Elements and toolkit
projects, but there are additional styles and macros that are required.

### Re-usable ES2015 modules
Elements and Tool both have javascript written that requires jquery and written pre ES2015
and does not support modules, instead it uses a pattern that lets people write a non ES2015
style module where all code is loaded and scans the page for applicable elements to decorate.

The javascript Govstrap is written takes the form of ES2015 modules which can be imported and
called as needed, so a js file for each page can be created and webpack can also be used to
create common js files.

Additionally the idea of creating macros that are cross compatible with jinja 2 will be investigated.

The project includes a node application that serves a gallery, demonstrating how elements
can be built an used.
