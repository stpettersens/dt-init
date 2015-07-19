var gulp = require('gulp'),
     tsc = require('gulp-typescript')
  insert = require('gulp-insert');

var header = '/*\r\ndt-init\r\nUtility to generate TypeScript definitions' +
' and test stubs.\r\nCopyright 2015 Sam Saint-Pettersen.\r\n\r\n' +
'Released under the MIT License.\r\n*/\r\n';

gulp.task('default', function() {
    return gulp.src('*.ts')
    .pipe(tsc({
	module: 'commonjs',
	removeComments: true
    }))
    .pipe(insert.prepend(header))
    .pipe(gulp.dest('.'));
});
