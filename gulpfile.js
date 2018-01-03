/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: gulp 默认配置
 */
'use strict';

const gulp = require('gulp'),
nodemon    = require('gulp-nodemon');

gulp.task('develop',  () => {
    nodemon({
        script : 'index.js',
        ext    : 'html js',
        ignore : ['ignored.js']
    }).on('restart', () => {
        console.log('restarted!')
    })
})

gulp.task('server',['develop'], () => {
    console.log('reload!')
    gulp.watch(['app/**/*.js','*.js']);
})

gulp.task('default', ['server']);

