import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import iView from 'iview'
import App from './App.vue'
import Icon from 'vue-awesome/components/Icon'
import iTip from "~/components/Common/tips"
import VCalendar from 'v-calendar'
import 'vue-awesome/icons'
import 'iview/dist/styles/iview.css'
import './theme/index.scss'
import './assets/iconfont/iconfont.css'
import 'v-calendar/lib/v-calendar.min.css'

Vue.use(ElementUI)
Vue.use(iView)
Vue.use(VCalendar)
Vue.component('icon', Icon)
Vue.component('i-tip', iTip)

new Vue({
    store,
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})