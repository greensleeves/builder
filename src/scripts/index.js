// @flow

import Vue from 'vue';
import App from '../blocks/main/app/scripts/App.vue';
// import { log } from './modules/tools/log';
import meta from './modules/meta';
import Popup from './modules/popup/popup.js';

meta();


let
    firstExamplePopup,
    secondExamplePopup,
    thirdExamplePopup,
    fourthExamplePopup,
    sixthExamplePopup,

    myComponent;


// Создаем экземпляр первого попапа
firstExamplePopup = new Popup();

// Создаем экземпляр второго попапа
secondExamplePopup = new Popup();

// Создаем экземпляр третьего попапа
thirdExamplePopup = Popup.makePopup();

// Создаем экземпляр четвертого попапа (синглтон)
fourthExamplePopup = Popup.makeSinglePopup({
    cssClass: ['tingle__singleton'],
    footer: true
});

// Создаем экземпляр шестого попапа
sixthExamplePopup = Popup.makePopup();

/**
 * Инициализация компонента
 */
new Vue(App).$mount('#app');

myComponent = Vue.extend({
    data: function() {

        return {
            userPhoto: null,
            isLoading: false,
            message: 'My component!',
            id: 100001613004229,
            users: [
                4,
                100001613004229,
                100009671689801
            ]
        };

    },
    template: [
        '<div class="profile" v-bind:class="{loading: isLoading}">',
        '<h2>{{ message }}</h2>',
        '<div v-if="userPhoto">',
        '<img v-bind:src="userPhoto" alt=""/>',
        '</div>',
        '<select v-model.number="id">',
        '<option v-for="user in users" v-bind:value="user">{{ user }}</option>',
        '</select>',
        '<label for="id">User id:</label><input id="id" v-model.number="id" type="number"><button v-on:click="getUserPhoto(id)" v-bind:disabled="isLoading">Получить фото</button>',
        '</div>'
    ].join(''),
    methods: {
        getUserPhoto: function(id) {

            let url, self;

            url = 'https://graph.facebook.com/' + id + '/picture?type=large';
            self = this;

            self.message = 'Loading!';
            self.isLoading = true;
            fetch(url).then(function(response) {

                if (response.ok) {

                    return response;

                }

                self.isLoading = false;
                self.message = 'Network response was not ok.';
                throw new Error(self.message);

            }).then(function(response) {

                self.userPhoto = response.url;
                self.isLoading = false;
                self.message = 'My component!';

            });


        }
    },
    created: function() {

        this.getUserPhoto(this.id);

    }

});

/**
 * Инициализация экземпляра Vue "Модальное окно"
 */
new Vue({
    el: '#popup',
    methods: {
        firstExample: function() {

            firstExamplePopup
                .open();

            setTimeout(function() {

                firstExamplePopup
                    .setContent('This is first example popup!');

            }, 3000);


        },
        secondExample: function() {

            secondExamplePopup
                .setContent('<div>Привет! Я Гендальф Серый! Бегите, глупцы! <i class="icon icon--gray">&#9731;</i></div>')
                .open();

            setTimeout(function() {

                secondExamplePopup
                    .destroy()
                    .init(false)
                    .setContent('<div>Привет! Я Гендальф Белый! <i class="icon icon--white">&#9731;</i></div>')
                    .open();

            }, 4000);

        },
        thirdExample: function() {

            thirdExamplePopup
                .setVueComponent(App)
                .open();

        },
        fourthExample: function() {

            fourthExamplePopup
                .setVueComponent(App)
                .setVueComponent(App, 'footer')
                .open();

        },
        fifthExample: function() {

            let timeoutId;

            firstExamplePopup.open();
            secondExamplePopup.open();
            thirdExamplePopup.open();
            fourthExamplePopup.open();

            timeoutId = setTimeout(function() {

                Popup.closeAllModals();
                clearTimeout(timeoutId);

            }, 3000);

        },
        sixthExample: function() {

            sixthExamplePopup
                .setVueComponent(myComponent)
                .open();

        }
    }
});