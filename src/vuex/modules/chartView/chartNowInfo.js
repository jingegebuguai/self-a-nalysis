import axios from '~/axios'
import {getScenarioInfoById, getColLabel, getColKey} from './utils'
import {getDimensionAndSplitdims} from "~/vuex/modules/common"

const state = {
    queryChartFlag: {
        schemaUpdateTime: -1,
        queryChartId: -1
    },
    pending: [],
    chartNowInfo: {},
    chartColList: [],
    status: 'loading', // loading, success, error
    msg: ''
}

const getters = {
    isFlagEqual(state, getters, rootState) {
        return ({queryChartId, schemaUpdateTime}) => {
            const rootFlag = rootState.chartView.queryChartFlag
            return queryChartId === rootFlag.queryChartId && schemaUpdateTime === rootFlag.schemaUpdateTime
        }
    }
}

const mutations = {
    updateStatus(state, {status, queryChartFlag, msg}) {
        state.status = status
        state.queryChartFlag = queryChartFlag
        state.msg = !!msg ? msg : status
    },
    setChartNowInfo(state, playload) {
        state.chartNowInfo = playload
    },
    setChartNowColList(state, dict) {
        state.chartColList = dict
    },
    removePending(state) {
        for (let i in state.pending) {
            state.pending[i]()
            state.pending.splice(i, 1) //把这条记录从数组中移除
        }
    },
}

const getColList = function (chartInfo, column_map) {
    const colList = []
    console.info("--> chartInfo", chartInfo)
    if (!chartInfo.config || !chartInfo.config.dimensions) {
        console.warn("该图表配置信息不全")
        return
    }

    const {dimensions, splitdims} = getDimensionAndSplitdims(chartInfo.chart_type, chartInfo.config.dimensions, [])

    let col_index = 0;
    [dimensions, splitdims].forEach((arr, idx) => {
        for (let o of arr) {
            colList.push({
                col_key: getColKey(o),
                col_label: getColLabel(o.col_name, column_map),
                col_dict: column_map[o.col_name] ? column_map[o.col_name]['dict_id'] : null, //只有维度才需要字典转换
                col_config: o,
                cube_type: idx === 0 ? 'dimension' : 'splitdim',
                col_index: col_index++
            })
        }
    })

    if (chartInfo.config.measures) {
        for (let o of chartInfo.config.measures) {
            colList.push({
                col_key: getColKey(o),
                col_label: getColLabel(o.col_name, column_map),
                col_dict: null, //度量不需要字典转换
                col_config: o,
                cube_type: 'measure',
                col_index: col_index++
            })
        }
    }
    return colList
}

const CancelToken = axios.CancelToken
const actions = {
    getChartNowInfo: async function ({commit, state, dispatch, getters, rootState}, {queryChartId, schemaUpdateTime}) {
        const queryChartFlag = {queryChartId, schemaUpdateTime}
        commit('updateStatus', {status: 'loading', queryChartFlag})

        if (queryChartId === -1) {
            return
        }

        const msg = `获取当前图表${queryChartId}`
        let response
        const requestUrl = `api/charts/${queryChartId}`
        try {
            commit('removePending')
            response = await axios.get(requestUrl, {
                cancelToken: new CancelToken(function (c) {
                    commit('setCancelToken', c)
                })
            })
        } catch (error) {
            if (axios.isCancel(error) || (error instanceof TypeError)) {
                console.info('==> 接口请求被取消', requestUrl)
                return
            }
            console.warn('get charts error', error)
            commit('updateStatus', {status: 'error', queryChartFlag, msg: `${msg}为空`})
            return
        }
        if (response.errors || !response.data || !response.data.data) {
            commit('updateStatus', {status: 'error', queryChartFlag, msg: `${msg}为空`})
            return
        }
        const chartInfo = response.data.data
        const {column_map, scenario_info} = await getScenarioInfoById(chartInfo.scenario_id)
        const colList = getColList(chartInfo, column_map)


        const dictIds = [...new Set(colList.map(o => o.col_dict).filter(o => o !== null))]
        if (dictIds && dictIds.length > 0) {
            await dispatch('dataSource/setDictDataAction', dictIds.toString(), {root: true})//获取字典信息
        }

        if (!getters.isFlagEqual(queryChartFlag)) {
            console.info('==> info 请求id与当前id不一致，不改变状态')
            return
        }

        commit('updateStatus', {status: 'success', queryChartFlag, msg: `${msg}成功`})
        commit('setChartNowInfo', chartInfo)
        commit('setChartNowColList', colList)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}

export {getColList}