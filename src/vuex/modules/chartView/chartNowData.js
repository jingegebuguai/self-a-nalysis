import axios from '~/axios'
import {transformColInfo, transformServerData} from './utils'
import config from '~/components/ChartView/ChartShow/data/table'
import {
    getColDictMapFromScenarioInfo,
    getColMapFromScenarioInfo,
    getScenarioInfoById
} from "~/vuex/modules/chartView/utils"

const state = {
    queryChartFlag: {
        schemaUpdateTime: -1,
        queryChartId: -1
    },
    pending: [],
    chartNowColDict: null,
    chartNowData: null,
    chartNowInfo: null,
    chartColList: null,
    chartColData: null,
    responsePageInfo: {
        page: 0,
        limit: 0,
        total: 0
    },
    requestPageInfo: {
        page: 0,
        limit: config.chart_table_page_size,
        sort: {}
    },
    status: 'loading', // init, loading, success, error
    msg: ''
}

const getters = {
    isFlagEqual(state, getters, rootState) {
        return ({queryChartId, schemaUpdateTime}) => {
            const rootFlag = rootState.chartView.queryChartFlag
            return queryChartId === rootFlag.queryChartId && schemaUpdateTime === rootFlag.schemaUpdateTime
        }
    },
}

const mutations = {
    updateStatus(state, {status, queryChartFlag, msg}) {
        state.status = status
        state.queryChartFlag = queryChartFlag
        state.msg = !!msg ? msg : status
    },
    setChartNow(state, {info, rows, page, colList, colData, chartNowColDict}) {
        state.chartNowInfo = info
        state.chartNowData = rows
        state.chartColList = colList
        state.chartColData = colData
        state.responsePageInfo = page
        state.chartNowColDict = chartNowColDict
    },
    setRequestPageInfo(state, page) {
        console.info("==> page: ", page)
        state.requestPageInfo = page
    },
    setCancelToken(state, playload) {
        state.pending.push(playload)
    },
    removePending(state) {
        for (let i in state.pending) {
            state.pending[i]()
            state.pending.splice(i, 1) //把这条记录从数组中移除
        }
    },
    setChartViewConfig(state, chartInfo) {
        state.chartNowInfo = chartInfo
    },
    updateColOrder(state, orderConf) {
        //清除所有字段排序
        console.info("==> 清除所有字段排序",
            JSON.stringify(state.chartNowInfo),
            JSON.stringify(orderConf))
        const chart = state.chartNowInfo
        const colList = [...chart.config.dimensions, ...chart.config.measures]
        colList.forEach(o => o.order_type = 'none')
        const orderCol = colList.find(o => o.col_name === orderConf.col_name)
        if (orderCol) {
            orderCol.order_type = orderConf.order_type
        }
        state.chartNowInfo = {...state.chartNowInfo}
    }
}

const CancelToken = axios.CancelToken
const actions = {
    getChartNowData: async function ({commit, rootState, state, dispatch}, {queryChartId, schemaUpdateTime}) {
        const queryChartFlag = {queryChartId, schemaUpdateTime}
        commit('updateStatus', {status: 'loading', queryChartFlag})

        if (queryChartId === -1) {
            return
        }
        const msg = `获取当前图表${queryChartId}数据`

        //初始化分页参数
        const queryType = rootState.chartView.chartQueryType
        console.info("==> queryType", queryType)
        if (queryType !== 'page') {
            commit('setRequestPageInfo', {
                page: 1,
                limit: config.chart_table_page_size
            })
            // console.info("==> 分页\n", JSON.stringify(state.requestPageInfo, null, 2))
        }
        const {limit, page} = state.requestPageInfo

        let response
        const requestUrl = `api/charts/${queryChartId}/data?limit=${limit}&page=${page}&schemaUpdateTime=${schemaUpdateTime}`
        try {
            commit('removePending')
            if (queryChartId === 'preview') {
                let chartInfo = state.chartNowInfo
                response = await axios.post(requestUrl, {
                    ...chartInfo,
                    cancelToken: new CancelToken(function (c) {
                        commit('setCancelToken', c)
                    })
                })
            } else {
                response = await axios.get(requestUrl, {
                    cancelToken: new CancelToken(function (c) {
                        commit('setCancelToken', c)
                    })
                })
            }
            commit('removePending')
        } catch (error) {
            if (axios.isCancel(error) || (error instanceof TypeError)) {
                console.info('==> 接口请求被取消', requestUrl)
                return
            }
            console.warn('get charts error', error)
            commit('updateStatus', {status: 'error', queryChartFlag, msg: `${msg}_${error}`})
            return
        }

        if (response.errors || !response.data || !response.data.data || !response.data.data.rows) {
            commit('updateStatus', {status: 'error', queryChartFlag, msg: `${msg}返回字段缺失`})
            return
        }

        const res = response.data.data
        // if (queryChartId !== 'preview') {//预览数据时不需要获取服务器返回的chartInfo
        let chartInfo = res.info
        // }
        const {chart_type, config: {dimensions, measures}, scenario_id} = chartInfo

        let column_map, col_dict_map
        if (rootState.chartConfig.status === 'success' && parseInt(rootState.chartConfig.scenario_id) === parseInt(scenario_id)) {
            column_map = rootState.chartConfig.column_map
            col_dict_map = rootState.chartConfig.col_dict_map
        } else {
            const scenario_info = await getScenarioInfoById(scenario_id)
            column_map = getColMapFromScenarioInfo(scenario_info.column_infos)
            col_dict_map = await getColDictMapFromScenarioInfo(scenario_info.column_infos)
        }
        const colList = await transformColInfo(chart_type, dimensions, measures, column_map, col_dict_map)
        const colData = transformServerData(colList, res.rows)

        commit('setChartNow', {
            info: chartInfo,
            rows: res.rows,
            page: response.data.page,
            colList,
            colData
        })
        commit('updateStatus', {status: 'success', queryChartFlag, msg: `${msg}成功`})
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}