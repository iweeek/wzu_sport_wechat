import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import router from './router'
import resources from './resources'
import axios from 'axios'
import MintUI from 'mint-ui';
import { Toast } from 'mint-ui';
// import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'


import 'font-awesome/css/font-awesome.min.css'
Vue.use(MintUI)
Vue.use(ElementUI);
// Vue.component(Cell.name, Cell);
// Vue.component(Toast.name, Toast);

Vue.prototype.$ajax = axios;

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')

