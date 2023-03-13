import './component/count.tsx'
// 2
function component() {
    const element = document.createElement('quark-count');

    return element;
}

document.querySelector('#app').appendChild(component());
