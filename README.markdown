### dt-init
Like `npm init` but for generating TypeScript definitions and tests stubs.

Usage: `dt-init module-name` which will generate the stubs and retrieve the module
you plan to write the definitions and tests for, resulting a directory tree such as:

    module-name/ 
    ├── module-name.d.ts
    ├── module-name-tests.ts
    ├── node_modules
    └── package.json

After you have finished your TypeScript definitions and tests, 
within *module-name* you can invoke `npm test` to compile and run them.
