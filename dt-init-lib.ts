/*
dt-init
Utility to generate TypeScript definitions and test stubs.
Copyright 2015 Sam Saint-Pettersen.

Released under the MIT License.
*/

/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/camel-case/camel-case.d.ts" />
/// <reference path="typings/git-config/git-config.d.ts" />

import fs = require('fs');
import cp = require('child_process');
import camelCase = require('camel-case');
import gitConfig = require('git-config');

class DTInit {
    private version: string;
    private module: string;
    private gitFile: string;
    private bower: boolean;
    private username: string;
    private fullname: string;
    private email: string;
    private license: string;

    private readGitFile(): void {
      	var git: Object = gitConfig.sync()
      	if(this.gitFile != null) {
      	    git = gitConfig.sync(this.gitFile);
      	}
  	    this.fullname = git['user']['name'];
  	    this.email = git['user']['email'];
  	    var config: Object = {
  	       username: 'YOUR_USERNAME',
  	       fullname: this.fullname,
  	       email: this.email
  	    };
  	    if(!fs.existsSync('dt-init-config.json')) {
  	       fs.writeFileSync('dt-init-config.json', JSON.stringify(config, null, 4));
  	    }
    }

    private configure(): void {
      	var cf: any = fs.readFileSync('dt-init-config.json');
      	var config: Object = JSON.parse(cf);
      	this.username = config['username'];
      	this.fullname = config['fullname'];
      	this.email = config['email'];
      	this.license = config['license'];
    }

    private createDir(): void {
      	 fs.mkdirSync(this.module);
    }

    private generateNpmPackage(): void {
        var dt: string = 'dt-' + this.module;
  	    var def: string = this.module + '.d.ts';
  	    var tst: string = this.module + '-tests.ts';
  	    var tstjs: string = this.module + '-tests.js';
  	    var pkg: Object = {
      	    name: dt,
      	    version: '0.0.0',
            description: 'TypeScript definitions and tests for ' + this.module,
      	    main: def,
      	    scripts: {
    		    test: 'tsc --module commonjs ' + tst + ' && node ' + tstjs
    	     },
    	     keywords: [
    		    'type definitions ' + this.module
    	     ],
    	     author: this.fullname + ' <' + this.email + '>',
    	     license: this.license
    	  };
  	   fs.writeFileSync(this.module + '/package.json', JSON.stringify(pkg, null, 4));
    }

    private generateBowerPackage(): void {
        var dt: string = 'dt-' + this.module;
        var def: string = this.module + '.d.ts';
        var dep: Object = {};
        dep[this.module] = 'latest';
        var pkg: Object = {
            name: dt,
            version: '0.0.0',
            description: 'TypeScript definitions and tests for ' + this.module,
            main: def,
            dependencies: dep,
            authors: [
              this.fullname + ' <' + this.email + '>'
            ],
            license: this.license,
            keywords: [
              'type',
              'definitions',
              this.module
            ],
            ignore: [
              '**/.*',
              'node_modules',
              'bower_components',
              'test',
              'tests'
            ]
        };
        fs.writeFileSync(this.module + '/bower.json', JSON.stringify(pkg, null, 4));
    }

    private generateDefStub(): void {
      	var def: string = '// Type definitions for ' + this.module + '\r\n' +
      	'// Project: https://github.com/USERNAME/' + this.module + '\r\n' +
      	'// Definitions by: ' + this.fullname + ' <https://github.com/' +
      	this.username + '>\r\n// Definitions: https://github.com/borisyankov/' +
      	'DefinitelyTyped\r\n\r\ndeclare module "' + this.module + '" {\r\n' +
      	'    // Implementation here...\r\n}';
      	fs.writeFileSync(this.module + '/' + this.module + '.d.ts', def);
    }

    private generateTestStub(): void {
      	var tests: string = '/// <reference path="' + this.module + '.d.ts" />\r\n' +
      	'\r\nimport ' + camelCase(this.module) + ' = require(\'' + this.module + '\');\r\n\r\n' +
      	'// Tests here...\r\n';
      	fs.writeFileSync(this.module + '/' + this.module + '-tests.ts', tests);
    }

    private installModule(): void {
      	process.chdir(this.module);
        if(this.bower) cp.exec('bower install', function() {});
      	cp.exec('npm install --save ' + this.module, function() {});
    }

    private displayVersion(): void {
        console.log('dt-init v. ' + this.version);
        process.exit(0);
    }

    private displayHelp(): void {
        console.log('Utility to generate TypeScript definitions and test stubs.');
        console.log('Copyright 2015 Sam Saint-Pettersen [MIT License]\n');
        console.log('Usage: dt-init module-name [-b|--bower gitconfig][-h|--help|-v|--version]\n');
        console.log('module-name    : Module to generate stubs for.');
        console.log('-b | --bower   : Also generate a bower.json package file for client-side dependencies.');
        console.log('gitconfig      : Git configuration file to use for user values (instead of default).');
        console.log('-h | --help    : Display this usage information and exit.');
        console.log('-v | --version : Display application version and exit.');
    }

    public constructor(module: string, bower?: string, gitFile?: string) {
        this.version = '1.0.8';
      	this.gitFile = null;
        this.bower = false;
      	if(gitFile != null) {
      	  this.gitFile = gitFile;
      	}
        if(module == '-h' || module == '--help') {
          this.displayHelp();
          process.exit(0);
        }
        else if(module == '-v' || module == '--version') {
          this.displayVersion();
        }
      	if(module == null || module[0] == '-') {
          console.log('Please specify a valid module name.\n');
          this.displayHelp();
          process.exit(1);
      	}
      	this.module = module;
      	console.log('Generating stubs and installing module(s) for ' + this.module + '...');
      	this.readGitFile();
      	this.configure();
      	this.createDir();
        if(bower == '-b' || bower == '--bower') {
            this.bower = true;
            this.generateBowerPackage();
        }
        this.generateNpmPackage();
      	this.generateDefStub();
      	this.generateTestStub();
      	this.installModule();
    }
}
export = DTInit;
