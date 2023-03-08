document.addEventListener("DOMContentLoaded", () => {
    const t = 500000;

    const notify = new Notify("", {
        type: "info",
        closeTimeout: t,
        position: "top left",
        text: "слева сверху"
    })
    const noty1 = new Notify("", {
        type: "error",
        closeTimeout: t,
        position: "bottom left",
        text: "снизу слева",
    })
    const noty2 = new Notify("", {
        type: "success",
        position: "bottom right",
        closeTimeout: t,
        text: "справа снизу",
    })
    const noty3 = new Notify("", {
        type: "success",
        closeTimeout: t,
        text: "Справа сверху",
    })

    setTimeout(() => {
        notify.show();
        noty1.show();
        noty2.show();
        noty3.show();
    }, 1000);
})