import './app.tsx';
import './index.css';

function component() {
    const element = document.createElement('quark-count');
    return element;
}

(document.querySelector('#app') as HTMLElement).appendChild(component());
