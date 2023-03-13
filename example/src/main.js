import './component/count.tsx';

function component() {
    const element = document.createElement('quark-count');

    return element;
}

document.querySelector('#app').appendChild(component());
