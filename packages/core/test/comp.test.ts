import { fixture, expect } from '@open-wc/testing';
import HelloWorld from './components/hello-world';
import QuarkCounter from './components/quark-counter';

const renderHelper = <T extends Element>(tag: string) => {
  return () => fixture<T>(`<${tag}></${tag}>`);
};

describe('<hello-world>', () => {
  const render = renderHelper<HelloWorld>('hello-world');
  
  it('shadow root exist', async () => {
    const comp = await render();
    expect(comp.shadowRoot).to.exist;
  });

  it('renders a div', async () => {
    const comp = await render();
    expect(comp.shadowRoot?.childNodes[0]?.nodeName).to.equal('DIV');
  });

  it('shows welcome words', async () => {
    const comp = await render();
    expect(comp.shadowRoot?.childNodes[0]?.textContent).to.equal('hello, world!');
  });
});

describe('<quark-counter>', () => {
  const render = renderHelper<QuarkCounter>('quark-counter');
  
  it('shadow root exist', async () => {
    const comp = await render();
    expect(comp.shadowRoot).to.exist;
  });

  it('add works', async () => {
    const comp = await render();
    const compRoot = comp.shadowRoot?.firstElementChild;
    expect(compRoot).to.exist;

    if (!compRoot) {
      return;
    }

    expect(compRoot.nodeName).to.equal('DIV');
    const valNode = compRoot.querySelector('.counter__val');
    expect(valNode).to.exist;

    if (!valNode) {
      return;
    }
    
    expect(valNode.textContent).to.equal('0');
    // comp.add();
  });
});