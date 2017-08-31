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

        // Сохраняем ссылку на экземпляр модального окна
        Popup.modals.push(this);

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
     * @param {Boolean} loop - Зацикливать анимаци, либо нет. По умолчанию false
     * @returns {Popup}
     */
    sequence(items = [], delay = 5000, loop = false) {

        let counter,
            seq,
            opts,
            timeoutId;

        counter = 1;
        seq = () => {

            if (counter >= items.length && loop === true) {

                counter = 1;

            }

            if (counter < items.length) {

                this.setContent(items[counter]);

                counter += 1;

                timeoutId = setTimeout(seq, delay);

            }

        };

        opts = this.modal.opts;
        opts.onClose = function() {

            clearTimeout(timeoutId);

        };

        if (items.length > 0) {

            this.setContent(items[0]);

        }
        timeoutId = setTimeout(seq, delay);

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
     * @method makeDraggableModal
     *
     * Создает модальное окно, которое можно двигать в пределах body
     *
     * @param params  Объект параметров модального окна (см. описание Конструктор класса Popup)
     * @returns {Popup|*} - Возвращает экзмепляр класса Popup, котоырй можно двигать
     */
    static makeDraggableModal(params = {}) {

        let el,
            elDims,
            modalBox,
            mouseDown,
            draggableModal,
            moveToCenter;

        // Экземпляр модального окна
        draggableModal = Popup.makePopup(params);

        // html-элемент модального окна
        el = draggableModal.modal.modal;
        // html-элемент содержимого модального окна
        modalBox = draggableModal.modal.modalBox;

        // Получаем размеры элемента модального окна
        elDims = Popup.dimentions(draggableModal.modal);

        // Функция выставляет модальное окно в центр окна браузера
        moveToCenter = () => {

            el.style.left = Math.round(window.innerWidth / 2 - elDims.width / 2) + 'px';
            el.style.top = Math.round((window.pageYOffset + window.innerHeight / 2) - elDims.height / 2) + 'px';

        };

        moveToCenter();

        window.addEventListener('scroll', moveToCenter);
        window.addEventListener('resize', moveToCenter);

        /**
         * @function mouseDown
         *
         * Обработчик события нажатия клавиши мыши на элементе модального окна
         *
         * @param e
         */
        mouseDown = (e) => {

            let coords,
                shiftX,
                shiftY,
                mouseMove,
                mouseUp,
                moveAt;

            // Получаем координаты элемента
            coords = Popup.getCoords(el);

            if (!e.pageX && !e.pageY) {

                e.pageX = e.touches[0].pageX;
                e.pageY = e.touches[0].pageY;

            }

            // Получаем сдвиг курсора мыши относительно
            // левого верхнего угла элемента
            shiftX = e.pageX - coords.left;
            shiftY = e.pageY - coords.top;

            /**
             * @function moveAt
             *
             * Функция отвечает за движение модального окна в пределах document.body
             *
             * @param e
             */
            moveAt = (e) => {

                let newLeft,
                    newTop,
                    rightEdge,
                    bottomEdge;

                if (!e.pageX && !e.pageY) {

                    e.pageX = e.touches[0].pageX;
                    e.pageY = e.touches[0].pageY;

                }

                // Вычисляем левую позицию модального окна
                newLeft = e.pageX - shiftX;
                // Вычисляем верхнюю позицию модального окна
                newTop = e.pageY - shiftY;

                // Не допускаем того, чтобы модальное окно выходило за край
                if (newLeft < 0) {

                    newLeft = 0;

                }
                if (newTop < 0) {

                    newTop = 0;

                }

                // Получаем значение правого края
                rightEdge = document.body.offsetWidth - el.offsetWidth;
                // Получаем значение нижнего края
                bottomEdge = document.body.offsetHeight - el.offsetHeight;

                // Не допускаем того, чтобы модальное окно выходило за край
                if (newLeft > rightEdge) {

                    newLeft = rightEdge;

                }

                if (newTop > bottomEdge) {

                    newTop = bottomEdge;

                }

                // Записываем значения
                el.style.left = newLeft + 'px';
                el.style.top = newTop + 'px';

            };

            /**
             * @function mouseMove
             *
             * Функция, вызывающая функцию moveAt, при движении мыши по экрану
             *
             * @param e
             */
            mouseMove = (e) => {

                moveAt(e);

            };

            /**
             * @function mouseUp
             *
             * Функция отписывает события onmousemove у документа и элемента модального окна
             */
            mouseUp = () => {

                document.onmousemove = null;
                document.removeEventListener('touchmove', mouseMove);

                el.onmousemove = null;
                el.removeEventListener('touchend', mouseUp);

                el.style.zIndex = 8999;

            };

            // Выставляем стили к элементу модального окна
            el.style.position = 'absolute';
            el.style.zIndex = 9000;

            moveAt(e);

            // Вешаем обработчик события движения мыши внутри документа
            document.onmousemove = mouseMove;
            document.addEventListener('touchmove', mouseMove);
            // При отжатии клавиши мыши отписываем события onmousemove, onmousemove
            el.onmouseup = mouseUp;
            el.addEventListener('touchend', mouseUp);

        };

        // Делегируем событие onmousedown на элементе модального окна
        el.onmousedown = mouseDown;
        el.addEventListener('touchstart', mouseDown);

        // Отменяем всплытие события при нажатии клавиши мыши на контенте модального окна
        modalBox.onmousedown = (event) => event.stopPropagation();
        modalBox.addEventListener('touchstart', (event) => event.stopPropagation());

        // Отменяем браузерное событие dragstart
        el.ondragstart = () => false;

        return draggableModal;

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

    /**
     * @static
     * @method getCoords
     *
     * Позволяет получить объект координат элемента на странице
     *
     * @param elem
     * @returns {{top: number, left: number}}
     */
    static getCoords(elem) {

        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }

    /**
     * @static
     * @method dimentions
     *
     * Позволяет получить размеры модального окна
     *
     * @param modal - Экземпляр модального окна
     * @returns {{width: null, height: null}|*}
     */
    static dimentions(modal) {

        let dim, popup;

        popup = modal;

        dim = {
            width: null,
            height: null
        };

        if ( !popup.isOpen() ) {

            document.body.classList.add('tingle-enabled');
            popup.modal.classList.add('tingle-modal--visible');
            popup.modal.style.display = 'block';

            dim.width = popup.modal.offsetWidth;
            dim.height = popup.modal.offsetHeight;

            document.body.classList.remove('tingle-enabled');
            popup.modal.classList.remove('tingle-modal--visible');
            popup.modal.style.display = 'none';

        } else {

            dim.width = popup.modal.offsetWidth;
            dim.height = popup.modal.offsetHeight;

        }

        return dim;

    }

}

export default Popup;