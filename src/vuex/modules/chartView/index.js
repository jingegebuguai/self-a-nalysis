import chartList from "~/vuex/modules/chartView/chartList"
import chartNowInfo from "~/vuex/modules/chartView/chartNowInfo"
import chartNowData from "~/vuex/modules/chartView/chartNowData"

const state = {
    queryChartFlag: {
        schemaUpdateTime: -1,
        queryChartId: -1
    },
    chartQueryType: 'init'
}

const getters = {}

const mutations = {
    setQueryChartId(state, {queryChartId, chartQueryType}) {
        state.queryChartFlag.queryChartId = queryChartId
        state.queryChartFlag.schemaUpdateTime++
        state.chartQueryType = chartQueryType
    },
}

const actions = {
    queryChart({state, commit, dispatch}, {chart_id}) {
        if (!chart_id) {
            chart_id = state.queryChartFlag.queryChartId
        }
        commit('setQueryChartId', {
            queryChartId: chart_id,
        })
        dispatch('chartNowData/getChartNowData', {
            ...state.queryChartFlag,
        })
    },
    previewChart({state, commit, dispatch, rootGetters}, {query_type}) {
        commit('setQueryChartId', {
            queryChartId: 'preview',
            chartQueryType: query_type
        })
        dispatch('chartNowData/getChartNowData', {
            ...state.queryChartFlag
        })
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules: {
        chartList,
        chartNowInfo,
        chartNowData
    }
}