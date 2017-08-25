// @flow

/**
 * Модуль определения окружения (переменная окружения определяется на момент сборки webpack-ом)
 * @module env
 */

const

    /**
     * Переменная окружения
     * @type {String | undefined}
     */
    __ENV__ = process.env.NODE_ENV,

    /**
     * Получить окружения
     * @return {String} возвращаем окружение системы
     */
    get = () => __ENV__ || 'development',

    /**
     * Предикат development окружения
     * @return {Bolean} возвращаем булево значение
     */
    hasDev = (): boolean => __ENV__ !== 'production' ? true : false,

    /**
     * Предикат production окружения
     * @return {Bolean} возвращаем булево значение
     */
    hasProd = (): boolean => __ENV__ === 'production' ? true : false;

/**
 * Экспортируем методы
 */
export default {
    get,
    hasDev,
    hasProd
};