import { createGluang } from './gluang';

class MyState extends createGluang {
  [x: string]: any;

  // global state
  static get stateVars() {
    return {
      author: 'Guess who?',
    };
  }

  // global function
  // handleChange() {
  //   this.author = 'Sun Tzu';
  // }
}

export const store = new MyState();