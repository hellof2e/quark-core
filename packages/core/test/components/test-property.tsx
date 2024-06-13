import {
  QuarkElement,
  customElement,
  property,
} from "../../src/main"

const tag = 'test-property';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: TestProperty;
  }
}

@customElement({ tag })
class TestProperty extends QuarkElement {
  @property()
  testattr = 'lowercased';

  /** except for initial value, will work the same as testattr */
  @property()
  testAttr = 'camelcased';

  @property({ attribute: 'test-attr2' })
  testAttr2 = '0';

  @property({ type: Number })
  testattr3 = 0;

  @property({
    converter: (val) => {
      return val ? parseInt(val, 2) : 0;
    },
  })
  testattr4 = 0;

  @property({ observed: false })
  testattr5 = '0';

  @property({ internal: true })
  testattr6: string[] = []

  /** boolean property with its value default to true should be ignored */
  @property({ type: Boolean })
  testattr7 = true;

  @property({ type: Number })
  testattr8 = 18;

  /** boolean property with its value default to true should be ignored */
  @property({ type: Boolean, attribute: 'aria-hidden' })
  testAriaHidden = false;

  render() {
    return (
      <div className="test">
        <div className="test1">{this.testattr}</div>
        <div className="test1-camelcase">{this.testAttr}</div>
        <div className="test2">{this.testAttr2}</div>
        <div className="test3">{typeof this.testattr3}{this.testattr3}</div>
        <div className="test4">{this.testattr4}</div>
        <div className="test5">{this.testattr5}</div>
        <div className="test6">{this.testattr6.join(' ')}</div>
        <div className="test7">{this.testattr7.toString()}</div>
        <div className="test7-aria">{this.testAriaHidden.toString()}</div>
        <div className="test8">{this.testattr8.toString()}</div>
      </div>
    );
  }
}
