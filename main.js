document.addEventListener("DOMContentLoaded", () => {
    const t = 500000;

    // слева сверху
    const notify_left_1 = new Notify("", {
        type: "info",
        title: "Информация",
        closeTimeout: t,
        position: "top left",
        text: "Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек.",
        filled: true,
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })
    const notify_left_2 = new Notify("", {
        type: "warning",
        title: "Ахтунг! Алярм! Внимание!",
        closeTimeout: t,
        position: "top left",
        text: "Тут будет текст предупреждения",
        button: {
            text: "Открыть ещё раз",
            callback: () => {},
        },
    })
    const notify_left_3 = new Notify("", {
        type: "info",
        title: "Информация",
        closeTimeout: t,
        position: "top left",
        text: "Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек.",
    })

    // слева снизу
    const noty_bottom_left_1 = new Notify("", {
        type: "error",
        title: 'Ошибка!',
        closeTimeout: t,
        position: "bottom left",
        text: "снизу слева",
        filled: true,
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })
    const noty_bottom_left_2 = new Notify("", {
        type: "success",
        title: 'Успешный успех!!!',
        closeTimeout: t,
        position: "bottom left",
        text: "снизу слева",
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })

    // справа снизу
    const noty_right_bottom_1 = new Notify("", {
        type: "success",
        title: "Успех!",
        position: "bottom right",
        filled: true,
        closeTimeout: t,
        text: "справа снизу",
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })
    const noty_right_bottom_2 = new Notify("", {
        type: "error",
        title: "Ошибка",
        position: "bottom right",
        closeTimeout: t,
        text: "Попробуйте отправить форму ещё раз",
    })

    // право верх
    const notify_right_2 = new Notify("", {
        type: "success",
        title: "Информация",
        closeTimeout: t,
        filled: true,
        position: "top right",
        text: "Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек. Текст в несколько строчек.",
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })

    const noty3 = new Notify("", {
        type: "warning",
        title: "Предупреждение",
        filled: true,
        closeTimeout: t,
        text: "Справа сверху",
        button: {
            text: "Текст кнопки",
            callback: () => {},
        },
    })

    setTimeout(() => {
        notify_left_1.show();
        notify_left_2.show();
        notify_left_3.show();
        notify_left_1.show();
        notify_left_2.show();
        notify_left_3.show();

        noty_bottom_left_1.show();
        noty_bottom_left_2.show();
        noty_bottom_left_1.show();
        noty_bottom_left_2.show();
        noty_bottom_left_1.show();
        noty_bottom_left_2.show();
        noty_bottom_left_1.show();
        noty_bottom_left_2.show();


        noty_right_bottom_1.show();
        noty_right_bottom_2.show();

        noty3.show();
        notify_right_2.show();
    }, 1000);
})