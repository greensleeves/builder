// @flow

// import { Observable } from 'rxjs/Rx';

import Vue from 'vue';
import App from '../blocks/main/app/scripts/App.vue';

/**
 * Тестирование RxJS
 */
// Observable.of(100).subscribe(console.log);

console.log(1);

/**
 * Инициализация компонента
 */
new Vue(App).$mount('#app');