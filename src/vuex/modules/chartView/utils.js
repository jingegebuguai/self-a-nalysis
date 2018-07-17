import axios from '~/axios'
import numeral from 'numeral'
import {getDimensionAndSplitdims} from "~/vuex/modules/common"

/**
 * 根据id获取分析场景数据
 * @param id
 * @return
 */
const getScenarioInfoById = async function (id) {
    //获取分析场景信息
    console.info(`get scenario info id: ${id}`)
    let response
    try {
        response = await axios.get(`api/scenarios/${id}`)
    } catch (error) {
        console.warn('get scenarios info error', error)
        return null
    }
    console.info(`get scenario info response: `, response)
    if (response.errors || !response.data || !response.data.data || !response.data.data.column_infos) {
        console.warn('get scenarios info error', 'return data not complete')
        return null
    }
    response.data.data.column_infos = response.data.data.column_infos.filter(o => o.is_show)
    return response.data.data
}

/**
 * 根据分析场景数据获取字段信息、字段字典数据
 * @param scenario_info
 */
const getColMapFromScenarioInfo = column_infos => column_infos.reduce((json, col) => {
    json[col.col_name] = col
    return json
}, {})

/**
 * 根据分析场景数据获取字段字典数据
 * @param scenario_info
 * @return {Promise<{}>}
 */
const getColDictMapFromScenarioInfo = async (column_infos) => {
    //获取分析场景字段的字典数据
    let col_dict_map = {}
    const dictIdArr = column_infos.filter(o => o.type === 'DIMENSION' && !!o.dict).map(o => o.dict).filter(o => !!o)
    if (dictIdArr.length > 0) {
        const dictResult = await axios.get(`api/babel/dictionary?metaIds=${dictIdArr.join()}`)
        if (dictResult.data) {
            col_dict_map = dictResult.data.data.reduce((json, dict) => {
                json[dict.metaId] = dict.subList.reduce((innerJson, obj) => {
                    innerJson[obj.dataValue] = obj.dataName
                    return innerJson
                }, {})
                return json
            }, {})
        }
    }
    console.info("得到字典数据", JSON.stringify(col_dict_map))
    return col_dict_map
}

const getColLabel = function (col_name, column_map) {
    let dict = column_map[col_name]
    return dict ? dict['alias'] : col_name
}

const getColKey = function (colConf) {
    return colConf.col_name
}

/**
 * 转换度量和维度为图表列
 * @param chart_type 图表类型 {col_name,order_type}
 * @param original_dim 维度 {col_name,order_type}
 * @param measures 度量 {col_name,order_type,formatter_info}
 * @param column_map 字段信息
 * @param col_dict_map 字典数据信息
 * @return [{col_name,type,info:{},dict:{}}]
 */
const transformColInfo = async function (chart_type, original_dim, measures, column_map, col_dict_map) {
    //分析场景数据
    if (!column_map) {
        throw "场景信息缺失！"
    }

    //根据图表类型来获取分割线字段
    const {dimensions, splitdims} = getDimensionAndSplitdims(chart_type, original_dim, [])

    return [
        ...dimensions.map(o => ({...o, cube_type: 'dimension'})),
        ...splitdims.map(o => ({...o, cube_type: 'splitdim'})),
        ...measures.map(o => ({...o, cube_type: 'measure'}))
    ].map(o => ({
        ...o,
        info: column_map[o.col_name]
    })).map(o => ({
        ...o,
        col_label: o.info.alias ? o.info.alias : o.col_name,
        dict: !!o.info.dict ? col_dict_map[o.info.dict] : null
    }))
}

/**
 * 转换服务器返回数据的格式，并拼装字典信息
 * @param col_list 图表列
 * @param arrays 原始数据（二维数组）
 */
const transformServerData = (col_list, arrays) => arrays.map(array => {
    const col_data = {}
    array.forEach((orginal_value, i) => {
        const col_info = col_list[i]

        //获取显示值
        let show_value = orginal_value
        if (col_info.cube_type === 'dimension') {//维度字段-字典转换
            if (col_info.dict && col_info.dict.hasOwnProperty(orginal_value)) {
                show_value = col_info.dict[orginal_value]
            }
        } else if (col_info.cube_type === 'measure') {//度量字段-数字格式化
            if (Number.isInteger(orginal_value)) {
                show_value = numeral(orginal_value).format('0,0')
            } else {
                const info = col_info.formatter_info
                const formatter = '0,0'
                    + (info.decimal > 0 ? '.' + new Array(info.decimal + 1).join('0') : '')
                    + (info.formatter_type === 'percent' ? '%' : '')
                show_value = numeral(orginal_value).format(formatter)
            }
        }
        col_data[col_info.col_name] = {
            value: orginal_value,
            show_value: show_value
        }
    })
    return col_data
})

export {
    getScenarioInfoById,
    getColMapFromScenarioInfo,
    getColDictMapFromScenarioInfo,
    transformColInfo,
    transformServerData,
    getColLabel,
    getColKey
}