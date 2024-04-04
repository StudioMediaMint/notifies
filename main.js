function onSubmit(event) {
    event.preventDefault();

    const validateNotify = new Notify("", {
        type: "error",
    })

    const formData = new FormData(event.currentTarget);

    const notifyType = String(formData.get("notify-type"));
    const notifyTitle = String(formData.get("notify-title"));
    const notifyText = String(formData.get("notify-text"));
    const notifyPosition = String(formData.get("notify-position"));
    const notifyFilled = String(formData.get("notify-filled"));
    const notifyCloseTime = Number(formData.get("notify-closeTimeout"));
    const notifyShowButton = String(formData.get("notify-showButton"));
    const notifyButtonText = String(formData.get("notify-buttonText"));
    const notifyButtonCallbackText = String(formData.get("notify-buttonAlertText"));

    if (!(notifyTitle.length || notifyText.length)) {
        validateNotify.title = "Это не ваше уведомление, а системное"
        validateNotify.text = "Не указан заголовок или текст";
        validateNotify.show();

        return;
    }

    const optionsObject = {
        type: notifyType,
        title: notifyTitle,
        text: notifyText,
        position: notifyPosition,
        closeTime: notifyCloseTime,
        filledBackground: notifyFilled === "on",
    }

    if (notifyShowButton === "on") {
        optionsObject.buttonConfig = {
            text: notifyButtonText,
            callback: () => {alert(`${notifyButtonCallbackText}`)},
        }
    }

    const notify = new Notify("", optionsObject);
    notify.show();
}

function openDependBlock(event) {
    // change event
    const checkbox = event.currentTarget;
    const dependBlockSelector = checkbox.dataset.dependBlock;

    const form = checkbox.closest("form");
    const dependBlock = form.querySelector(`${dependBlockSelector}`);

    if (dependBlock.classList.contains("showed")) {
        dependBlock.style.height = "0";
    }
    else {
        const dependBlock__child = dependBlock.querySelector("div");
        dependBlock.style.height = `${dependBlock__child.clientHeight}px`;
    }

    dependBlock.classList.toggle("showed")
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("form").addEventListener('submit', onSubmit);
    document.querySelector("form input[data-depend-block]")
        .addEventListener("change", openDependBlock)
})