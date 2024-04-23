import { fixture, expect } from '@open-wc/testing';
import { createElement } from '../src/core/create-element';
import { render as coreRender } from '../src/core/render';

const renderHelper = (root: Element) => {
  return (vnode) => {
    coreRender(vnode, root);
    return root.firstElementChild;
  };
};

describe('render', async () => {
  const WELCOME = 'hello, world!';
  const ROOT_HTML = '<div></div>';
  const root = await fixture(ROOT_HTML);
  const render = renderHelper(root);

  it('render text into root', () => {
    render(WELCOME);
    expect(root.textContent).to.equal(WELCOME);
    expect(root.outerHTML).to.equal(`<div>${WELCOME}</div>`);
  });

  it('render node into root', () => {
    const node = createElement('div', {}, [WELCOME]);
    const child = render(node);
    expect(child).to.exist;
    expect(child?.textContent).to.equal(WELCOME);
    const HTML = `<div>${WELCOME}</div>`;
    expect(root.innerHTML).to.equal(HTML);
    expect(root.outerHTML).to.equal(`<div>${HTML}</div>`);
  });

  it('attribute', () => {
    const node = createElement('div', { title: '123' });
    const child = render(node);
    expect(child?.getAttribute('title')).to.equal('123');
  });

  it('nested and reused nodes', () => {
    const para = createElement('p', { className: 'para' }, ['lorem']);
    const node = createElement('div', {}, [
      para,
      WELCOME,
      para,
    ]);
    const child = render(node);
    expect(child?.childNodes.length).to.equal(3);
    const paraElems = child?.querySelectorAll('.para');
    expect(paraElems).to.exist;
    expect(paraElems?.length).to.equal(2);
    expect(paraElems?.[1].textContent).to.equal('lorem');
  });

  it('render null into root', () => {
    render(null);
    expect(root.outerHTML).to.equal(ROOT_HTML);
  });
});

