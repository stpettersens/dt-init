### dt-init
<!--[![Build Status](https://travis-ci.org/stpettersens/dt-init.png?branch=master)](https://travis-ci.org/stpettersens/dt-init)-->
[![npm version](https://badge.fury.io/js/dt-init.svg)](http://npmjs.org/package/dt-init)
[![Dependency Status](https://david-dm.org/stpettersens/dt-init.png?theme=shields.io)](https://david-dm.org/stpettersens/nodeGaudi) [![Development Dependency Status](https://david-dm.org/stpettersens/node-magic-number/dev-status.png?theme=shields.io)](https://david-dm.org/stpettersens/node-magic-number#info=devDependencies)

Like `npm init` but for generating TypeScript definitions and tests stubs.

Usage: `dt-init module-name` which will generate the stubs and retrieve the module
you plan to write the definitions and tests for, resulting in a directory tree such as:

    module-name/ 
    ├── module-name.d.ts
    ├── module-name-tests.ts
    ├── node_modules
    └── package.json

After you have finished your TypeScript definitions and tests, 
within *module-name* you can invoke `npm test` to compile and run them.
