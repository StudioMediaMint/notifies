# Библиотека уведомлений MediaMint

## Подключение в 1С-Битрикс
```php
<?php
use Bitrix\Main\Page\Asset;
$asset = Asset::getInstance();

$asset->addCss("/local/templates/.default/vendor/notifies/notifies.css");
$asset->addJs("/local/templates/.default/vendor/notifies/notifies.js");
?>
```
Файлы брать из папки ``/src``. В папку с со скриптом и стилями положить папку `icons` с иконками. Иконки взять из папки ``/icons``

## Использование
1. В ``footer.php`` перед ``</body>`` вставить элемент
```html
<div class="mm-notifies-wrapper fixed"></div>
```
В него будут рисовать уведомления с параметром ``cssPositon: "fixed"``.

2. В месте, где нужно вызвать отрисовку уведомления, создать уведомление: 
```js
const notify = new Notify([whereToRender = "" | CSS_Selector | DOM_Element], {
    type: "info" | "error" | "success" | "warning",
    title: "Информация",
    text: "Сообщение",
    [position]: "top right" | "top left" | "bottom left" | "bottom right",
    [closeTimeout]: 3000,
    [cssPosition]: "fixed" | "block",
    [iconsPath]: "/local/templates/.default/vendor/notifies/icons/",
    [filled]: true | false,
    [button]: {
        text: "Текст кнопки",
        callback: () => {alert("Callback")} 
    }
});

notify.show();
```

Цвета фонов переопределять в своих стилях, например, в ``template_styles.css``

## Параметры
``whereToRender`` - блок, куда отрисовывать сообщения. Используется только тогда, когда ``cssPosition: "block"``
**Значения:**
* ``CSS Selector`` вида ``".input-errors-block"``
* ``DOM Element`` - результат вызова ``Element.querySelector()``

``type`` - тип сообщения. 
<br>**Значения:**
* ``info`` - информационное сообщение, синий фон
* ``success`` - успешное действие, зеленый фон
* ``error`` - ошибка, красный фон
* ``warning`` - предупреждение, оранжевый фон

``title`` - заголовок уведомления<br>
**Значение:** любая строка. Значение по умолчанию: "**Информация**".

``text`` - текст сообщения. <br>
**Значение:** любая строка. Значение по умолчанию: "**Сообщение**".

``position`` - позиция для отрисовки в углы. При значении ``cssPosition: "block"`` игнорирутся.
<br>**Значения:**
* ``top right`` - правый верхний угол. Значение по умолчанию.
* ``top left`` - левый верхний угол
* ``bottom right`` - нижний правый угол
* ``bottom left`` - нижний левый угол

``closeTimeout`` - время, через которое уведомление само закроется
<br>**Значение:** число в мс для функции setTimeout(). **Значение по умолчанию - 3000**

``cssPosition`` - тип позиционирования в CSS.
<br>**Значения:**
* ``fixed`` - фиксированное вне потока документа для отрисовки в углы страницы
* ``block`` - для отрисовки в конкретные блоки (например, после ``<input>``)

``iconsPath`` - путь до папки с иконками. **Необязательный**. Указывается в случае, если иконки лежат не в папке
``/local/templates/.default/vendor/notifies/icons``.

``filled`` - фон залитый цветом или светлый. **Необязательный**

``button`` - конфигурация кнопки в уведомлении. Если указан ключ объекта, но не указан текст кнопки, кнопка показана не 
будет. **Значение - объект** с двумя ключами - **text** и **callback**
```js
options = {
    ...,
    button: {
        text: "Текст кнопки",
        callback: function() {alert("Текст в alert")}
    }    
}
```