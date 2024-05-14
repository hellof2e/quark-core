import { fixture, expect } from '@open-wc/testing';
import { createElement, Fragment } from '../src/core/create-element';
import { render } from '../src/core/render';

const WELCOME = 'hello, world!';
const ROOT_HTML = '<div></div>';

const renderIntoRoot = async (vnode) => {
  const root = await fixture(ROOT_HTML);
  render(vnode, root);
  return root;
};

describe('render', () => {
  it('render text into root', async () => {
    const root = await renderIntoRoot(WELCOME);
    expect(root.textContent).to.equal(WELCOME);
    expect(root.outerHTML).to.equal(`<div>${WELCOME}</div>`);
  });

  it('render node into root', async () => {
    const node = createElement('div', {}, [WELCOME]);
    const root = await renderIntoRoot(node);
    const child = root.firstChild;
    expect(child).to.exist;
    expect(child?.textContent).to.equal(WELCOME);
    const HTML = `<div>${WELCOME}</div>`;
    expect(root.innerHTML).to.equal(HTML);
    expect(root.outerHTML).to.equal(`<div>${HTML}</div>`);
  });

  it('attribute', async () => {
    const node = createElement('div', { title: '123' });
    const root = await renderIntoRoot(node);
    expect(root.firstChild).to.be.instanceOf(HTMLDivElement);
    expect((root.firstChild as HTMLDivElement).getAttribute('title')).to.equal('123');
  });

  it('nested and reused nodes', async () => {
    const para = createElement('p', { className: 'para' }, ['lorem']);
    const node = createElement('div', {}, [
      para,
      WELCOME,
      para,
    ]);
    const root = await renderIntoRoot(node);
    const child = root.firstChild;
    expect(child).to.be.instanceOf(HTMLDivElement);
    expect(child?.childNodes.length).to.equal(3);
    const paraElems = (child as HTMLDivElement).querySelectorAll('.para');
    expect(paraElems).to.exist;
    expect(paraElems?.length).to.equal(2);
    expect(paraElems?.[1].textContent).to.equal('lorem');
  });

  it('render fragment into root', async () => {
    const node = createElement(Fragment, {}, [
      createElement('div', {}, [WELCOME]),
      createElement('div', {}, [WELCOME]),
    ])
    const root = await renderIntoRoot(node);
    expect(root.firstElementChild).to.exist;
    expect(root.childNodes.length).to.equal(2);
    expect(root.firstElementChild!.textContent).to.equal(WELCOME);
  });

  it('render null into root', async () => {
    const root = await renderIntoRoot(null);
    expect(root.outerHTML).to.equal(ROOT_HTML);
  });
});

