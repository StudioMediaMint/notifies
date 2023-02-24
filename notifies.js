function getCounter() {
    let counter = 1;
    return function inner () {
        return counter++;
    }
}

const counter = getCounter();

class Notify {
    constructor(whereToRender, options = {
        type: "info",
        position: "top right",
        cssPosition: "fixed",
        text: "Сообщение",
        closeTimeout: 3000,
    }) {
        this.type = options.type; // "info" || "success" || "error"
        this.position = options.position; // "top right" || "top left" || "bottom left" || "bottom right"
        this.cssPosition = options.cssPosition; // "fixed" || "block"
        this.selector = options.cssPosition === "block" ? whereToRender : ".mm-notifies-wrapper.fixed";
        this.notifyText = options.text;
        this.counterId = counter();
        this.closeTimeout = null;
    }

    getTemplate() {
        console.log(this.counterId);

        let templateHTMl = `
            <div class="mm-notify ${this.type}" data-notify-counter="${this.counterId}">
                <img src="/local/templates/ekoform-mm/vendor/notifies/icons/${this.type}.svg"
                     class="mm-notify__icon"
                     alt="">
                
                <p class="mm-notify__text">
                    ${this.notifyText}
                </p>
            </div>
        `;

        return templateHTMl;
    }

    show() {
        let selector = null;

        if (typeof this.selector === "string") {
            selector = document.querySelector(this.selector);
        }
        else {
            selector = this.selector;
        }

        const notifyTemplate = this.getTemplate();

        selector.insertAdjacentHTML("beforeend", notifyTemplate);

        this.closeTimeout = setTimeout(() => {
            this.close();
        }, 3000);
    }

    close() {
        if (this.closeTimeout === null) return;

        const notifyToClose = document.querySelector(`.mm-notify[data-notify-counter="${this.counterId}"]`);
        notifyToClose.classList.add("closing");
        notifyToClose.addEventListener("transitionend", () => {
            notifyToClose.remove();
        })

        this.closeTimeout = null;
    }
}