// @flow

// import { Observable } from 'rxjs/Rx';

import Vue from 'vue';
import App from '../blocks/main/app/scripts/App.vue';
import Popup from './modules/popup/popup.js';

/**
 * Тестирование RxJS
 */
// Observable.of(100).subscribe(console.log);

console.log(1);

let
    Component,
    Component2,
    firstPopup,
    secondPopup,
    thirdPopup,
    singlePopup;

Component = Vue.extend({
    template: '<div class="popup__one">{{ firstContent }}, {{ secondContent }} <input type="text" value="123123"> <button class="tingle-btn tingle-btn--primary" v-on:click="openSecond">Открой второй попап</button></div>',
    data: function() {

        return {
            firstContent: 'My first content',
            secondContent: 'My second content',
            openSecond: function() {

                thirdPopup.close();

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
    modalContent: new Vue(Component).$mount().$el,
    footer: true
});

// Создаем экземпляр второго попапа
secondPopup = new Popup({
    modalContent: new Vue(App).$mount().$el
});

// Создаем третий popup
thirdPopup = Popup.makePopup();

// Создаем попап синглтон
singlePopup = Popup.makeSinglePopup();


/**
 * Инициализация компонента
 */
// new Vue(App).$mount('#app');


/**
 * Инициализация экземпляра Vue "Модальное окно"
 */
new Vue({
    el: '#popup',
    methods: {
        openFirst: function() {

            singlePopup
                .setContent('test1!')
                .open();

            singlePopup
                .init(false)
                .setContent('I\'m back!')
                .setVueComponent(App)
                .setVueComponent(Component2)
                .destroyVueComponent()
                .setVueComponent(Component)
                .open();

        },
        openSecond: function() {

            secondPopup
                .open();

        },
        openThird: function() {

            thirdPopup
                .close()
                .open()
                .destroy()
                .init()
                .sequence([
                    'I\'m back!',
                    new Vue(Component).$mount().$el,
                    new Vue(Component2).$mount().$el,
                    new Vue(App).$mount().$el
                ], 5000);

        },
        openSingle: function() {

            singlePopup.open();

        }
    }
});