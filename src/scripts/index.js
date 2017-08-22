// @flow

import R from 'ramda';
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import Vue from 'vue';
import VueRouter from 'vue-router';
// import App from './App.vue';
import { A } from './A';

let b = (value: string): string => {

    return value + '!';

};

console.log(process.env.NODE_ENV);
console.log(VueRouter);

console.log(A.add(1));
console.log(b('1'));

Rx.Observable.of(1, 2, 3).subscribe(console.log);
Observable.of(1, 2, 3).subscribe(console.log);

console.log(R.add(2)(4));


Vue.use(VueRouter);

new Vue({}).$mount('#app');