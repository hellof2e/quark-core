import { fixture, expect } from '@open-wc/testing';
import { nextTick } from '../src/computed';
import './components/hello-world';
import './components/quark-counter';

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

  it('@state, #add and events works', async () => {
    const comp = await render();
    const valNode = comp.shadowRoot?.querySelector('.counter__val');
    expect(valNode).to.exist;
    expect(valNode!.textContent).to.equal('0');
    comp.add();
    await nextTick();
    expect(valNode!.textContent).to.equal('1');
    // * test for batch-update
    comp.add();
    comp.add();
    expect(valNode!.textContent).to.equal('1');
    await nextTick();
    expect(valNode!.textContent).to.equal('3');
    // * test for click event
    const addNode = comp.shadowRoot?.querySelector('.counter__add');
    expect(addNode).to.exist;
    addNode!.dispatchEvent(new Event('click'));
    await nextTick();
    expect(valNode!.textContent).to.equal('4');
  });

  it('@property works', async () => {
    const comp = await render();
    const titleNode = comp.shadowRoot?.querySelector('.counter__title');
    expect(titleNode).to.exist;
    expect(titleNode!.textContent).to.equal('counter written with quarkc');
    comp.setAttribute('counter-title', 'test title');
    await nextTick();
    expect(titleNode!.textContent).to.equal('test title');
  });
});