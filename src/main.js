import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/base.scss'
import 'normalize.css';
import 'nprogress/nprogress.css';
import 'default-passive-events';
import { bootstrap } from './bootstrap';
import store from './store/index.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const app = createApp(App)

bootstrap({ app, }).then(async ({ router }) => {
	router.isReady().then(() => app.mount('#app'))
})

app.directive('permission', {
	mounted(el, binding) {
		if (store.getters.permList.indexOf(binding.value) == -1) {
			el.parentNode && el.parentNode.removeChild(el)
		}
	}
})
