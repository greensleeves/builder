// @flow

import Vue from 'vue';
import App from '../blocks/main/app/scripts/App.vue';
import { log } from './modules/tools/log';
import meta from './modules/meta';

/**
 * Тестирование RxJS
 */

log(meta());


/**
 * Инициализация компонента
 */
new Vue(App).$mount('#app');