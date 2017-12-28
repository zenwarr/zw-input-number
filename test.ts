import { expect } from 'chai';
import {InputNumber, InputNumberFactory} from "./index";

function init(html: string): void {
  document.body.innerHTML = html;
}

function elem(id: string): Element {
  return document.getElementById(id) as Element;
}

function sendEvent(id: string, eventType: string): void {
  elem(id).dispatchEvent(new Event(eventType, { bubbles: true }));
}

function hasClass(id: string, className: string): boolean {
  return elem(id).classList.contains(className);
}

describe("InputNumber", function () {
  it('should create component', function () {
    init(`<div class="js-input-number" id="in">
      <button class="js-input-number__inc" id="inc"></button>
      <input type="number" name="number" class="js-input-number__input" id="input" />
      <button class="js-input-number__dec" id="dec"></button>
    </div>`);

    let inp = InputNumberFactory.createComp(InputNumber, elem('in'));
    expect(inp).to.not.be.empty;
    expect(inp.min).to.be.null;
    expect(inp.max).to.be.null;
    expect(inp.value).to.be.null;
  });

  it('should increment', function () {
    init(`<div class="js-input-number" id="in">
      <button class="js-input-number__inc" id="inc"></button>
      <input type="number" name="number" class="js-input-number__input" id="input" min="2" max="4" />
      <button class="js-input-number__dec" id="dec"></button>
    </div>`);

    let inp = InputNumberFactory.createComp(InputNumber, elem('in'));
    expect(elem('inc').hasAttribute('disabled')).to.be.false;
    expect(elem('dec').hasAttribute('disabled')).to.be.false;
    expect(inp.min).to.be.equal(2);
    expect(inp.max).to.be.equal(4);

    expect(inp.inc()).to.be.true;
    expect(inp.value).to.be.equal(2);
    expect(elem('inc').hasAttribute('disabled')).to.be.false;
    expect(elem('dec').hasAttribute('disabled')).to.be.true;

    expect(inp.inc()).to.be.true;
    expect(inp.value).to.be.equal(3);

    expect(inp.inc()).to.be.true;
    expect(inp.value).to.be.equal(4);
    expect(elem('inc').hasAttribute('disabled')).to.be.true;
    expect(elem('dec').hasAttribute('disabled')).to.be.false;

    expect(inp.inc()).to.be.false;
    expect(inp.value).to.be.equal(4);
    expect(elem('inc').hasAttribute('disabled')).to.be.true;
    expect(elem('dec').hasAttribute('disabled')).to.be.false;
  });

  it('should decrement', function () {
    init(`<div class="js-input-number" id="in">
      <button class="js-input-number__inc" id="inc"></button>
      <input type="number" name="number" class="js-input-number__input" id="input" min="2" max="4" />
      <button class="js-input-number__dec" id="dec"></button>
    </div>`);

    let inp = InputNumberFactory.createComp(InputNumber, elem('in'));

    expect(inp.value).to.be.null;

    inp.value = 5;
    expect(inp.value).to.be.equal(5);
    expect(elem('inc').hasAttribute('disabled')).to.be.true;
    expect(elem('dec').hasAttribute('disabled')).to.be.false;

    expect(inp.dec()).to.be.true;
    expect(inp.value).to.be.equal(4);
    expect(elem('inc').hasAttribute('disabled')).to.be.true;
    expect(elem('dec').hasAttribute('disabled')).to.be.false;

    expect(inp.dec()).to.be.true;
    expect(inp.value).to.be.equal(3);

    expect(inp.dec()).to.be.true;
    expect(inp.value).to.be.equal(2);
    expect(elem('inc').hasAttribute('disabled')).to.be.false;
    expect(elem('dec').hasAttribute('disabled')).to.be.true;

    expect(inp.dec()).to.be.false;
    expect(inp.value).to.be.equal(2);
    expect(elem('inc').hasAttribute('disabled')).to.be.false;
    expect(elem('dec').hasAttribute('disabled')).to.be.true;
  });
});
