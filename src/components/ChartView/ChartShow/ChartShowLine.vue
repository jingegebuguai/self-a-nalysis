<template>
    <div>
        <figure>
            <echarts class="chart-show" :initOptions="barInit" :options="chartOption" theme="macarons"
                     auto-resize></echarts>
        </figure>
    </div>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import numeral from 'numeral'
    import ECharts from 'vue-echarts/components/ECharts.vue'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip'
    import 'echarts/theme/macarons'
    import {getOption} from './data/bar'
    import {showChartInfo} from '~/utils/echarts'

    export default {
        components: {
            echarts: ECharts
        },
        props: ['chartColList', 'chartColData', 'chartType', 'getDictData'],
        data() {
            return {
                barInit: getOption({
                    categories: [],
                    series: []
                }),
            }
        },
        mounted() {
        },
        methods: {},
        watch: {},
        computed: {
            isPropsValid() {
                if (!this.chartColList || this.chartColList.length <= 1) {
                    return false
                }
                if (!this.chartColData) {
                    console.warn("chartColData error")
                    return false
                }
                if (this.chartType !== 'line_chart' || this.chartType !== 'line_chart') {
                    console.warn("chartType error")
                    return false
                }
                return true
            },
            chartOption() {
                if (!this.isPropsValid) {
                    return {}
                }

                const showDims = this.chartColList.filter(col => col.cube_type === 'dimension')
                const showSplitDims = this.chartColList.filter(col => col.cube_type === 'splitdim')
                const showMeasures = this.chartColList.filter(col => col.cube_type === 'measure')

                if (showDims.length !== 1) {
                    throw "维度不唯一！"
                }
                const showDim = showDims[0]
                const xAxisName = showDim.col_label //x轴名称：日期
                const xAxisData = Array.from(new Set(this.chartColData.map(o => o[showDim.col_name].show_value))) //x轴数值：2018-01-01, 2018-01-02

                const tmpColDataMap = {}
                const that = this
                this.chartColData.forEach(iData => {
                    showMeasures.forEach(iMeasure => {
                        const seriesKey = showSplitDims.map(o => iData[o.col_name].show_value).join('-') + '[' + iMeasure.col_label + ']'
                        if (!tmpColDataMap.hasOwnProperty(seriesKey)) {
                            tmpColDataMap[seriesKey] = {}
                        }
                        tmpColDataMap[seriesKey][iData[showDim.col_name].show_value] = iData[iMeasure.col_name]
                    })
                })

                const series = Object.keys(tmpColDataMap).map(seriesName => ({
                    name: seriesName,
                    type: that.chartType === 'line_chart' ? 'line' : 'bar',
                    data: xAxisData.map(o => tmpColDataMap[seriesName][o])
                }))

                const tooltipFormatter = function (params) {
                    let tipStr = ''
                    if (params.length > 0) {
                        tipStr += params[0].name + '<br/>'//2018-01-01
                        tipStr += params.map(itemParam => {
                            if (!itemParam) {
                                return ""
                            }
                            return itemParam.seriesName + "：" + (!!itemParam.data ? itemParam.data.show_value : '-')
                        }).join("<br/>")//Android平台：20,234.32
                    }
                    return tipStr
                }
                return getOption({
                    xAxisName,
                    xAxisData,
                    series,
                    tooltipFormatter
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chart-show {
        height: 450px;
        width: 100%;
    }
</style>