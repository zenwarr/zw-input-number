import * as base from '@zcomp/base';
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
export declare const DefaultOptions: InputNumberOptions;
export declare class InputNumber extends base.Component<InputNumberOptions> {
    constructor(root: Element, options: InputNumberOptions);
    /**
     * Minimum value for input.
     * If null, no lower limit exist.
     * @returns {number | null}
     */
    min: number | null;
    /**
     * Max value for input.
     * If null, no upper limit exist.
     * @returns {number | null}
     */
    max: number | null;
    /**
     * Current value of the input.
     * If null, input is empty or does not contain a valid number.
     * @returns {number | null}
     */
    value: number | null;
    /**
     * Increment value
     * @returns {boolean}
     */
    inc(): boolean;
    /**
     * Decrement value
     * @returns {boolean}
     */
    dec(): boolean;
    /**
     * Input element (if any)
     * @returns {HTMLInputElement | null}
     */
    readonly input: HTMLInputElement | null;
    /** Protected area **/
    protected _min: number | null;
    protected _max: number | null;
    protected _input: HTMLInputElement | null;
    protected _disableButtons: boolean;
    protected _inc(e: Event): void;
    protected _dec(e: Event): void;
    protected _syncButtons(): void;
    protected _each(selector: string, callback: (elem: Element) => boolean | void): void;
    protected _toggleAttribute(elem: Element, attrName: string, state: boolean): void;
}
export declare const InputNumberFactory: base.ComponentFactory<InputNumber, InputNumberOptions>;
