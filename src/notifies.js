/**
 * @typedef {"error" | "success" | "info" | "warn"} notifyTypes
 */

/**
 * @typedef {"fixed" | "block"} displayTypes
 */

/**
 * @author Bychkov Leonid <bychkov.l47@mail.ru>
 * @description Класс для показа уведомлений с возможностью вывода заголовка, текста, кнопки с действием
 * @version 2.0.0
 */
class Notify {
    /**
     * Номер текущей версии
     * @private
     * @type {string}
     */
    #version = "2.0.0";

    /**
     * Определяет, куда выводить уведомление, если {@link Notify#displayType} передано со значением **block**
     * @private
     * @type {(HTMLElement | HTMLDivElement | string)}
     */
    #whereToRender

    /**
     * Тип сообщения - Ошибка, Успех, Информация, Предупреждение
     * @private
     * @type {notifyTypes}
     * @default "info"
     * @example type: "error" | "success" | "info" | "warn"
     */
    #type= "info";

    /**
     * Заголовок уведомления
     * @public
     * @default ""
     * @type {?string}
     */
    title = "";

    /**
     * Позиция вывода всплывающего уведомления, если ```[this.displayType]{@link Notify#displayType} === "fixed"```
     * @public
     * @type {string}
     * @default "top right"
     * @example position: "top right" | "top left" | "bottom right" | "bottom left"
     */
    position= "top right";

    /**
     * Тип уведомления - всплывающий или показывающийся рядом в определённом месте
     * @public
     * @type {displayTypes}
     * @default "fixed"
     * @example
     * // всплывающий блок
     * displayType: "fixed"
     *
     * // блок в определенном месте
     * displayType: "block"
     */
    displayType= "fixed";

    /**
     * Куда выводить ошибку. Если ```[this.position]{@link Notify#position}==="block"```, то берется options.whereToRender, иначе ".mm-notifies-wrapper.fixed";
     * @param {(string | HTMLElement)}
     * @public
     * @default ".mm-notifies-wrapper.fixed"
     */
    selector = ".mm-notifies-wrapper.fixed";

    /**
     * Текст сообщения
     * @type {?string}
     * @default ""
     */
    text= ""

    /**
     * Время в мс, через которое закроется всплывающее уведомление (при [this.position]{@link Notify#position} === "fixed")
     * @public
     * @type {number}
     * @default 3000
     */
    closeTime= 3000;

    /**
     *
     * @private
     * @type {number}
     */
    #closeTimeoutFunction   // Сюда помещается результат setTimeout(() => {}, _closeTime);

    /**
     * DOM элемент уведомления
     * @public
     * @type {HTMLElement}
     */
    elem = null;

    /**
     * Содержит ли всплывающее уведомление кнопку
     * @private
     * @type {boolean}
     * @default false
     */
    #hasButton= false

    /**
     * Настройка кнопки в уведомлении
     * @public
     * @type {?object}
     * @property {string} text - Текст на кнопке
     * @property {function} callback - функция, которая будет вызвана при клике на кнопку
     * @default {}
     * @example
     * // Настройка кнопки
     * {
     *      text: "Я кнопка",
     *      callback: alert("Нажатие на кнопку")
     * }
     *
     * // Кнопка перехода в корзину
     * {
     *     text: "В корзину",
     *     callback: window.open("/personal/cart", "_blank")
     * }
     */
    buttonConfig = {}

    /**
     * Заливать фон уведомления цветом? Учитывается при [this.displayType]{@link Notify#displayType} === "fixed"
     * @public
     * @type {boolean}
     * @default false
     */
    filledBackground = false

    /**
     * Путь до папки с svg-иконками. Символ "/" в конце не нужен.
     * * Если ```options.searchIconsNearJS: true```, то <path_to_js>/icons
     * * Если ```options.searchIconsNearJS: false```, то "/local/templates/.default/vendor/notifies-<версия>/icons"
     *
     * @public
     * @type {string}
     * @default "/local/templates/.default/vendor/notifies-<версия>/icons"
     */
    pathToIcons = `/local/templates/.default/vendor/notifies-${this.#version}>/icons`

    /**
     * Искать папку с иконками рядом с JS-файлом. В 1C-Битрикс при использовании опции "Объединять JS файлы" нужно оставить в значении ```false```
     * @type {boolean}
     * @private
     * @default false
     */
    #searchIconsNearJS = false;

    /**
     * Создание объекта уведомления
     * @constructor
     * @param {(string | HTMLElement)} whereToRender - для ```displayType: "blocK"``` - **валидный CSS селектор** для ```querySelector()``` или **HTML элемент**, для ```displayType: "fixed"``` - пустая строка
     * @param {object} options - Объект настроек
     * @param {notifyTypes} options.type - Тип уведомления
     * @param {?string} options.title - Заголовок уведомления. Может быть опущен, если указан [text]{@link options#text}
     * @param {?string} options.text - Текст уведомления. Может быть опущен, если указан [title]{@link options#title}
     * @param {?string} options.position - Позиция уведомления (верх/низ, лево/право) [подробнее]{@link Notify#position}
     * @param {?displayTypes} options.displayType - Тип отображения [подробнее]{@link Notify#displayType}
     * @param {?boolean} options.filledBackground - Фон уведомления залит цветом, соответствующим типу уведомления
     * @param {?number} options.closeTime - Время в мс, через которое будет закрыто всплывающее уведомление
     * @param {?object} options.buttonConfig - Конфигурация кнопки [подробнее]{@link Notify#buttonConfig}
     * @param {?string} options.pathToIcons - Путь к папке с SVG иконками [подробнее]{@link Notify#pathToIcons}
     * @param {?boolean} options.searchIconsNearJS - Искать папку с икноками рядом с JS-файлом. Для 1С-Битрикс оставить false. [Подробнее]{@link Notify#searchIconsNearJS}
     */
    constructor(whereToRender, options = {}) {
        this.#type = options.type ?? this.getType();

        this.title = options.title ?? this.title;
        this.text = options.text ?? this.text;

        this.position = options.position ?? this.position;

        this.filledBackground = options.filledBackground ?? this.filledBackground;
        this.displayType = options.displayType ?? this.displayType;
        this.closeTime = options.closeTime ?? this.closeTime;

        // если fixed, то тут будет ID таймаута
        this.#closeTimeoutFunction = null;

        this.#hasButton = options.hasOwnProperty("buttonConfig") && options.buttonConfig.text;
        this.buttonConfig = options.buttonConfig ?? {};

        this.#searchIconsNearJS = options.searchIconsNearJS ?? this.#searchIconsNearJS;

        // если путь к иконкам генерировать от папке подключения js файла
        if (this.#searchIconsNearJS) {
            // путь к иконкам берется относительно этого js файла
            this.pathToIcons = this._generatePathToIcons();
        }
        // если не генерировать путь и передан путь к иконкам
        else if (this.#searchIconsNearJS !== true && options.pathToIcons && options.pathToIcons.length) {
            // путь к иконкам берётся из настроек
            this.pathToIcons = options.pathToIcons;
        }

        // TODO разобраться с этим
        this.#whereToRender = whereToRender ? whereToRender : null;
        this.selector = options.displayType === "block" ? whereToRender : ".mm-notifies-wrapper.fixed";

        this.close.bind(this);
    }

    /**
     * Установить тип уведомления
     * @public
     * @param {notifyTypes} value - Тип уведомления из указанных
     * @return void
     */
    setType(value) {
        const needed = ["info", "success", "error", "warning"]
        if (!needed.includes(value)) {
            console.error("Недопустимое значение свойства \"type\"")
            return;
        }

        this.#type = value;
    }

    /**
     * Получить тип уведомления
     * @public
     * @return {notifyTypes} - строковое значение типа из возможных
     */
    getType() {
        return this.#type;
    }

    /**
     * Генерация HTML верстки уведомления
     * @private
     * @return {void}
     */
    _getTemplate() {
        let templateElem = null;

        // рисуем просто текст ошибки
        if (this.#whereToRender) {
            templateElem = document.createElement("p");
            templateElem.classList.add("mm-notify__text-noty", `${this.getType()}`)
            templateElem.textContent = `${this.text}`;
        }
        // рисуем блок с иконкой
        else {
            if (!(this.text.length || this.title.length)) {
                console.error("Не указан ни заголовок, не текст уведомления");
                return;
            }

            templateElem = document.createElement("div");
            templateElem.classList.add("mm-notify", `${this.getType()}`);

            this.filledBackground ? templateElem.classList.add("filled") : null;
            this.#hasButton ? templateElem.classList.add("has-button") : null;

            if (this.filledBackground) {
                const pathToIcons = this.pathToIcons.split("/");
                if (!pathToIcons.includes("filled")) {
                    this.pathToIcons = this.pathToIcons + "/filled";
                }
            }

            templateElem.innerHTML = `
                <img src="${this.pathToIcons}/${this.getType()}.svg"
                     class="mm-notify__icon"
                     alt="${this.getType()}">
                     
                <div class="mm-notify__text-wrapper">
                    ${this.title.length ?
                        `<p class="mm-notify__title">
                            ${this.title}
                        </p>`
                    : ""}
                   
                    ${this.text.length ? 
                        `<p class="mm-notify__description">
                           ${this.text}
                        </p>` 
                    : ""}
                </div>
                
                ${this.#hasButton && this.buttonConfig ? 
                    `<button class="mm-notify__callback-btn">
                        ${this.buttonConfig.text}
                    </button>` 
                : ""}
                
                <button class="mm-notify__close">
                    <img src="${this.pathToIcons}/close.svg" alt="Крестик">
                </button>
                `;

            templateElem.querySelector(".mm-notify__close").addEventListener('click', () => {
                this.close();
            });

            const callbackBtn = templateElem.querySelector(".mm-notify__callback-btn");
            if (callbackBtn) {
                callbackBtn.addEventListener("click", this.buttonConfig.callback);
            }
        }

        this.elem = templateElem;
    }

    /**
     * Ищет в подключенных скриптах путь к текущему файлу
     * @private
     * @return {string} - путь к папке иконок
     */
    _generatePathToIcons() {
        let neededFolderPath = "";

        const scriptTags = document.querySelectorAll("script");

        for (const scriptTagsKey in scriptTags) {
            const scriptTag = scriptTags[scriptTagsKey];

            const scriptPath = scriptTag.src;
            const scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );

            if(scriptFolder.includes("notifies")) {
                let array = scriptFolder.split("://")
                array.shift();
                array = array[0];
                array = array.split("/");
                array.shift();

                neededFolderPath = `/${array.join("/")}icons`;
                break;
            }
        }

        return neededFolderPath;
    }

    /**
     * Показать уведомление на экране
     * @public
     * @return {void}
     */
    show() {
        let selector = null;

        if (typeof this.selector === "string") {
            // render to .fixed elem
            const positionArray = this.position.split(" ");
            if (positionArray.length !== 2) {
                console.warn("Передан неправильный position в options");
                return;
            }

            const additionalSelector = positionArray.join(".");

            selector = document.querySelector(`${this.selector} .${additionalSelector}`);

            if (!selector) {
                const sideNotifiesWrapper = document.createElement("div");
                sideNotifiesWrapper.classList.add("mm-notifies__column-wrapper", positionArray[0], positionArray[1]);
                document.querySelector(`${this.selector}`)
                    .insertAdjacentElement("beforeend", sideNotifiesWrapper);
                selector = sideNotifiesWrapper;
            }
        }
        else {
            selector = this.selector;
        }

        this._getTemplate();

        if (this.#whereToRender) {
            selector.querySelectorAll(".mm-notify__text-noty").forEach(noty => noty.remove());
            selector.insertAdjacentElement("afterbegin", this.elem);
        }
        else {
            selector.insertAdjacentElement("afterbegin", this.elem);
        }

        if (this.displayType === "fixed") {
            this.#closeTimeoutFunction = setTimeout(() => {
                this.close();
            }, this.closeTime);
        }
    }

    /**
     * Закрыть уведомление
     * @public
     * @return {void}
     */
    close() {
        if (this.displayType === "fixed") {
            if (this.#closeTimeoutFunction === null) return;

            this.elem.classList.add("closing");

            this.elem.addEventListener("transitionend", () => {
                this.elem.remove();
            })

            this.#closeTimeoutFunction = null;
        }

        if (this.displayType === "block") {
            this.elem.remove();
        }
    }
}