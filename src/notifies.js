class Notify {
    #whereToRender          // определяет, куда выводить HTML, если
    #type                   // тип сообщения: Ошибка, Инфо, Успех, Предупреждение
    #notyTitle              // заголовок сообщения. Зависит от type
    #position               // Выводить ошибку как всплывающую в fixed-блок или выводить ошибку в заранее подготовленное место
    #cssPosition            // если выводить как всплывающую, то где? слева/справа внизу/наверху
    #selector               // куда выводить ошибку. Если #position==="block", то берется #whereToRender, иначе ".mm-notifies-wrapper.fixed";
    #notifyText             // текст сообщения
    //#closeTime              // время пропадания сообщения при position==="fixed";
    #closeTimeoutFunction   // Сюда помещается результат setTimeout(() => {}, _closeTime);
    //#notyElem               // DOM-элемент уведомления
    #hasButton              // есть ли кнопка в уведомлении
    #buttonConfig           // конфигурация кнопки
    #filledBackground       // будет ли уведомление залито своим цветом
    #pathToIcons            // путь до svg с иконками

    constructor(whereToRender, options = {
        type: "info",
        title: "Информация",
        text: "Сообщение",
        position: "top right",
        cssPosition: "fixed",
        closeTimeout: 3000,
        iconsPath: "/local/templates/.default/vendor/notifies/icons/"
    }) {
        // "info" || "success" || "error" || "warning"
        this.#type = options.type ? options.type : "info";
        this.#notyTitle = options.title ? options.title : "Информация";

        this.#filledBackground = options.filled ? options.filled : false;

        this.#whereToRender = whereToRender ? whereToRender : null;

        // "top right" || "top left" || "bottom left" || "bottom right"
        this.#position = options.position ? options.position : "top right";

        // "fixed" || "block"
        this.#cssPosition = options.cssPosition ? options.cssPosition : "fixed";

        this.#selector = options.cssPosition === "block" ? whereToRender : ".mm-notifies-wrapper.fixed";
        this.#notifyText = options.text ? options.text : "";
        this.closeTime = options.closeTimeout ? options.closeTimeout : 3000;
        this.#closeTimeoutFunction = null;

        this.#hasButton = options.hasOwnProperty("button") && options.button.text;
        this.#buttonConfig = options.button ? options.button : null;

        this.#pathToIcons = options.iconsPath ? options.iconsPath : "/local/templates/.default/vendor/notifies/icons";

        this.close.bind(this);
    }

    set type(value) {
        const needed = ["info", "success", "error", "warning"]
        if (!needed.includes(value)) {
            console.error("Недопустимое значение свойства \"type\"")
            return;
        }

        this.#type = value;
    }

    set notyTitle(value) {
        if (typeof value !== "string") {
            console.error("Заголовок должен быть строкой");
            return;
        }

        this.#notyTitle = value;
    }

    set notifyText(value) {
        if (typeof value !== "string") {
            console.error("Текст описания должен быть строкой");
            return;
        }

        this.#notifyText = value;
    }

    getTemplate() {
        // console.log(this.counterId);

        let templateElem = null;

        // рисуем просто текст ошибки
        if (this.#whereToRender) {
            templateElem = document.createElement("p");
            templateElem.classList.add("mm-notify__text-noty", `${this.#type}`)
            templateElem.textContent = `${this.#notifyText}`;
        }
        // рисуем блок с иконкой
        else {
            templateElem = document.createElement("div");
            templateElem.classList.add("mm-notify", `${this.#type}`);

            this.#filledBackground ? templateElem.classList.add("filled") : null;
            this.#hasButton ? templateElem.classList.add("has-button") : null;

            if (this.#filledBackground) {
                const pathToIcons = this.#pathToIcons.split("/");
                if (!pathToIcons.includes("filled")) {
                    this.#pathToIcons = this.#pathToIcons + "/filled";
                }
            }

            templateElem.innerHTML = `
                <img src="${this.#pathToIcons}/${this.#type}.svg"
                     class="mm-notify__icon"
                     alt="${this.#type}">
                     
                <div class="mm-notify__text-wrapper">
                   <p class="mm-notify__title">
                       ${this.#notyTitle}
                   </p>
                   
                    ${this.#notifyText.length ? 
                        `<p class="mm-notify__description">
                           ${this.#notifyText}
                        </p>` 
                    : ""}
                </div>
                
                ${this.#hasButton && this.#buttonConfig ? 
                    `<button class="mm-notify__callback-btn">
                        ${this.#buttonConfig.text}
                    </button>` 
                : ""}
                
                <button class="mm-notify__close">
                    <img src="${this.#pathToIcons}/close.svg" alt="Крестик">
                </button>
                `;

            templateElem.querySelector(".mm-notify__close").addEventListener('click', () => {
                this.close();
            });

            const callbackBtn = templateElem.querySelector(".mm-notify__callback-btn");
            if (callbackBtn) {
                callbackBtn.addEventListener("click", this.#buttonConfig.callback);
            }

            // templateElem.dataset.notifyCounter = `${this.counterId}`;
        }

        this.notyElem = templateElem;
    }

    show() {
        let selector = null;

        if (typeof this.#selector === "string") {
            // render to .fixed elem
            const positionArray = this.#position.split(" ");
            if (positionArray.length !== 2) {
                console.warn("Передан неправильный position в options");
                return;
            }

            const additionalSelector = positionArray.join(".");

            selector = document.querySelector(`${this.#selector} .${additionalSelector}`);

            if (!selector) {
                const sideNotifiesWrapper = document.createElement("div");
                sideNotifiesWrapper.classList.add("mm-notifies__column-wrapper", positionArray[0], positionArray[1]);
                document.querySelector(`${this.#selector}`)
                    .insertAdjacentElement("beforeend", sideNotifiesWrapper);
                selector = sideNotifiesWrapper;
            }
        }
        else {
            selector = this.#selector;
        }

        this.getTemplate();

        if (this.#whereToRender) {
            selector.querySelectorAll(".mm-notify__text-noty").forEach(noty => noty.remove());
            selector.insertAdjacentElement("afterbegin", this.notyElem);
        }
        else {
            selector.insertAdjacentElement("afterbegin", this.notyElem);
        }

        if (this.#cssPosition === "fixed") {
            this.#closeTimeoutFunction = setTimeout(() => {
                this.close();
            }, this.closeTime);
        }
    }

    close() {
        if (this.#cssPosition === "fixed") {
            if (this.#closeTimeoutFunction === null) return;

            this.notyElem.classList.add("closing");

            this.notyElem.addEventListener("transitionend", () => {
                this.notyElem.remove();
            })

            this.#closeTimeoutFunction = null;
        }

        if (this.#cssPosition === "block") {
            this.notyElem.remove();
        }
    }
}