// import R from 'ramda';
// import Rx from 'rxjs/Rx';
import Vue from 'vue';
import tingle from 'tingle.js';

import './sass/popup.sass';

class Popup {

    /**
     * @constructs Popup
     *
     * Конструктор класса Popup
     *
     * @param {Object} params - Объект параметров модального окна
     * @param {Function} params.onClose - Функция обратного вызова, выполняется ПОСЛЕ ЗАКРЫТИЯ модального окна
     * @param {Function} params.onOpen - Функция обратного вызова, выполняется ПОСЛЕ ОТКРЫТИЯ модального окна
     * @param {Function} params.beforeClose - Функция обратного вызова, выполняется ДО ЗАКРЫТИЯ модального окна
     * @param {Boolean} params.stickyFooter - При выставленном значении true закрепляет футер на экране
     * @param {Boolean} params.footer - При выставленном значении true показывает футер
     * @param {Array} params.cssClass - Собственные CSS-классы, которые нужно добавить в контейнер модального окна
     * @param {String} params.cssClass - Текст рядом с закрывающей модальное окно кнопкой в мобильной версии
     * @param {Array} params.closeMethods - Доступные методы закрытия окна при клике на (overlay: подложку, button: крестик, escape: клавишу escape)
     *
     * @param {String} {Node} params.modalContent - Содержимое блока модального окна
     */
    constructor(params) {

        // Объект параметров по умолчанию
        const defaultParams = {
            onClose: null,
            onOpen: null,
            beforeClose: null,
            stickyFooter: false,
            footer: false,
            cssClass: [],
            closeLabel: null,
            closeMethods: ['overlay', 'button', 'escape'],

            modalContent: '(✿◠‿◠) Default modal content! (◠‿◠✿)'
        };


        // Если еще не создано ни одного модального окна
        if (!Popup.counter) {

            // Сохраняем счетчик модальных окон через замыкание
            Popup.counter = (function() {

                let counter = 0;
                return function() {

                    return counter++;

                };

            })();

            // Инициализируем массив модальных окон
            Popup.modals = [];

        }

        // Номер модального окна
        this.counter = Popup.counter();

        // Сохраняем ссылку на экземпляр модального окна
        Popup.modals.push(this);

        // Формируем объект параметров модального окна на основе предустановленных
        this.popupParams = Object.assign({}, defaultParams, params);

        // ESLint не нравится, когда конструкторы объявлены с маленькой буквы
        this.TingleModal = tingle.modal;

        // Переопределяем методы tingle.js
        Popup.redefine(this.TingleModal);

        // Свойство для хранения экземпляра Vue
        // для рендеринга вне документа при вызове метода setVueComponent
        this.viewModel = {};

        // Инициализируем модальное окно, но не показываем его
        this.init(false);

    }

    /**
     * @method getParams
     *
     * Возвращает объект параметров
     *
     * @returns {Object} popupParams - Объект параметров попапа
     */
    getParams() {

        return this.popupParams;

    }

    /**
     * @method open
     *
     * Показывает модальное окно
     * @returns {Popup}
     */
    open() {

        this.modal.open();
        return this;

    }

    /**
     * @method close
     *
     * Скрывает модальное окно
     * @returns {Popup}
     */
    close() {

        this.modal.close();
        return this;

    }

    /**
     * @method setContent
     *
     * Добавляет контент в popup-блок
     *
     * @param content {String} - Контент, который мы хотим показать в попапе
     * @returns {Popup}
     */
    setContent(content = '') {

        this.modal.setContent(content);
        return this;

    }

    /**
     * @method getContent
     *
     * Получить содержимое модального окна
     */
    getContent() {

        if (this.modal) {

            return this.modal.getContent();

        }

        return this;

    }

    /**
     * @method setFooterContent
     *
     * Добавляет контент в футер модального окна
     *
     * @param content {String} - Контент, который мы хотим показать в футере
     * @returns {Popup}
     */
    setFooterContent(content = '') {

        this.modal.setFooterContent(content);
        return this;

    }

    /**
     *  @method setVueComponent
     *
     *  Рендерит компонент Vue вне документа,
     *  Помещает компонент Vue в модальное окно
     *  @param {Object} vueComponent - Компонент Vue
     *  @param {String} target - Место в модальном окне, куда мы вставляем Vue-компонент. (modal: в модальное окно, footer: в футер)
     *
     *  @returns {Popup}
     */
    setVueComponent(vueComponent, target = 'modal') {

        this.viewModel = new Vue(vueComponent).$mount();

        // Помещаем контент в модальное окно
        // в зависимости от места назначения
        switch (true) {

            case target === 'footer':
                this.setFooterContent(this.viewModel.$el);
                break;

            case target === 'modal':
                this.setContent(this.viewModel.$el);
                break;

            default:
                this.setContent(this.viewModel.$el);

        }


        return this;

    }

    /**
     * @method destroyVueComponent
     *
     * Уничтожает компонет Vue, очищает все связи, отвязывает директивы, отменяет все подписки на события.
     * Очишает полностью содержимое модального окна.
     *
     * @returns {Popup}
     */
    destroyVueComponent() {

        let viewModel = this.viewModel;

        if (viewModel.hasOwnProperty('_isVue') && viewModel._isVue) {

            this.viewModel.$destroy();

        }

        this.viewModel = {};
        this.setContent();

        return this;

    }

    /**
     * @method checkOverflow
     *
     * Позволяет перестроить модальное окно при загрузке асинхроннного контента
     *
     * @returns {Popup}
     */
    checkOverflow() {

        this.modal.checkOverflow();
        return this;

    }

    /**
     * @method sequence
     *
     * Показывает в модальном окне поочередно элементы с определенным контентом
     *
     * @param {Array} items - Массив элементов контента
     * @param {Number} delay - Время задержки в миллисекундах смены элемента
     *
     * @returns {Popup}
     */
    sequence(items = [], delay = 5000) {

        let counter, seq;
        counter = 1;
        seq = () => {

            if (counter < items.length) {

                this.setContent(items[counter]);

                counter += 1;

                setTimeout(seq, delay);

            }

        };

        if (items.length > 0) {

            this.setContent(items[0]);

        }
        setTimeout(seq, delay);

        return this;

    }

    /**
     * @method init
     *
     * Инициализация модального окна.
     * Добавляет содержимое в модальное окно, показывает его
     *
     * @param {Boolean} open - Отвечает за открытие модального окна при инициализации
     */
    init(open = true) {

        // Кешируем параметры модального окна в переменной
        let popupParams = this.getParams();

        // Создаем экземпляр tingle.modal,
        // если this.modal - undefined или null
        if (!this.modal) {

            this.modal = new this.TingleModal(popupParams);

            // Добавляем css-класс с идентификтором модального окна
            this.modal
                .modal.classList.add('modal-id-' + this.counter);

        }

        // Добавляем контент
        this.setContent(popupParams.modalContent);

        // Открываем модальное окно
        if (open) {

            this.open();

        }
        return this;

    }

    /**
     * @method destroy
     *
     * Удаляет модальное окно из dom-дерева, отвязывает события,
     * выставляет в свойство this.modal значение null
     *
     */
    destroy() {

        this.modal.destroy();
        this.modal = null;
        return this;

    }

    /**
     * @method isOpen
     *
     * Проверяет открыто модальное окно или нет
     *
     * @returns {Boolean}
     */
    isOpen() {

        return this.modal.isOpen();

    }

    /**
     * @static
     * @method makePopup
     *
     * Создает экземпляр модального окна
     *
     * @param params - Объект параметров модального окна (см. описание Конструктор класса Popup)
     * @returns {Popup} - Возвращает экзмепляр класса Popup
     */
    static makePopup(params = {}) {

        return new Popup(params);

    }

    /**
     * @static
     * @method makeSinglePopup
     *
     * Создает синглтон-экземпляр модального окна
     *
     * @param params - Объект параметров модального окна (см. описание Конструктор класса Popup)
     * @returns {Popup.singlePopup} - Возвращает синглтон-экзмепляр класса Popup
     */
    static makeSinglePopup(params = {}) {

        if (!Popup.singlePopup) {

            Popup.singlePopup = new Popup(params);

        }
        return Popup.singlePopup;

    }

    /**
     * @static
     * @method redefine
     *
     * Переопределяет методы класса Modal от tingle.js
     *
     * @param modal - класс Modal от tingle.js
     */
    static redefine(modal) {

        // Переопределяем метод tingle.js setFooterContent
        modal.prototype.setFooterContent = function(content) {

            // check type of content : String or Node
            if (typeof content === 'string') {

                this.modalBoxFooter.innerHTML = content;

            } else {

                this.modalBoxFooter.innerHTML = '';
                this.modalBoxFooter.appendChild(content);

            }

        };

    }

    /**
     * @static
     * @method getModalById
     *
     * Возвращает экземпляр класса Popup по его id,
     * Если нет экземпляра с таким id, метод возвратит null
     *
     * @param {Number} id - идентификатор экземпляра модального окна
     * @returns {*}
     */
    static getModalById(id) {

        let result = null;

        if (Popup.modals && Popup.modals.length > 0) {

            Popup.modals.forEach(function(currentValue) {

                if (id === currentValue.counter) {

                    result = currentValue;
                    return false;

                }

                return true;

            });

        }

        return result;

    }

    /**
     * @static
     * @method getAllModals
     *
     * Возвращает массив с экземплярами класса Popup,
     * Если массив не определен и в нем нет экземпляров, метод возвратит null
     *
     * @returns {*}
     */
    static getAllModals() {

        if (Popup.modals && Popup.modals.length > 0) {

            return Popup.modals;

        }
        return null;

    }

    /**
     * @static
     * @method closeAllModals
     *
     * Закрывает все открытые модальные окна
     */
    static closeAllModals() {

        let allModals;

        allModals = Popup.getAllModals();
        if (allModals) {

            allModals.forEach(function(currentValue) {

                if (currentValue.isOpen()) {

                    currentValue.close();

                }

            });

        }

    }

}

export default Popup;