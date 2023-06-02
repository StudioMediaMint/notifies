// function getCounter() {
//     let counter = 1;
//     return function inner () {
//         return counter++;
//     }
// }
//
// const counter = getCounter();

class Notify {
    // определяет, куда выводить HTML, если
    _whereToRender;

    // тип сообщения: Ошибка, Инфо, Успех
    _type;

    // Выводить ошибку как всплывающую в fixed-блок или выводить ошибку в заранее подготовленное место
    _position;

    // если выводить как всплывающую, то где? слева/справа внизу/наверху
    _cssPosition;

    // куда выводить ошибку. Если _position==="block", то берется _whereToRender, иначе ".mm-notifies-wrapper.fixed";
    _selector;

    // текст сообщения
    _notifyText;

    // время пропадания сообщения при _position==="fixed";
    _closeTime;

    // Сюда помещается результат setTimeout(() => {}, _closeTime);
    _closeTimeoutFunction;

    // DOM-элемент уведомления
    _notyElem;

    constructor(whereToRender, options = {
        type: "info",
        position: "top right",
        cssPosition: "fixed",
        text: "Сообщение",
        closeTimeout: 3000,
    }) {
        // "info" || "success" || "error"
        this._type = options.type ? options.type : "info";

        this._whereToRender = whereToRender ? whereToRender : null,

        // "top right" || "top left" || "bottom left" || "bottom right"
        this._position = options.position ? options.position : "top right";

        // "fixed" || "block"
        this._cssPosition = options.cssPosition ? options.cssPosition : "fixed";

        this._selector = options.cssPosition === "block" ? whereToRender : ".mm-notifies-wrapper.fixed";
        this._notifyText = options.text ? options.text : "Сообщение";
        // this.counterId = counter();
        this._closeTime = options.closeTimeout ? options.closeTimeout : 3000,
        this._closeTimeoutFunction = null;
    }

    getTemplate() {
        // console.log(this.counterId);

        let templateElem = null;

        // рисуем просто текст ошибки
        if (this._whereToRender) {
            templateElem = document.createElement("p");
            templateElem.classList.add("mm-notify__text-noty", `${this._type}`)
            templateElem.textContent = `${this._notifyText}`;
        }
        // рисуем блок с иконкой
        else {
            templateElem = document.createElement("div");
            templateElem.classList.add("mm-notify", `${this._type}`);
            // templateElem.dataset.notifyCounter = `${this.counterId}`;

            templateElem.innerHTML = `
                <img src="./icons/${this._type}.svg"
                     class="mm-notify__icon"
                     alt="${this._type}">
                
                <p class="mm-notify__text">
                    ${this._notifyText}
                </p>`;
        }

        this._notyElem = templateElem;
    }

    show() {
        let selector = null;

        if (typeof this._selector === "string") {
            // render to .fixed elem
            const positionArray = this._position.split(" ");
            if (positionArray.length !== 2) {
                console.warn("Передан неправильный position в options");
                return;
            }

            const additionalSelector = positionArray.join(".");

            if (additionalSelector !== "top.right") {
                selector = document.querySelector(`${this._selector}.${additionalSelector}`);
            }
            else {
                selector = document.querySelector(this._selector);
            }

            if (!selector) {
                const fixedNotiesWrapper = document.createElement("div");
                fixedNotiesWrapper.classList.add("mm-notifies-wrapper", "fixed", positionArray[0], positionArray[1]);
                document.body.insertAdjacentElement("beforeend", fixedNotiesWrapper);
                selector = fixedNotiesWrapper;
            }
        }
        else {
            selector = this._selector;
        }

        this.getTemplate();

        if (this._whereToRender) {
            selector.querySelectorAll(".mm-notify__text-noty").forEach(noty => noty.remove());
            selector.insertAdjacentElement("afterbegin", this._notyElem);
        }
        else {
            selector.insertAdjacentElement("beforeend", this._notyElem);
        }

        if (this._cssPosition === "fixed") {
            this._closeTimeoutFunction = setTimeout(() => {
                this.close();
            }, this._closeTime);
        }
    }

    close() {
        if (this._cssPosition === "fixed") {
            if (this._closeTimeoutFunction === null) return;

            this._notyElem.classList.add("closing");

            this._notyElem.addEventListener("transitionend", () => {
                this._notyElem.remove();
            })

            this._closeTimeoutFunction = null;
        }

        if (this._cssPosition === "block") {
            this._notyElem.remove();
        }
    }
}