# What is it?

A component implementing number input with two buttons for incrementing and decrementing value.
Nothing more.

# Installation

```
npm i --save @zcomp/input-number
```

# Usage

```javascript
const inputNumber = require('@zcomp/input-number');
inputNumber.InputNumberFactory.init();
```

```html
<div class="js-input-number">
  <button class="js-input-number__dec">Decrement</button>
  <input type="number" name="number" class="js-input-number__input" min="0" max="10" />
  <button class="js-input-number__inc">Increment</button>
</div>
```

Component understands and respects `min` and `max` attributes on `js-input-number__input` element.
Buttons are enabled and disabled on-the-fly when necessary (by adding `disabled` attribute on them).
You can make buttons to be always enabled by setting `disableButtons` to false in options.
Attribute `data-input-number-disable-buttons` exists for the same purpose.
