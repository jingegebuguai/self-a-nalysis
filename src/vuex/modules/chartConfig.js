import axios from '~/axios'
import {
    getColDictMapFromScenarioInfo,
    getColMapFromScenarioInfo,
    getScenarioInfoById
} from "~/vuex/modules/chartView/utils"
import {getDimensionAndSplitdims} from "~/vuex/modules/common"

const state = {
    scenario_id: 0,
    chart_id: 0,
    chart_name: '未命名图表',
    chart_type: 'table',
    column_map: {},
    col_dict_map: {},
    dimensions: [],
    splitdims: [],
    measures: [],
    filters: [],
    scenario_info: {columns: []},
    status: 'init', // loading, success, error
    msg: '',
    saveStatus: 'init', // loading, success, error
    saveMsg: '',
    last_modified: new Date().getTime(),
    getChartStatus: 'init', // loading, success, error
    getChartMsg: '',
    is_modified: false //图表是否已经被编辑（初始时未被编辑）
}

const getters = {
    filterCols({scenario_info:{column_infos}}) {
        return (text) => {
            if (!text) return column_infos
            return column_infos.filter(col => col['alias'].indexOf(text) !== -1)
        }
    },
    getColumnInfo(state) {
        return function (col_name) {
            if (!state.column_map || !state.column_map[col_name]) {
                return {}
            }
            return state.column_map[col_name]
        }
    },
    chartConfigData(state) {
        const {
            scenario_id,
            chart_id,
            chart_name: name,
            chart_type,
            dimensions,
            splitdims,
            measures,
            filters: data_filters
        } = state

        return {
            scenario_id,
            name,
            chart_type,
            config: {
                dimensions: [...dimensions, ...splitdims],
                measures,
                data_filters
            }
        }
    }
}

const initFunc = {
    measure(cols) {
        for (let col of cols) {
            if (!col.hasOwnProperty('formatter_info')) {
                col['formatter_info'] = {formatter_type: 'number', decimal: 2}
            }
        }
    },
    filter(column_map, cols) {
        for (let col of cols) {
            const colInfo = column_map[col.col_name]
            if (!colInfo) {
                continue
            }
            if (!col.hasOwnProperty('combine_type')) {
                col['combine_type'] = 'and'
            }
            if (colInfo.type === 'DIMENSION') {
                if (colInfo.dict) {//有字典: in
                    if (!col.hasOwnProperty('filter_detail_infos')) {
                        col['filter_detail_infos'] = [{filter_type: 'in', values: []}]
                    }
                } else if (colInfo.is_calendar) {//日期字段
                    if (!col.hasOwnProperty('filter_detail_infos')) {
                        col['filter_detail_infos'] = [{filter_type: 'relative_date', values: ['now-7d/d']}]
                    }
                } else {//无字典字符串: not_empty
                    if (!col.hasOwnProperty('filter_detail_infos')) {
                        col['filter_detail_infos'] = [{filter_type: 'not_empty', values: []}]
                    }
                }
            } else if (colInfo.type === 'MEASURE') {
                if (!col.hasOwnProperty('filter_detail_infos')) {
                    col['filter_detail_infos'] = [{filter_type: 'gt', values: [0]}]
                }
            }
        }
    },
}

const mutations = {
    updateScenarios(state, {status = '', msg = '', column_map, scenario_info, col_dict_map}) {
        state.status = status
        state.msg = msg
        state.scenario_info = scenario_info
        state.column_map = column_map
        state.col_dict_map = col_dict_map
    },
    updateChartName(state, chart_name) {
        state.is_modified = true
        state.chart_name = chart_name
    },
    updateChartType(state, chart_type) {
        state.is_modified = true
        state.chart_type = chart_type
        const {dimensions, splitdims} = getDimensionAndSplitdims(chart_type, state.dimensions, state.splitdims)
        state.dimensions = dimensions
        state.splitdims = splitdims
    },
    updateColumn(state, {dimensions, measures, filters, splitdims}) {
        state.is_modified = true
        if (dimensions) {
            //设置日期过滤
            let colArr = dimensions
            if (splitdims) {
                colArr = [...dimensions, ...splitdims]
            }

            //存在重复字段，不更新state
            const colNameList = colArr.map(o => o.col_name)
            if (Array.from(new Set(colNameList)).length < colNameList.length) {
                return
            }

            const dateCol = colArr.find(col => state.column_map[col.col_name].is_calendar)
            if (dateCol) {
                let dateFilter = state.filters.find(filterConf => filterConf.col_name === dateCol.col_name)
                if (!dateFilter) {//如果存在日期维度或分割线，但不存在日期过滤器，则设置日期过滤器为最近一周
                    let dateFilter = state.filters.find(filterConf => filterConf.col_name === dateCol.col_name)
                    dateFilter = {//构造日期过滤器
                        col_name: dateCol.col_name,
                        combine_type: 'and',
                        filter_detail_infos: [{
                            filter_type: 'relative_date',
                            values: ['now-7d/d']
                        }]
                    }
                    state.filters = [dateFilter, ...state.filters]
                }
            }
            state.dimensions = dimensions
        }
        if (splitdims) {

            let colArr = splitdims
            if (dimensions) {
                colArr = [...dimensions, ...splitdims]
            }

            //存在重复字段，不更新state
            const colNameList = colArr.map(o => o.col_name)
            if (Array.from(new Set(colNameList)).length < colNameList.length) {
                return
            }

            state.splitdims = splitdims
        }
        if (measures) {

            //存在重复字段，不更新state
            const colNameList = measures.map(o => o.col_name)
            if (Array.from(new Set(colNameList)).length < colNameList.length) {
                return
            }

            initFunc.measure(measures)
            state.measures = measures
        }
        if (filters) {

            //存在重复字段，不更新state
            const colNameList = filters.map(o => o.col_name)
            if (Array.from(new Set(colNameList)).length < colNameList.length) {
                return
            }

            initFunc.filter(state.column_map, filters)
            state.filters = filters
        }
        //每次拖动时处理排序列：所有字段都未排序时，对第1个字段倒序排列
        const allDims = [...state.dimensions, ...state.splitdims, ...state.measures]
        if (allDims.length > 0 && allDims.filter(col => !!col.order_type && col.order_type !== 'none').length === 0) {
            allDims[0].order_type = 'desc'
            state.dimensions = [...state.dimensions]
            state.splitdims = [...state.splitdims]
        }
    },
    removeColumn(state, {index, type}) {
        console.info("index, type: ", index, type)
        if (type === 'dimension') {
            state.dimensions = state.dimensions.filter((col, idx) => idx !== index)
        } else if (type === 'splitdim') {
            state.splitdims = state.splitdims.filter((col, idx) => idx !== index)
        } else if (type === 'measure') {
            state.measures = state.measures.filter((col, idx) => idx !== index)
        } else if (type === 'filter') {
            state.filters = state.filters.filter((col, idx) => idx !== index)
        }
    },
    initChartState(state, {scenario_id}) {
        const chartInitState = {
            chart_id: -1,
            chart_name: '未命名图表',
            chart_type: 'table',
            scenario_id,
            dimensions: [],
            measures: [],
            filters: []
        }
        Object.assign(state, chartInitState)
    },
    saveConfigStatus(state, {status, msg = ''}) {
        state.saveStatus = status
        state.saveMsg = msg
    },
    updateChartId(state, chart_id) {
        state.chart_id = chart_id
    },
    getChartStatus(state, {status, msg = '', chart_info}) {
        state.getChartStatus = status
        state.getChartMsg = msg
        if (chart_info) {

            const original_dim = chart_info.config.dimensions
            const chart_type = chart_info.chart_type

            const {dimensions, splitdims} = getDimensionAndSplitdims(chart_type, original_dim, [])//数据库中只保存“维度”信息，不保存“分割线”

            const {
                id: chart_id,
                name: chart_name,
                config: {
                    measures,
                    data_filters: filters
                },
                scenario_id
            } = chart_info

            Object.assign(state, {
                chart_id,
                chart_name,
                chart_type,
                dimensions,
                splitdims,
                measures,
                filters,
                scenario_id
            })
        }
    },
    setIsModified(state, is_modified) {
        state.is_modified = is_modified
    }
}

const actions = {
    getScenariosMetadata: async function ({commit}, scenario_id) {
        commit('updateScenarios', {status: 'loading'})
        const scenario_info = await getScenarioInfoById(scenario_id)
        const column_map = getColMapFromScenarioInfo(scenario_info.column_infos)
        const col_dict_map = await getColDictMapFromScenarioInfo(scenario_info.column_infos)
        commit('updateScenarios', {status: 'success', msg: '查询数据源元数据成功', column_map, scenario_info, col_dict_map})
    },
    initChartConfig: function ({dispatch, commit}, scenario_id) {
        //初始化图表配置
        commit('initChartState', {scenario_id})
        //异步得到字段字典信息
        dispatch('getScenariosMetadata', scenario_id)
    },
    saveChartConfig: async function ({state, commit, dispatch, getters}, isPreview) {
        if (isPreview === true) {//预览数据
            commit('chartView/chartNowData/setChartViewConfig', getters.chartConfigData, {root: true})
            dispatch('chartView/previewChart', {query_type: 'init'}, {root: true})
        } else {//保存图表、创建图表
            commit('saveConfigStatus', {status: 'loading'})
            if (getters.chartConfigData.name.trim() === "" || getters.chartConfigData.name === '未命名图表') {
                commit('saveConfigStatus', {status: 'error', msg: '请输入图表名称！'})
                return
            }
            try {
                if (!state.chart_id || state.chart_id <= 0) {//创建图表，将得到的图表id存入state
                    const response = await axios.post(`api/charts`, getters.chartConfigData)
                    console.log('=== create chart name success ===', response.data)
                    commit('updateChartId', response.data['data'].id)
                } else {//保存图表
                    await axios.put(`api/charts/${state.chart_id}`, getters.chartConfigData)
                }

                commit('setIsModified', false)
                commit('saveConfigStatus', {status: 'success', msg: '成功保存图表配置'})

                //查询图表信息和图表数据
                dispatch('chartView/queryChart', {
                    chart_id: state.chart_id,
                }, {
                    root: true
                })
            } catch (e) {
                console.error('save chart config error', e)
                commit('saveConfigStatus', {status: 'error', msg: '保存图表配置出错'})
            }
        }
    },
    getChartInfo: async function ({dispatch, commit}, chart_id) {
        commit('getChartStatus', {status: 'loading'})
        const response = await axios.get(`api/charts/${chart_id}`).catch(function (error) {
            console.error('get chart info error', error)
            commit('getChartStatus', {status: 'error', msg: '获取图表信息出错'})
        })
        const chart_info = response.data['data']
        commit('getChartStatus', {status: 'success', msg: '获取图表信息成功', chart_info})
        dispatch('getScenariosMetadata', state.scenario_id)
        dispatch('chartView/queryChart', {
            chart_id: state.chart_id,
        }, {
            root: true
        })
    }

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
