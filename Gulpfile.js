/*
  Gulpfile to build dt-init from its TypeScript source.
*/
var gulp = require('gulp'),
      fs = require('fs'),
   _exec = require('child_process').exec,
     tsc = require('gulp-typescript'),
 typedoc = require('gulp-typedoc'),
  rename = require('gulp-rename'),
  insert = require('gulp-insert');

var removeMarkdown = require('gulp-remove-markdown');

var header = '/*\r\ndt-init\r\nUtility to generate TypeScript definitions' +
' and test stubs.\r\nCopyright 2015 Sam Saint-Pettersen.\r\n\r\n' +
'Released under the MIT License.\r\n*/\r\n';

gulp.task('typings', function() {
    _exec('tsd install', function() {});
});

gulp.task('lib', function() {
    return gulp.src('dt-init-lib.ts')
    .pipe(tsc({
    	module: 'commonjs',
    	removeComments: true
    }))
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

gulp.task('doc', function() {
    return gulp.src('*.ts')
    .pipe(typedoc({
        module: 'commonjs',
        out: './doc',
        json: './doc/doc.json'
    }));
});

gulp.task('clean', function() {
    fs.unlinkSync('dt-init-lib.js');
    fs.unlinkSync('dt-init.js');
    fs.unlinkSync('dt-init');
    fs.unlinkSync('README.txt');
});

gulp.task('default', ['lib', 'bin', 'readme'], function(){});
