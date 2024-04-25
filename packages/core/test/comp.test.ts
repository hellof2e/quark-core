import { fixture, expect } from '@open-wc/testing';
import { nextTick } from '../src/computed';
import './components/hello-world';
import './components/quark-counter';
import './components/test-property';

const renderHelper = <T extends Element>(tag: string) => {
  return () => fixture<T>(`<${tag}></${tag}>`);
};

describe('<hello-world>', () => {
  const render = renderHelper<HTMLElementTagNameMap['hello-world']>('hello-world');
  
  it('nodes exist', async () => {
    const comp = await render();
    expect(comp.shadowRoot).to.exist;
    const firstNode = comp.shadowRoot!.firstChild;
    expect(firstNode).to.exist;
    expect(firstNode!.nodeName).to.equal('DIV');
    expect(firstNode!.textContent).to.equal('hello, world!');
  });
});

describe('<quark-counter>', () => {
  const render = renderHelper<HTMLElementTagNameMap['quark-counter']>('quark-counter');
  
  it('nodes exist', async () => {
    const comp = await render();
    expect(comp.shadowRoot).to.exist;
    const compRoot = comp.shadowRoot?.firstElementChild;
    expect(compRoot).to.exist;
    expect(compRoot!.nodeName).to.equal('DIV');
  });

  it('@state, #add and events', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.value');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('0');
    comp.add();
    await nextTick();
    expect(node!.textContent).to.equal('1');
    // * test for batch-update
    comp.add();
    comp.add();
    expect(node!.textContent).to.equal('1');
    await nextTick();
    expect(node!.textContent).to.equal('3');
    // * test for click event
    const addNode = comp.shadowRoot?.querySelector('.btn');
    expect(addNode).to.exist;
    addNode!.dispatchEvent(new Event('click'));
    await nextTick();
    expect(node!.textContent).to.equal('4');
  });
});

describe('@property', () => {
  const render = renderHelper<HTMLElementTagNameMap['test-property']>('test-property');

  it('nodes exist', async () => {
    const comp = await render();
    expect(comp.shadowRoot).to.exist;
    const compRoot = comp.shadowRoot?.firstElementChild;
    expect(compRoot).to.exist;
    expect(compRoot!.nodeName).to.equal('DIV');
  });

  it('no options', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test1');
    const camelCaseNode = comp.shadowRoot?.querySelector('.test1-camelcase');
    expect(node).to.exist;
    expect(camelCaseNode).to.exist;
    expect(node!.textContent).to.equal('0');
    expect(camelCaseNode!.textContent).to.equal('camelcased');
    comp!.setAttribute('testattr', '1');
    await nextTick();
    expect(node!.textContent).to.equal('1');
    expect(camelCaseNode!.textContent, 'camelcased name will be lowercased when setAttribute/getAttribute called').to.equal('1');
  });

  it('set attribute name', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test2');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('0');
    comp!.setAttribute('test-attr2', '1');
    await nextTick();
    expect(node!.textContent).to.equal('1');
  });

  it('given type hint Number', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test3');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('number0');
    comp!.setAttribute('testattr3', '1');
    await nextTick();
    expect(node!.textContent).to.equal('number1');
  });

  it('given type hint Boolean', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test7');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('true');
    // * truthy value except than 'false' and '' will be treated as true
    comp!.setAttribute('testattr7', '');
    await nextTick();
    expect(node!.textContent).to.equal('true');
    comp!.removeAttribute('testattr7');
    await nextTick();
    expect(node!.textContent, 'if not set, treat as false').to.equal('false');
    comp!.setAttribute('testattr7', 'false');
    await nextTick();
    expect(node!.textContent, 'set value to string false').to.equal('false');
    comp!.testattr7 = false;
    await nextTick();
    expect(node!.textContent, 'set value to boolean false').to.equal('false');
    comp!.testattr7 = true;
    await nextTick();
    expect(node!.textContent, 'set value back to boolean true').to.equal('true');
  });

  it('given converter, from binary to decimal', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test4');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('0');
    comp!.setAttribute('testattr4', '11');
    await nextTick();
    expect(node!.textContent).to.equal('3');
  });

  it('not observed', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test5');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('0');
    comp!.setAttribute('testattr5', '1');
    await nextTick();
    expect(node!.textContent).to.equal('0');
  });

  it('internal prop that supports complex data', async () => {
    const comp = await render();
    const node = comp.shadowRoot?.querySelector('.test6');
    expect(node).to.exist;
    expect(node!.textContent).to.equal('');
    comp!.testattr6 = ['welcome', 'to', 'japari', 'park'];
    await nextTick();
    expect(node!.textContent).to.equal('welcome to japari park');
  });
});