import Vue from 'vue'
import Vuex from 'vuex'
import plugins from './plugins'
import params from './modules/params'
import chartConfig from './modules/chartConfig'
import chartView from './modules/chartView/index'
import dataSource from './modules/dataSource'
import sceneConfig from './modules/scenariosConfig/sceneConfig'

Vue.use(Vuex)
export const STORAGE_KEY = 'todos-vuejs'

export default new Vuex.Store({
    plugins,
    state: {
        query_md5: '6d37d11078ff8253ca17f214d60b38e2'
    },
    mutations: {
        ChangeQueryMd5(state, val) {
            state.query_md5 = val
        }
    },
    actions: {},
    modules: {
        params,
        chartConfig,
        chartView,
        dataSource,
        sceneConfig
    }
})
