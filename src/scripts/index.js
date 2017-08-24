// @flow

import R from 'ramda';
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import Vue from 'vue';
import VueRouter from 'vue-router';
// import App from './App.vue';
import { A } from './A';
import Popup from './popup.js';

let b = (value: string): string => {

    return value + '!';

};

var Component, Component2, firstPopup, secondPopup;

console.log(process.env.NODE_ENV);
console.log(VueRouter);

console.log(A.add(1));
console.log(b('1'));

Rx.Observable.of(1, 2, 3).subscribe(console.log);
Observable.of(1, 2, 3).subscribe(console.log);

console.log(R.add(2)(4));


Vue.use(VueRouter);

Component = Vue.extend({
    template: '<div class="popup__one">{{ firstContent }}, {{ secondContent }} <input type="text" value="123123"> <button class="tingle-btn tingle-btn--primary" v-on:click="openSecond">Открой второй попап</button></div>',
    data: function() {

        return {
            firstContent: 'My first content',
            secondContent: 'My second content',
            openSecond: function() {

                firstPopup.close();

                secondPopup.init();

            }
        };

    }
});

Component2 = Vue.component('my-component', {
    data: function() {

        return {
            name: 'Имя компонента: my-component'
        };

    },
    template: '<div>Пользовательский компонент! {{ name }}</div>',

});

// Создаем экземпляр первого попапа
firstPopup = new Popup({
    modalContent: new Component().$mount().$el,
    footer: true
});

// Создаем эксемпляр второго попапа
secondPopup = new Popup({
    modalContent: new Component2().$mount().$el
});

new Vue({
    el: '#app',
    methods: {
        openFirst: function() {

            firstPopup.init();

        },
        openSecond: function() {

            secondPopup.init();

        }
    }
});