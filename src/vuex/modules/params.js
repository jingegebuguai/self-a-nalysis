import axios from '~/axios'
import {SuggestionData} from '../mutation-types'

const state = {
  suggestion: [],
  dateRangeLimit: {
    min_dt: null,
    max_dt: null
  },
  initDateRage: null,
  param: {
    data: {
      "userId": "",
      "dates": ["2017-10-11", "2017-10-18"],
      "stepLength": ["1", "10"],
      "platform": ["2_22_221", "2_22_222"],
      "sessionTime": ["5000", "601000"],
      "version": ["8.5.0", "8.8.5", "8.9.0", "8.9.5"],
      "userLiveness": ["16", "30"]
    },
    status: 'init',
    msg: ''
  }
}

const mutations = {

  [SuggestionData] (state, data) {
    state.suggestion = data
  },

  SetStatus(state,{status, msg=''}){
    state.param.status = status
    state.param.msg = msg
  },

  SetInitDateRage(state, val){
    state.initDateRage = val
  },

  SetDateRageLimit(state, val){
    state.dateRangeLimit = val
  }
}

const actions = {
  getSuggestionData: async function ({commit}, {type, query}) {
    if (query !== '') {
      let response = await axios.get(`/analyzing/route/api/suggest`,{
        params: {
          type,
          query
        }
      }).catch(function (error) {
        console.error(error)
        commit(SuggestionData,[])
      })
      if(response.status == 200 && response.data.code == 'A00000'){
        commit(SuggestionData,response.data.data)
      } else {
        commit(SuggestionData,[])
      }
    } else {
      commit(SuggestionData,[])
    }
  },
  sendParam: async function ({commit, state, dispatch}, formData){
    commit('SetStatus',{status:'loading'})
    let response = await axios.post(`/analyzing/route/api/send_param`,formData).catch(function (error) {
      console.error(error)
      commit('SetStatus',{status:'error',msg:"提交参数出错！"})
      return
    })
    if(response.status != 200){
      commit('SetStatus',{status: 'error', msg: '提交参数出错！'})
      return
    }
    const ret = response.data

    if(ret.code == 'B00002'){
      commit('SetStatus',{status: 'error', msg: '与服务器连接断开，请刷新页面！'})
      return
    }
    
    // console.info("send param to server success: ", JSON.stringify(ret))
    commit('ChangeQueryMd5',ret.data.query_md5, { root: true }) //参数提交成功，改变全局query_md5
    console.time(`calc time of distribute (${ret.data.query_md5})`)
    console.time(`calc time of route (${ret.data.query_md5})`)

    if(ret.code == 'A00000'){
      commit('SetStatus',{status: ret.code, msg: '任务提交成功，请稍候'})
    }else if(ret.code == 'A00001'){
      commit('SetStatus',{status: ret.code, msg: '任务结果已生成，直接显示'})
      dispatch('getChartResult', null, { root: true }) //结果已存在，直接展示结果图
    }else if(ret.code == 'A00002'){
      commit('SetStatus',{status: ret.code, msg: `已有相同条件任务正在运行，请稍候`})
    } else {
      commit('SetStatus',{status:'error',msg:"查询出错！"})//参数提交失败，给用户提示
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
