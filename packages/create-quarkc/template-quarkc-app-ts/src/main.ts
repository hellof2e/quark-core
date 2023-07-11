import { Router } from '@vaadin/router'
import "./main.less"

import './views/NotFound'

const outlet = document.querySelector('#root');
export const router = new Router(outlet);

router.setRoutes([{
    path: '/',
    component: 'app-home', // custom element name
    action: async () => { await import('./views/home/index'); }
  }, {
    path: '/sub',
    component: 'app-sub',
    action: async () => { await import('./views/sub'); }
  }, {
    path: '(.*)',
    component: 'app-not-found'
  }
])

// router.setRoutes([
//   { path: '/', component: 'hello-home' },
//   { path: '/a', component: 'hello-a' },
//   { path: '/b', component: 'hello-b' },
//   {
//     path: '/nav',
//     component: 'hello-nav',
//     children: [
//       { path: '/a', component: 'hello-a' },
//       { path: '/b', component: 'hello-b' },
//       { path: '(.*)', component: 'hello-not-found' },
//     ],
//   },
//   { path: '/fruit/:id', component: 'hello-fruit' },
//   { path: '(.*)', component: 'hello-not-found' },
// ]);