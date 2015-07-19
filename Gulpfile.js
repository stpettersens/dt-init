var gulp = require('gulp'),
      fs = require('fs'),
     tsc = require('gulp-typescript'),
  rename = require('gulp-rename'),
  insert = require('gulp-insert');

var header = '/*\r\ndt-init\r\nUtility to generate TypeScript definitions' +
' and test stubs.\r\nCopyright 2015 Sam Saint-Pettersen.\r\n\r\n' +
'Released under the MIT License.\r\n*/\r\n';

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

gulp.task('clean', function() {
    fs.unlinkSync('dt-init-lib.js');
    fs.unlinkSync('dt-init.js');
    fs.unlinkSync('dt-init');
});

gulp.task('default', ['lib', 'bin'], function(){});
