// @flow
/* eslint no-console: 0 */

/**
 * Подулючаем модуль проверки окружения
 */
import env from './env';

const

    /**
     * Модуль логирования
     * TODO: надо как-то передавать имя окружения, в котором запускаем логгер (метод или функцию)
     *
     * @module log
     *
     * @example
     * log('Hello') // returns console.log(hello)
     * log(['Hello', 2, {}], 'info') // returns console.info(hello, 2, {})
     * log(['%c Hello!', 'background: #ccc; color: black']) // returns with stylize
     *
     * @param  {All} msg сообщение для лога, может быть что угодно
     *                   если передан массив, то аргументом для консоли будет массив,
     *                   и по очереди все значения выведутся, через запятую
     *
     * @param  {String} type необязательный аргумент, можно передать тип лога (log, error, etc.)
     *                       по-умолчанию log
     */
    log = (msg: any, type?: string = 'log'): void => {

        // Проверяем, если мы не на продакшне,
        // то показываем логи
        if (env.hasDev()) {

            try {

                // Передаем в консоль аргументы для вывода
                console[type](...msg);

            } catch (error) {

                console.error('Log: ошибка в модуле', error);

            }

        }

    },

    /**
     * Каррируемое логирование, с приминением стилизации, для лога
     * Просто сокращает запись log(['%c Hello!', 'background: #ccc; color: black'])
     *
     * @example
     * greenLog = logStyle('color: green; font-size: 18px')
     * greenLog('hello Guys') // returns message with styles
     *
     * @param  {String} setup набор стилей для логирования
     * @return {Function} возвращает анонимную функцию, которая вызывает логирование
     */
    logStyle = (setup: string): Function => {

        return (...arg): void => {

            let argForLog: Array<any> = [`%c ${arg[0]}`, setup, ...arg.slice(1)];

            log.call(null, argForLog);

        };

    };

export {
    log,
    logStyle
};