import axios from '~/axios'
import numeral from 'numeral'

const state = {
    previewTableData: [],
    previewTableData_status: 'init', // loading, success, error
    previewTableData_msg: '',

    columnInfoTableData: {},
    columnInfoTableData_status: 'init', // loading, success, error
    columnInfoTableData_msg: '',

    dictTableData: {},
    dictTableData_status: 'init', // loading, success, error
    dictTableData_msg: '',

    tableTree: [],
    tableTree_status: 'init', // loading, success, error
    tableTree_msg: '',

    currentDictData: {},
    currentSlideNode: {},

    dialogVisible: false,
    dialogType: 'tree', //tree, table, text
    dictMap: {},     //key:L1GH5Y773PTL6TQP  value: data.info
    reqCount: 0,     //准备请求接口的次数
    reqFinishCount: 0,     //实际请求接口的次数
    cal_rule: '',

    userName: '',
    isAdmin: false
}
const getters = {
    getTableTree: state => state.tableTree,
    getPreviewTableData: state => state.previewTableData,
    getColumnInfoTableData: state => state.columnInfoTableData,
    getDictTableData: state => state.dictTableData,
    getFirstSlideNode(state) {
        if (state.currentSlideNode.hasOwnProperty('id'))
            return state.currentSlideNode
        const data = state.tableTree
        /*if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].scenarios && data[i].scenarios.length && data[i].scenarios) {
                    return data[i].scenarios[0]
                }
            }
            return data[0].scenarios[0]
        }
        return null*/
        for (let i = 0; i < data.length; i++) {
            for(let j=0;j<data[i].scenarios.length;j++){
                if(data[i].scenarios[j].id!=-1){
                    return data[i].scenarios[j]
                }
            }
        }
        return null

    },
    getDictData: (state) => ({dict_id, dict_key}) => {
        if (dict_key === null) {
            return '-'
        }
        const dictJson = state.dictMap[dict_id]

        if (!dictJson) {
            console.warn(`dictMap未包含dictId: ${dict_id}`)
            return "-"
        }
        return dictJson[dict_key]
    }
}
const mutations = {
    updatePreviewTableDataStatus(state, {status, msg = ''}) {
        state.previewTableData_status = status
        state.previewTableData_msg = msg
    },
    updateColumnInfoTableDataStatus(state, {status, msg = ''}) {
        state.columnInfoTableData_status = status
        state.columnInfoTableData_msg = msg
    },
    updateDictTableDataStatus(state, {status, msg = ''}) {
        state.dictTableData_status = status
        state.dictTableData_msg = msg
    },
    updateTableTreeStatus(state, {status, msg = ''}) {
        state.tableTree_status = status
        state.tableTree_msg = msg
    },
    previewTableDataRefresh(state, ret) {
        state.previewTableData = ret
    },
    columnInfoTableDataRefresh(state, ret) {
        state.columnInfoTableData = ret
    },
    dictTableDataRefresh(state, ret) {
        state.dictTableData = ret
    },
    tableTreeRefresh(state, ret) {
        state.tableTree = ret
    },
    setCurrentDictData(state, ret) {
        state.currentDictData = ret
    },
    setCurrentSlideNode(state, ret) {
        state.currentSlideNode = ret
    },
    showDialog(state, type) {
        state.dialogVisible = true
        state.dialogType = type
    },
    hideDialog(state) {
        state.dialogVisible = false
    },
    updateDictMap(state, {dict_id, dictJson}) {
        //Map结构不能序列化，目前vuex的state还不支持Map结构按key更新，改为json格式: https://github.com/vuejs/vue/issues/2410
        state.dictMap[dict_id] = dictJson
    },
    addReqCount(state) {
        state.reqCount = state.reqCount + 1
    },
    addFinishCount(state) {
        state.reqFinishCount = state.reqFinishCount + 1
    },
    updateUsername(state, ret) {
        state.userName = ret
    },
    updateIsAdmin(state, ret) {
        state.isAdmin = ret
    }
}

const actions = {
    tableTreeAction: async function ({commit, dispatch, rootState}) {
        commit('updateTableTreeStatus', {status: 'loading'})
        const response = await axios.get(`api/scenarios`).catch(function (error) {
            console.error('get scenarios meta data error', error)
            commit('updateTableTreeStatus', {status: 'error', msg: '查询数据源元数据出错'})
        })
        console.log('get scenarios meta data success', response.data.data)
        commit('updateTableTreeStatus', {status: 'success', msg: '查询数据源元数据成功'})

        let tree = response.data.data
        if (tree && tree.length) {
            let firstBizId
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].scenarios && tree[i].scenarios.length) {
                    firstBizId = tree[i].business_id
                }
            }
            let currentBizId = rootState.sceneConfig.currentBizLine ? rootState.sceneConfig.currentBizLine : firstBizId
            commit('sceneConfig/updateCurrentBiz', '', {root: true})
            commit('sceneConfig/updateCurrentBiz', currentBizId, {root: true})
            dispatch('sceneConfig/getSuggestionMapByBizKey', currentBizId, {root: true})
        }
        tree.map(o => {
            commit('sceneConfig/addBizLines', {
                business_id: o.business_id,
                business_name: o.business_name
            }, {root: true})
            commit('sceneConfig/addBizScenes', {
                business_id: o.business_id,
                scenarios: o.scenarios
            }, {root: true})
        })

        for (let i = 0; i < tree.length; i++) {
            tree[i].scenarios = tree[i].scenarios.filter(o => {
                return o.status == 1
            })
            if (tree[i].scenarios.length == 0) {
                tree[i].scenarios.push({
                    "id": -1,
                    "name": null,
                    "status": 1,
                })
            }
        }
        commit('tableTreeRefresh', tree)
    },
    reloadAction: async function ({commit, dispatch}, params) {
        commit('updatePreviewTableDataStatus', {status: 'loading'})
        dispatch('handlerMetaData', params)
    },
    handlerMetaData: function ({commit, dispatch}, scenario_id) {
        commit('addReqCount')
        commit('updateColumnInfoTableDataStatus', {status: 'loading'})
        console.log('查询字段信息的id=' + JSON.stringify(scenario_id))

        axios.get(`api/scenarios/` + scenario_id).then(response => {
            const columnData = response.data.data
            console.log('get data source meta data success', columnData)

            commit('updateColumnInfoTableDataStatus', {status: 'success', msg: '查询字段信息元数据成功'})

            let columns = columnData.column_infos
            columns = columns.filter(o => {
                return o.is_show
            })
            columnData.column_infos = columns

            commit('columnInfoTableDataRefresh', columnData)

            let dictIds = []
            for (let column of columns) {
                if (column.dict) {
                    dictIds.push(column.dict)
                }
            }
            let transferParams = {}
            transferParams.id = scenario_id
            transferParams.dictIds = dictIds.toString()
            dispatch('initFunc', scenario_id) //init status of metaData,dicts
            axios.all([
                dispatch('handlerData', scenario_id).catch(error => {
                    console.error('get preview data error', error)
                    commit('updatePreviewTableDataStatus', {
                        status: 'error',
                        msg: '获取数据预览信息数据出错'
                    })
                }),
                dispatch('handlerDict', transferParams).catch(error => {
                    console.error('get dict data error', error)
                    commit('updateDictTableDataStatus', {
                        status: 'error',
                        msg: '查询字典信息元数据出错'
                    })
                })])
                .then(axios.spread(function (dataResp, dictResp) {
                    commit('addFinishCount')
                    commit('previewTableDataRefresh', dataResp.data.data)
                    if (dictResp.data.data != null) {
                        const dicts = dictResp.data.data
                        for (let i = 0; i < dicts.length; i++) {
                            let keyMap = {}
                            let innerObj = dicts[i].subList
                            let id = dicts[i].metaId
                            for (let j = 0; j < innerObj.length; j++) {
                                keyMap[innerObj[j].dataValue] = innerObj[j].dataName
                            }
                            commit('updateDictMap', {dict_id: id, dictJson: keyMap})
                        }
                        commit('dictTableDataRefresh', dictResp.data)
                    }
                    dispatch('translateData', transferParams.id)
                }))
        }).catch(error => {
            console.error('get data source meta data error', error)
            commit('updateColumnInfoTableDataStatus', {
                status: 'error',
                msg: '查询字段信息元数据出错'
            })
        })
    },
    handlerData({commit}, params) {
        return axios.get(`api/scenarios/` + params + `/data?limit=50`)
    },
    handlerDict({commit, state, dispatch}, transParams) {
        let dictIds = transParams.dictIds
        return axios.get(`api/babel/dictionary?metaIds=` + dictIds)
    },
    translateData: function ({commit, state, getters}, params) {
        let preViewData = state.previewTableData
        let props = state.columnInfoTableData.column_infos
        let columnNames = []  //date_id,hour 字段名
        let columnTypes = []  //DIMENSION,MEASURE
        let hasDicts = [] //dicts
        let jsonArr = []
        if (props != null) {
            for (let i = 0; i < props.length; i++) {
                columnNames.push(props[i].col_name)
                columnTypes.push(props[i].type)
                hasDicts.push(props[i].dict)
            }
            for (let i = 0; i < preViewData.length; i++) {
                let obj = {}
                for (let j = 0; j < columnNames.length; j++) {
                    if (hasDicts[j] != null && hasDicts[j] != '') {
                        if (columnTypes[j] == 'DIMENSION') {
                            obj[columnNames[j]] = getters.getDictData({
                                dict_id: hasDicts[j],
                                dict_key: preViewData[i][j]
                            })
                        } else {
                            obj[columnNames[j]] = numeral(getters.getDictData({
                                dict_id: hasDicts[j],
                                dict_key: preViewData[i][j]
                            })).format('0,0')
                        }
                    } else {
                        if (columnTypes[j] == 'DIMENSION') {
                            obj[columnNames[j]] = preViewData[i][j]
                        } else {
                            obj[columnNames[j]] = numeral(preViewData[i][j]).format('0,0')
                        }
                    }
                }
                jsonArr.push(obj)
            }
        }
        commit('previewTableDataRefresh', jsonArr)
        if (state.reqCount == state.reqFinishCount) {
            commit('updatePreviewTableDataStatus', {status: 'success', msg: '获取数据预览信息数据成功'})
        }
    },
    initFunc({commit}, params) {
        console.log("获取预览数据的id=" + params)
        commit('updateDictTableDataStatus', {status: 'loading'})
    },
    getUsername: async function ({commit}) {
        const response = await axios.get(`api/user/name`)
        commit('updateUsername', response.data)
    },
    getIsAdmin: async function ({commit}) {
        const response = await axios.get(`api/user/is_admin`)
        commit('updateIsAdmin', response.data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}