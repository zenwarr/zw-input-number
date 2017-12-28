import * as base from '@zcomp/base';
import throttle = require('lodash.throttle');

export interface InputNumberOptions extends base.ComponentOptions {
  /**
   * Selector for input element.
   * A component should have only one input element matching this selector
   */
  inputSelector?: string;

  /**
   * Selector for elements that increment value on click.
   */
  incSelector?: string;

  /**
   * Selector for elements that decrement value on click.
   */
  decSelector?: string;

  /**
   * Button clicks are throttled.
   * Here you can specify throttling interval.
   */
  throttleInterval?: number;

  /**
   * If this attribute is present and is not set to `false` on root element, this component will disable its buttons when required.
   */
  disableButtonsAttr?: string;

  /**
   * If true, buttons are enabled and disabled on-the-fly when input value reaches limits.
   * If false, buttons are always enabled regardless of input value.
   */
  disableButtons?: boolean;
}

export const DefaultOptions: InputNumberOptions = {
  rootSelector: '.js-input-number',
  inputSelector: '.js-input-number__input',
  incSelector: '.js-input-number__inc',
  decSelector: '.js-input-number__dec',
  throttleInterval: 200,
  disableButtonsAttr: 'data-input-number-disable-buttons',
  disableButtons: true
};

export class InputNumber extends base.Component<InputNumberOptions> {
  constructor(root: Element, options: InputNumberOptions) {
    super(root, options);

    this._disableButtons = base.checkBinaryOptionAttr(this.root, this.options.disableButtonsAttr,
        this.options.disableButtons || true);

    if (this.options.incSelector) {
      this._each(this.options.incSelector, inc => {
        inc.addEventListener('click', throttle(this._inc.bind(this), this.options.throttleInterval));
      });
    }

    if (this.options.decSelector) {
      this._each(this.options.decSelector, dec => {
        dec.addEventListener('click', throttle(this._dec.bind(this), this.options.throttleInterval));
      });
    }

    if (this.options.inputSelector) {
      this._input = this.root.querySelector(this.options.inputSelector);

      if (this._input) {
        let min = +('' + this._input.getAttribute('min'));
        this._min = isNaN(min) ? null : min;

        let max = +('' + this._input.getAttribute('max'));
        this._max = isNaN(max) ? null : max;

        if (this._min != null && this._max != null && this._max <= this._min) {
          console.warn('value of max attribute is less or equal to the value of min attribute, ignoring', this._input);
          this._min = this._max = null;
        }

        this._input.addEventListener('input', this._syncButtons.bind(this));
        this._input.addEventListener('change', this._syncButtons.bind(this));
      }
    }

    this._syncButtons();
  }

  /**
   * Minimum value for input.
   * If null, no lower limit exist.
   * @returns {number | null}
   */
  get min(): number|null { return this._min; }
  set min(value: number|null) {
    this._min = value;
    let curValue = this.value;
    if (curValue != null && this._min != null && curValue < this._min) {
      this.value = this._min;
    }
    this._syncButtons();
  }

  /**
   * Max value for input.
   * If null, no upper limit exist.
   * @returns {number | null}
   */
  get max(): number|null { return this._max; }
  set max(value: number|null) {
    this._max = value;
    let curValue = this.value;
    if (curValue != null && this._max != null && curValue > this._max) {
      this.value = this._max;
    }
    this._syncButtons();
  }

  /**
   * Current value of the input.
   * If null, input is empty or does not contain a valid number.
   * @returns {number | null}
   */
  get value(): number|null {
    if (this._input) {
      if (this._input.value === '') {
        return null;
      }
      let value = +this._input.value;
      return isNaN(value) ? null : value;
    }
    return null;
  }

  set value(value: number|null) {
    if (this._input) {
      this._input.value = value == null || isNaN(value) ? '' : '' + value;
      this._syncButtons();
    }
  }

  /**
   * Increment value
   * @returns {boolean}
   */
  inc(): boolean {
    let value = this.value;
    if (value == null) {
      this.value = this.min || 0;
      return true;
    } else if (this.max == null || value + 1 <= this.max) {
      this.value = value + 1;
      return true;
    }
    return false;
  }

  /**
   * Decrement value
   * @returns {boolean}
   */
  dec(): boolean {
    let value = this.value;
    if (value == null) {
      this.value = this.min || 0;
      return true;
    } else if (this.min == null || value - 1 >= this.min) {
      this.value = value - 1;
      return true;
    }
    return false;
  }

  /**
   * Input element (if any)
   * @returns {HTMLInputElement | null}
   */
  get input(): HTMLInputElement|null {
    return this._input;
  }

  /** Protected area **/

  protected _min: number|null = null;
  protected _max: number|null = null;
  protected _input: HTMLInputElement|null = null;
  protected _disableButtons: boolean = true;

  protected _inc(e: Event): void {
    this.inc();
    e.preventDefault();
  }

  protected _dec(e: Event): void {
    this.dec();
    e.preventDefault();
  }

  protected _syncButtons(): void {
    let value = this.value;
    if (this.options.incSelector) {
      this._each(this.options.incSelector, inc => {
        this._toggleAttribute(inc, 'disabled', this._max != null && value != null && value >= this._max);
      });
    }
    if (this.options.decSelector) {
      this._each(this.options.decSelector, dec => {
        this._toggleAttribute(dec, 'disabled', this._min != null && value != null && value <= this._min);
      });
    }
  }

  protected _each(selector: string, callback: (elem: Element) => boolean|void): void {
    let elements = this.root.querySelectorAll(selector);
    for (let q = 0; q < elements.length; ++q) {
      if (callback(elements[q])) {
        break;
      }
    }
  }

  protected _toggleAttribute(elem: Element, attrName: string, state: boolean): void {
    if (state) {
      elem.setAttribute(attrName, '');
    } else {
      elem.removeAttribute(attrName);
    }
  }
}

export const InputNumberFactory = new base.ComponentFactory('input-number', DefaultOptions, InputNumber);

