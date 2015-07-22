/*
  Gulpfile to build dt-init from its TypeScript source.
*/
var gulp = require('gulp'),
      fs = require('fs'),
    exec = require('child_process').exec,
     tsc = require('gulp-typescript'),
  rename = require('gulp-rename'),
  insert = require('gulp-insert');
  
var removeMarkdown = require('gulp-remove-markdown');

var header = '/*\r\ndt-init\r\nUtility to generate TypeScript definitions' +
' and test stubs.\r\nCopyright 2015 Sam Saint-Pettersen.\r\n\r\n' +
'Released under the MIT License.\r\n*/\r\n';

var typings = ['node', 'camel-case', 'git-config'];

gulp.task('typings', function() {
    if(!fs.existsSync('typings')) {
      for(var i = 0; i < typings.length; i++) {
        exec('tsd install ' + typings[i], function() {});
      }
    }
    else {
      console.log('\nDefinitions already present, skipping...\n');
    }
});

gulp.task('lib', function() {
    return gulp.src('dt-init-lib.ts')
    .pipe(tsc({
	     module: 'commonjs',
	     removeComments: true
    }))
    .pipe(insert.prepend(header))
    .pipe(gulp.dest('.'));
});

gulp.task('bin', function() {
    return gulp.src('dt-init.ts')
    .pipe(tsc({
	     module: 'commonjs',
	     removeComments: true
    }))
    .pipe(insert.prepend(header))
    .pipe(insert.prepend('#!/usr/bin/env node\n'))
    .pipe(gulp.dest('.'))
    .pipe(rename('dt-init'))
    .pipe(gulp.dest('.'));
});

gulp.task('readme', function() {
    return gulp.src('README.markdown')
    .pipe(removeMarkdown())
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function() {
    fs.unlinkSync('dt-init-lib.js');
    fs.unlinkSync('dt-init.js');
    fs.unlinkSync('dt-init');
    fs.unlinkSync('README.txt');
});

gulp.task('default', ['lib', 'bin', 'readme'], function(){});
