// @flow

import Vue from 'vue';
import App from '../blocks/main/app/scripts/App.vue';
import log from './modules/tools/log';

/**
 * Тестирование RxJS
 */

log(['Привет', { a: 2 }]);
log(['Привет', 2, 'рама', 'ramda'], 'info');
log([2, 'ошибка'], 'error');


/**
 * Инициализация компонента
 */
new Vue(App).$mount('#app');