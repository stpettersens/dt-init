### dt-init
[![Build Status](https://travis-ci.org/stpettersens/dt-init.png?branch=master)](https://travis-ci.org/stpettersens/dt-init)
[![npm version](https://badge.fury.io/js/dt-init.svg)](http://npmjs.org/package/dt-init)
[![Dependency Status](https://david-dm.org/stpettersens/dt-init.png?theme=shields.io)](https://david-dm.org/stpettersens/dt-init) [![Development Dependency Status](https://david-dm.org/stpettersens/dt-init/dev-status.png?theme=shields.io)](https://david-dm.org/stpettersens/dt-init#info=devDependencies)

Like `npm init` but for generating TypeScript definitions and tests stubs.

Install: `npm install -g dt-init`
    
    Usage: dt-init module-name [-b|--bower gitconfig][--h|--help|-v|--version]
    
    module-name    : Module to generate stubs for.
    -b | --bower   : Also generate a bower.json package file for client-side dependencies.
    gitconfig      : Git configuration file to use for user values (instead of default).
    -h | --help    : Display this usage information and exit.
    -v | --version : Display application version and exit.

Running `dt-init module-name -b` which will generate the stubs (with *package.json* and *bower.json*)  and retrieve the module you plan to write the definitions and tests for, resulting in a directory tree such as:

    module-name/ 
    ├── bower.json
    ├── bower_components
    ├── node_modules
    ├── module-name.d.ts
    ├── module-name-tests.ts
    ├── node_modules
    └── package.json

After you have finished your TypeScript definitions and tests, 
within *module-name* you can invoke `npm test` to compile and run them.

Install the [TypeScript compiler](http://www.typescriptlang.org) first if necessary with: 
`npm install -g typescript`

If you want to use the -b option, you will need to have [Bower](http://bower.io) installed:
`npm install -g bower`

Specify *.gitconfig* parameter if you want to use a different Git configuration
file to the user's default. These values are used in the generated type definitions stubs.
