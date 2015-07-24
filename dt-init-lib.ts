/*
dt-init
Utility to generate TypeScript definitions and test stubs.
Copyright 2015 Sam Saint-Pettersen.

Released under the MIT License.
*/

/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/camel-case/camel-case.d.ts" />
/// <reference path="typings/git-config/git-config.d.ts" />
/// <reference path="typings/chalk/chalk.d.ts" />

import fs = require('fs');
import cp = require('child_process');
import camelCase = require('camel-case');
import gitConfig = require('git-config');
import chalk = require('chalk');

class DTInit {
    private version: string;
    private colors: boolean;
    private module: string;
    private gitFile: string;
    private package: boolean;
    private bower: boolean;
    private username: string;
    private fullname: string;
    private email: string;
    private license: string;

    private printError(message: string): void {
        if(this.colors) {
            console.log(chalk.bold.red(message));
        }
        else console.log(message);
    }

    private printInfo(message: string): void {
        if(this.colors) {
            console.log(chalk.gray(message));
        }
        else console.log(message);
    }

    private hilight(text: string): any {
        if(this.colors) {
            return chalk.yellow(text);
        }
        return text;
    }

    private bolden(text: string): any {
        if(this.colors) {
            return chalk.bold.white(text);
        }
        return text;
    }

    private writeConfig(force?: boolean): void {
      	var git: Object = gitConfig.sync()
      	if(this.gitFile != null) {
      	    git = gitConfig.sync(this.gitFile);
      	}
        this.fullname = git['user']['name'];
        this.email = git['user']['email'];
  	    var config: Object = {
           colors: true,
  	       username: 'YOUR_USERNAME',
  	       fullname: this.fullname,
  	       email: this.email
  	    };
  	    if(!fs.existsSync('dt-init-config.json') || force) {
  	       fs.writeFileSync('dt-init-config.json', JSON.stringify(config, null, 4));
  	    }
    }

    private configure(): void {
      	var cf: any = fs.readFileSync('dt-init-config.json');
      	var config: Object = JSON.parse(cf);
        this.colors = config['colors'];
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
       if(this.package)
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
      	if(this.package) cp.exec('npm install --save ' + this.module, function() {});
    }

    private displayVersion(): void {
        this.printInfo('dt-init v. ' + this.version);
        process.exit(0);
    }

    private displayHelp(): void {
        this.printInfo('Utility to generate TypeScript definitions and test stubs.');
        this.printInfo('Copyright 2015 Sam Saint-Pettersen ' + this.hilight('[MIT License].'));
        console.log('\nUsage: ' + this.bolden('dt-init') + ' module-name [-b|--bower|-d|--def-only gitconfig][-h|--help|-v|--version|');
        console.log('\t-c|--configure]\n');
        console.log('module-name      : Module to generate stubs for.');
        console.log('-b | --bower     : Also generate a bower.json package file for client-side dependencies.');
        console.log('-d | --def-only  : Only generate definition and tests.');
        console.log('gitconfig        : Git configuration file to use for user values (instead of default).');
        console.log('-h | --help      : Display this usage information and exit.');
        console.log('-v | --version   : Display application version and exit.');
        console.log('-c | --configure : Write configuration file and exit (destructive).');
    }

    public constructor(module: string, option?: string, gitFile?: string) {
        this.version = '1.0.12';
      	this.gitFile = null;
        this.package = true;
        this.bower = false;
        this.colors = true;
        this.writeConfig();
        this.configure();
      	if(gitFile != null) {
      	  this.gitFile = gitFile;
      	}
        if(module == '-c' || module == '--configure') {
            this.printInfo('Generating configuration file...');
            this.writeConfig(true);
            process.exit(0);
        }
        else if(module == '-h' || module == '--help') {
          this.displayHelp();
          process.exit(0);
        }
        else if(module == '-v' || module == '--version') {
          this.displayVersion();
        }
      	if(module == null || module[0] == '-') {
          this.printError('Please specify a valid module name.\n');
          this.displayHelp();
          process.exit(1);
      	}
      	this.module = module;
      	this.printInfo('Generating stubs and/or installing module(s) for ' + this.bolden(this.module));
      	this.createDir();
        if(option == '-b' || option == '--bower') {
            this.bower = true;
            this.generateBowerPackage();
        }
        if(option == '-d' || option == '--def-only') {
            this.package = false;
        }
        this.generateNpmPackage();
      	this.generateDefStub();
      	this.generateTestStub();
      	this.installModule();
    }
}
export = DTInit;
