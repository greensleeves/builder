/**
 * Глобальные переменные
 */

// Конфиг для вебпака
global.webpackConfig = require('./src/configs/webpack.config');

/**
 * Объявляем константы, используемые при сборке
 */
const
    gulp = require('gulp'),
    gulpFromConfig = require('gulp-from-config'),
    clean = require('gulp-clean'),
    minimist = require('minimist');

var

    // Хранилище для задач сборки
    tasks = [],

    // Конфиги, для задач
    configs;

// Получаем конфиги для сборки
configs = gulpFromConfig.getConfigs('./src/configs/common');

// Формируем задачи для сборки
tasks = gulpFromConfig.createTasks(gulp, configs);

/**
 * Задача удаления папки, куда собирается билд.
 * В зависимости от окружения, очищается либо dest либо prod
 * @return {Gulp} возвращаем галп
 */
gulp.task('clean', function() {

    // уть для очистки, по-умолчанию дев
    const pathForClean = './dest';

    // Если собираем на прод, то меняем папку
    if (minimist(process.argv).env === 'prod') {

        pathForClean = './prod';

    }

    return gulp.src(pathForClean)
        .pipe(clean());

});

/**
 * Устанавливаем задачу по-умолчанию
 */
gulp.task('default', ['clean'], function() {

    gulp.start(tasks);

});