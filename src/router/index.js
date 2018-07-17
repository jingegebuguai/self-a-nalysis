import Vue from 'vue'
import Router from 'vue-router'
import ChartConfigPage from '~/containers/ChartConfigPage.vue'
import ChartViewPage from '~/containers/ChartViewPage.vue'
import DataSourcePage from '~/containers/DataSourcePage.vue'
import DemoPage from '~/containers/DemoPage'
import SceneConfigPage from '~/containers/SceneConfigPage'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        redirect: '/chart-view'
    }, {
        path: '/chart-config',
        name: 'chart-config',
        component: ChartConfigPage
    }, {
        path: '/chart-view',
        name: 'chart-view',
        component: ChartViewPage
    }, {
        path: '/datasource',
        name: 'datasource',
        component: DataSourcePage
    },{
        path: '/scene-config',
        name: 'scene-config',
        component: SceneConfigPage
    }, {
        path: '/demo',
        component: DemoPage
    }]
})