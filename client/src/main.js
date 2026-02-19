import { mount } from 'svelte';
// @ts-ignore: allow importing Svelte component without type declarations
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
