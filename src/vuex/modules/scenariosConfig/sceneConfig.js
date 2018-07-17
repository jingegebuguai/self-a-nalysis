import axios from '~/axios'
import {deepCopy} from "~/vuex/modules/chartView/utils";
import {removeCol} from "~/vuex/modules/scenariosConfig/utils";

const state = {
    bizLines: [],   //所有业务线 [{business_id: 'business_id' ,business_name: 'business_name'},...]
    bizScenesMap: {},  //业务线对应场景信息  {business_id: [scenarios]}
    currentBizLine: '',

    selectedDataSourceMetaData: {},
    selectedDataSourceMetaData_status: 'init',
    selectedDataSourceMetaData_msg: '',

    scenariosMetaData: {},
    scenariosMetaData_status: 'init',
    scenariosMetaData_msg: '',

    suggestionMap: {},  //key: business_id, value,suggestionList
    suggestionMap_status: 'init',
    suggestionMap_msg: '',

    colMap: {},      //selectdMetaData 全部col_name

    onlineScenarios_status: 'init',
    onlineScenarios_msg: '',

    newScenarios_status: 'init',
    newScenarios_msg: '',

    updateModifyScenarios_status: 'init',
    updateModifyScenarios_msg: '',

    scenariosPreviewData: {},
    scenariosPreviewData_status: 'init',
    scenariosPreviewData_msg: ''
}
const mutations = {
    addBizLines(state, ret) {
        let isContains = false
        for (let i = 0; i < state.bizLines.length; i++) {
            if (state.bizLines[i].business_id == ret.business_id) {
                isContains = true
                break
            }
        }
        if (!isContains) {
            state.bizLines.push(ret)
        }
    },
    addBizScenes(state, {business_id, scenarios}) {
            state.bizScenesMap[business_id] = scenarios
    },
    updateCurrentBiz(state, ret) {
        state.currentBizLine = ret
    },
    updateSelectedDataSourceMetaData(state, ret) {
        state.selectedDataSourceMetaData = ret
    },
    clearSelectedDataSourceMetaData(state) {
        state.selectedDataSourceMetaData = {}
    },
    removeMetaData(state, {refer, row}) {
        let column = removeCol(refer, refer == 'new' ? state.selectedDataSourceMetaData : state.scenariosMetaData, row)
        refer == 'new' ? state.selectedDataSourceMetaData.columns = column : state.scenariosMetaData.column_infos = column
    },
    editMetaData(state, {refer, index, newRow}) {
        if (refer == 'new') {
            state.selectedDataSourceMetaData.columns[index].alias = newRow.alias
            state.selectedDataSourceMetaData.columns[index].memo = newRow.memo
            state.selectedDataSourceMetaData.columns[index].calc_rule = newRow.calc_rule
            state.selectedDataSourceMetaData.columns[index].col_name = newRow.col_name
            state.selectedDataSourceMetaData.columns[index].last_update_time = newRow.last_update_time
        } else {
            state.scenariosMetaData.column_infos[index].alias = newRow.alias
            state.scenariosMetaData.column_infos[index].memo = newRow.memo
            state.scenariosMetaData.column_infos[index].calc_rule = newRow.calc_rule
            state.scenariosMetaData.column_infos[index].col_name = newRow.col_name
            state.scenariosMetaData.column_infos[index].last_update_time = newRow.last_update_time
        }
    },
    addMetaData(state, {refer, row}) {
        if (refer == 'edit') {
            let newRow = {}
            for (let key in row) {
                newRow[key] = row[key]
            }
            state.scenariosMetaData.column_infos.push(newRow)
        } else {
            let newRow = {}
            for (let key in row) {
                newRow[key] = row[key]
            }
            state.selectedDataSourceMetaData.columns.push(newRow)
        }
    },
    updateSelectMetaStatus(state, {status, msg = ''}) {
        state.selectedDataSourceMetaData_status = status
        state.selectedDataSourceMetaData_msg = msg
    },
    updateScenariosMetaDataStatus(state, {status, msg = ''}) {
        state.scenariosMetaData_status = status
        state.scenariosMetaData_msg = msg
    },
    updateScenariosMetaData(state, ret) {
        state.scenariosMetaData = ret
    },
    updateSuggestionMap(state, {business_id, suggestionList}) {
        state.suggestionMap[business_id] = suggestionList
    },
    updateSuggestionMapStatus(state, {status, msg = ''}) {
        state.suggestionMap_status = status
        state.suggestionMap_msg = msg
    },
    updateColMap(state, ret) {
        state.colMap = ret
    },
    updateScenariosStatus(state, {status, msg}) {
        state.onlineScenarios_status = status
        state.onlineScenarios_msg = msg
    },
    updateScenariosStatusInMetaData(state, status) {
        state.scenariosMetaData.status = status
    },
    updateNewScenariosStatus(state, {status, msg = ''}) {
        state.newScenarios_status = status
        state.newScenarios_msg = msg
    },
    updateModifyScenariosStatus(state, {status, msg = ''}) {
        state.updateModifyScenarios_status = status
        state.updateModifyScenarios_msg = msg
    },
    updateScenariosPreviewData(state, ret) {
        state.scenariosPreviewData = ret
    },
    updateScenariosPreviewDataStatus(state, {status, msg = ''}) {
        state.scenariosPreviewData_status = status
        state.scenariosPreviewData_msg = msg
    }
}

const actions = {
    getSelectDataSourceMetaData: async function ({commit}, params) {
        commit('updateSelectMetaStatus', {status: 'loading'})
        await axios.get(`api/datasources/` + params).then((response) => {
            commit('updateSelectMetaStatus', {status: 'success', msg: '查询数据源元信息成功'})
            let columns = response.data.data.columns
            let newColumns = []
            columns.map(o => {
                let column = {}
                column.col_name = o.name,
                    column.alias = '',
                    column.memo = '',
                    column.type = o.type,
                    column.attribute = 'NATIVE',
                    column.calc_rule = null,
                    column.last_update_time = null,
                    column.is_calendar = false,
                    column.is_show = true,
                    column.dict = o.dict
                newColumns.push(column)
            })
            response.data.data.columns = newColumns
            console.log('meta data', response.data.data)
            commit('updateSelectedDataSourceMetaData', response.data.data)

            let colMap={}
            if (response.data.data.columns) {
                for (let col of response.data.data.columns) {
                    colMap[col.col_name] = col.col_name
                }
            }
            commit('updateColMap',colMap)

        }).catch(function (error) {
            console.error('get select datasource meta data error', error)
            commit('updateSelectMetaStatus', {status: 'error', msg: '获取数据源元信息出错'})
        })
    },
    getScenariosMetaData: async function ({commit}, params) {
        commit('updateScenariosMetaDataStatus', {status: 'loading'})
        await axios.get(`api/scenarios/` + params).then((response) => {
            commit('updateScenariosMetaDataStatus', {status: 'success', msg: '查询场景数据成功'})
            commit('updateScenariosMetaData', response.data.data)
        }).catch(function (error) {
            console.error('get datasource metadata error', error)
            commit('updateScenariosMetaDataStatus', {status: 'error', msg: '查询场景数据失败'})
        })
    },
    getSuggestionMapByBizKey: async function ({commit}, business_id) {
        commit('updateSuggestionMapStatus', {status: 'loading'})
        await axios.get(`api/datasources`, {params: {business_id: business_id}}).then((response) => {
            commit('updateSuggestionMapStatus', {status: 'success', msg: '查询数据源数据成功'})
            commit('updateSuggestionMap', {business_id: business_id, suggestionList: response.data.data})
        }).catch(function (error) {
            console.error('get datasource suggestion error', error)
            commit('updateSuggestionMapStatus', {status: 'error', msg: '查询数据源数据失败'})
        })
    },
    updateScenariosStatusById: async function ({commit, dispatch}, {scenariosId, param}) {
        commit('updateScenariosStatus', {status: 'loading'})
        await axios.put(`api/scenarios/` + scenariosId + `/status`, param).then((response) => {
            commit('updateScenariosStatus', {status: 'success', msg: '下线分析场景成功'})
            dispatch('dataSource/tableTreeAction', null, {root: true})
        }).catch(function (error) {
            console.error('update scenarios status fail', error)
            commit('updateScenariosStatus', {status: 'error', msg: '下线分析场景失败'})
            return
        })
    },
    addNewScenarios: async function ({commit, dispatch}, param) {
        commit('updateNewScenariosStatus', {status: 'loading'})
        await axios.post(`api/scenarios`, param).then((response) => {
            commit('updateNewScenariosStatus', {status: 'success', msg: '新建分析场景成功'})
            dispatch('dataSource/tableTreeAction', null, {root: true})
        }).catch(function (error) {
            console.error('add new scenarios fail', error)
            commit('updateNewScenariosStatus', {status: 'error', msg: '新建分析场景失败'})
        })
    },
    updateScenarios: async function ({commit, dispatch}, {scenariosId, param, way}) {
        let msg = way == 'save' ? '保存分析场景' : '上线分析场景'
        commit('updateModifyScenariosStatus', {status: 'loading'})
        await axios.put(`api/scenarios/` + scenariosId, param).then((response) => {
            commit('updateModifyScenariosStatus', {status: 'success', msg: msg + '成功'})
            dispatch('dataSource/tableTreeAction', null, {root: true})
            dispatch('dataSource/reloadAction', scenariosId, {root: true})
        }).catch(function (error) {
            console.error('update scenarios fail', error)
            commit('updateModifyScenariosStatus', {status: 'error', msg: msg + '失败'})
        })
    },
    getScenariosPreviewData: async function ({commit}, scenariosId) {
        commit('updateScenariosPreviewDataStatus', {status: 'loading'})
        const response = await axios.get(`api/scenarios/` + scenariosId).catch(function (error) {
            console.error('update scenarios fail', error)
            commit('updateScenariosPreviewDataStatus', {status: 'error', msg: '获取场景信息失败'})
        })
        commit('updateScenariosPreviewDataStatus', {status: 'success', msg: '获取场景信息成功'})
        let dataSourceId = response.data.data.datasource_id
        const responseDataSource = await axios.get(`api/datasources/` + dataSourceId).catch(function (error) {
            commit('updateScenariosPreviewDataStatus', {status: 'error', msg: '获取场景信息失败'})
        })
        response.data.data.table_name = responseDataSource.data.data.name
        commit('updateScenariosPreviewData', response.data.data)
    }
}
const getters = {
    getBizNameByKey: (state) => (business_id) => {
        return state.bizLines.filter(o => {
            return o.business_id == business_id
        })[0]
    },
    getFilterColumn: (state) => ({entry, keyword}) => {
        if (entry == 'new') {
            const rowList = JSON.parse(JSON.stringify(state.selectedDataSourceMetaData))
            rowList.columns = rowList.columns.filter(o => {
                if (keyword == '') return true
                else
                    return o.col_name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
            })
            return rowList
        } else {
            const rowList = JSON.parse(JSON.stringify(state.scenariosMetaData))
            rowList.column_infos = state.scenariosMetaData.column_infos.filter(o => {
                if (keyword == '') return true
                else
                    return o.col_name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || o.alias.indexOf(keyword) > -1
            })
            return rowList
        }
    },
    getTableNamesByBizKey: (state) => (business_id) => {
        return state.suggestionMap[business_id]
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}