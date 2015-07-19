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
    private module: string;
    private username: string;
    private fullname: string;
    private email: string;
    private license: string;

    private readGitFile(): void {
	var git: Object = gitConfig.sync();
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

    private generatePackage(): void {
        var dt: string = 'dt-' + this.module;
	var def: string = this.module + '.d.ts';
	var tst: string = this.module + '-tests.ts';
	var tstjs: string = this.module + '-tests.js';
	var pkg: Object = {
	    name: dt,
	    version: '0.0.0',
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
	cp.exec('npm install --save ' + this.module, function() {});
    }
    
    public constructor(module: string) {
	if(module == null) {
	   console.log('Please specify a module name.');
           process.exit(1);
	}
	this.module = module;
	console.log('Generating stubs for ' + this.module + '...');
	this.readGitFile();
	this.configure();
	this.createDir();
	this.generatePackage();
	this.generateDefStub();
	this.generateTestStub();
        console.log('Installing module...');
	this.installModule();
    }
} 
export = DTInit;
