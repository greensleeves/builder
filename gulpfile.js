var gulp = require('gulp');
var gulpFromConfig = require('gulp-from-config');
var tasks = [];

global.webpackConfig = require('./webpack.config');

configs = gulpFromConfig.getConfigs();

tasks = gulpFromConfig.createTasks(gulp, configs);

gulp.task('default', tasks);