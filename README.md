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

## Использование
В ``footer.php`` перед ``</body>`` вставить элемент
```html
<div class="mm-notifies-wrapper fixed">
</div>
```
В него будут рисовать уведомления с параметром ``cssPositon: "fixed"``.

В месте, где нужно вызвать отрисовку уведомления, создать уведомление: 
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
* ``top left`` - левый верхний угол (**в разарботке**)
* ``bottom right`` - нижний правый угол (**в разарботке**)
* ``bottom left`` - нижний левый угол (**в разработке**)

``text`` - текст сообщения. Значение по умолчанию: "**Сообщение**"

``closeTimeout`` - время, через которое уведомление само закроется
<br>**Значение:** число в мс для функции setTimeout(). **Значение по умолчанию - 3000**