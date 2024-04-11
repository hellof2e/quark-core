import { fixture, expect } from '@open-wc/testing';
import { createElement } from '../src/core/create-element';
// import { diff } from '../src/core/diff';
import { render } from '../src/core/render';

it('render into root', async () => {
    const root = await fixture('<div></div>');
    // console.log(root);
    expect(root.textContent).to.equal('');
    const node = createElement('div', {}, ['hello world']);
    render(node, root);
    expect(root.childNodes[0].textContent).to.equal('hello world');
    render(null, root);
    expect(root.textContent).to.equal('');
});

