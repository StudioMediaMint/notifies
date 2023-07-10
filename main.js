function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const notifyType = formData.get("notify-type");
    const notifyTitle = formData.get("notify-title");
    const notifyText = formData.get("notify-text");
    const notifyPosition = formData.get("notify-position");
    const notifyFilled = formData.get("notify-filled");
    const notifyCloseTime = formData.get("notify-closeTimeout");
    const notifyShowButton = formData.get("notify-showButton");
    const notifyButtonText = formData.get("notify-buttonText");
    const notifyButtonCallbackText = formData.get("notify-buttonAlertText");

    const options = {
        type: notifyType,
        title: notifyTitle,
        text: notifyText,
        position: notifyPosition,
        closeTimeout: notifyCloseTime,
        filled: notifyFilled === "on",
    }

    if (notifyShowButton === "on") {
        options.button = {
            text: notifyButtonText,
            callback: () => {alert(`${notifyButtonCallbackText}`)},
        }
    }

    const notify = new Notify("", options);
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