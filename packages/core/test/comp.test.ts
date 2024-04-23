import { fixture, expect } from '@open-wc/testing';
import './components/hello-world';

const renderComp = async () => {
  return fixture('<hello-world></hello-world>');
};

describe('<hello-world>', () => {
  it('shadow root exist', async () => {
    const comp = await renderComp();
    expect(comp.shadowRoot).to.exist;
  });

  it('renders a div', async () => {
    const comp = await renderComp();
    expect(comp.shadowRoot?.childNodes[0]?.nodeName).to.equal('DIV');
  });

  it('shows welcome words', async () => {
    const comp = await renderComp();
    expect(comp.shadowRoot?.childNodes[0]?.textContent).to.equal('hello, world!');
  });
});