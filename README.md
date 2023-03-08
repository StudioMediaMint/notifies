# Библиотека уведомлений MediaMint

## Подключение в 1С-Битрикс
```php
<?php
use Bitrix\Main\Page\Asset;
$asset = Asset::getInstance();

$asset->addCss(SITE_TEMPLATE_PATH."/vendor/notifies/notifies.css");
$asset->addJs(SITE_TEMPLATE_PATH."/vendor/notifies/notifies.js");
?>
```
Файлы брать из папки ``/src``. В папку с со скриптом и стилями положить папку с иконками. Иконки взять из папки ``/icons``

## Использование
1. В ``footer.php`` перед ``</body>`` вставить элемент
```html
<div class="mm-notifies-wrapper fixed">
</div>
```
В него будут рисовать уведомления с параметром ``cssPositon: "fixed"``.

2. В ``notifies.js`` в методе ``getTemplate()`` поменять путь до иконок в уведомлениях:
```js
templateElem.innerHTML = `
    <img src="/icons/${this._type}.svg"
         class="mm-notify__icon"
         alt="${this._type}">
    
    <p class="mm-notify__text">
        ${this._notifyText}
    </p>`;
```

3. В ``notifies.css`` поменять цвета для фона уведомлений в ``:root``

4. В месте, где нужно вызвать отрисовку уведомления, создать уведомление: 
```js
const notify = new Notify("", {
    type: "info",
    cssPosition: "fixed",
    position: "top right",
    text: "Информационное сообщение"
});

notify.show();
```

## Параметры
``whereToRender`` - блок, куда отрисовывать сообщения. Используется только тогда, когда ``cssPosition: "block"``
**Значения:**
* ``CSS Selector`` вида ``".input-errors-block"``
* ``DOM Element`` - результат вызова ``Element.querySelector()``

``type`` - тип сообщения. 
<br>**Значения:**
* ``info`` - информационное сообщение, синий фон
* ``success`` - успешное действие, зеленый фон
* ``error`` - ошибка, персиковый цвет

``cssPosition`` - тип позиционирования в CSS.
<br>**Значения:**
* ``fixed`` - фиксированное вне потока документа для отрисовки в углы страницы
* ``block`` - для отрисовки в конкретные блоки (например, после ``<input>``)

``position`` - позиция для отрисовки в углы. При значении ``cssPosition: "block"`` игнорирутся.
<br>**Значения:**
* ``top right`` - правый верхний угол. Значение по умолчанию.
* ``top left`` - левый верхний угол
* ``bottom right`` - нижний правый угол
* ``bottom left`` - нижний левый угол

``text`` - текст сообщения. Значение по умолчанию: "**Сообщение**"

``closeTimeout`` - время, через которое уведомление само закроется
<br>**Значение:** число в мс для функции setTimeout(). **Значение по умолчанию - 3000**

## Проблемы
___
1. Не рекомендуется выводить уведомления сразу в два и более угла экрана, так как в версии 0.0.1 биболтеки эти 
уведомления на экранах ``<=768px`` будут накладываться друг на друга