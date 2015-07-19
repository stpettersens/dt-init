### dt-init
Like `npm init` but for generating TypeScript definitions and tests stubs.

Usage: `dt-init module-name` which will generate the following tree:

    my-module/ 
    ├── my-module.d.ts
    ├── my-module-tests.ts
    ├── node_modules
    └── package.json

After you have finished your TypeScript definitions and tests, 
within *my_module* you can invoke `npm test` to compile and run them.

