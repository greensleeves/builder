// @flow

// import { Observable } from 'rxjs/Rx';

import Vue from 'vue';
import Article from '../blocks/main/article/scripts/Article.vue';

/**
 * Тестирование RxJS
 */
// Observable.of(100).subscribe(console.log);

new Vue(Article).$mount('#app');