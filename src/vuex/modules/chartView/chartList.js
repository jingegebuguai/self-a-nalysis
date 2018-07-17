import axios from '~/axios'

const state = {
    chartNowId: -1,
    chartList: [],
    status: 'loading', // loading, success, error, empty
    msg: ''
}

const getters = {
    filterChart(state) {
        const chartList = state.chartList
        return (text) => {
            if (!text) return chartList
            return chartList.filter(o => o.name.indexOf(text) !== -1)
        }
    }
}

const mutations = {
    updateStatus(state, {status, msg = ''}) {
        state.status = status
        state.msg = msg
        if (status !== 'success') {
            state.chartList = []
        }
    },
    setChartList(state, playload) {
        state.chartList = playload
    },
    setChartNowId(state, playload) {
        state.chartNowId = playload
    }
}

const actions = {
    getChartList: async function ({commit, state, dispatch}) {
        commit('updateStatus', {status: 'loading'})
        const msg = '查询图表列表'
        let response
        try {
            response = await axios.get(`api/charts`)
        } catch (error) {
            console.warn('get charts error', error)
            commit('updateStatus', {status: 'error', msg: `${msg}为空`})
            return
        }
        if (response.errors || !response.data || !response.data.data) {
            commit('updateStatus', {status: 'error', msg: `${msg}为空`})
            return
        }
        const chartList = response.data.data
        // console.log('get charts success', chartList)
        if (!chartList.length) {
            commit('updateStatus', {status: 'empty', msg: `${msg}为空`})
            return
        }
        commit('updateStatus', {status: 'success', msg: `${msg}成功`})
        commit('setChartList', chartList)
        if (chartList[0].id) {
            commit('setChartNowId', chartList[0].id) //初始显示第1个图表
            dispatch('chartView/queryChart', {
                chart_id: chartList[0].id,
            }, {
                root: true
            })
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}