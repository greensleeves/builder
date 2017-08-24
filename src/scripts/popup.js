// import R from 'ramda';
// import Rx from 'rxjs/Rx';
import tingle from 'tingle.js';
import 'tingle.js/dist/tingle.min.css';

class Popup {

    constructor(params) {

        const defaultParams = {
            onClose: null,
            onOpen: null,
            beforeClose: null,
            stickyFooter: false,
            footer: false,
            cssClass: [],
            closeLabel: 'Close',
            closeMethods: ['overlay', 'button', 'escape'],

            modalContent: ''
        };

        this.popupParams = Object.assign({}, defaultParams, params);

        this.modal = new tingle.modal(this.popupParams);

    }

    /**
     * @method getParams
     *
     * Возвращает объект параметров
     * @returns {object} объект параметров попапа
     */
    getParams() {

        return this.popupParams;

    }

    /**
     * @method open
     *
     * Показывает попап
     */
    open() {

        this.modal.open();

        return this;

    }

    /**
     * @method close
     *
     * Скрывает попап
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
     * @param content {String} - контент, который мы хотим показать в попапе
     */
    setContent(content) {

        this.modal.setContent(content);

        return this;

    }

    /**
     * @method init
     *
     * Инициализация попапа.
     * Добавляем содержимое попапа, показываем его
     *
     */
    init() {

        let popupParams = this.getParams();

        // Добавляем контент
        this.setContent(popupParams.modalContent);

        // Показываем попап
        this.open();

        return this;

    }

}

export default Popup;