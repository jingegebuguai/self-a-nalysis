<template>
    <div class="chart-view" v-loading="chartStatus === 'loading'"
         element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
         element-loading-spinner="el-icon-loading"
         element-loading-background="white">
        <div class="date-range-tip" v-if="!!dateRange">
            <el-tag type="success" size="small">{{dateRange}}</el-tag>
        </div>
        <template v-if="chartStatus === 'success'">

            <chart-show-table v-if="'table'===chartNowInfo.chart_type"
                              :chartColList="chartColList"
                              :chartColData="chartColData"
                              :chartDataLength="chartNowDataLength"
                              :responsePageInfo="responsePageInfo"
                              @page_config_changed="queryPageChart"
                              @order_config_changed="onSortChange">
            </chart-show-table>

            <chart-show-line v-else-if="'line_chart'===chartNowInfo.chart_type || 'bar_chart'===chartNowInfo.chart_type"
                             :chartType="chartNowInfo.chart_type"
                             :chartColList="chartColList"
                             :chartColData="chartColData"
                             :chartNowPageInfo="responsePageInfo">
            </chart-show-line>

            <div v-else>图表类型出错</div>
        </template>
        <div v-else-if="chartStatus === 'loading'"></div>
        <chart-show-text v-else :msg="chartMsg"></chart-show-text>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import moment from 'moment'
    import chartShowTable from '~/components/ChartView/ChartShow/ChartShowTable'
    import chartShowLine from '~/components/ChartView/ChartShow/ChartShowLine'
    import chartShowText from '~/components/ChartView/ChartShow/ChartShowText'

    const relativeDateConfig = {
        "now-1d/d": "昨天",
        "now-7d/d": "最近一周",
        "now-1M/d": "最近一个月",
        "now-3M/d": "最近三个月",
        "now-6M/d": "最近半年",
        "now-12M/d": "最近一年"
    }

    export default {
        components: {chartShowTable, chartShowLine, chartShowText},
        data() {
            return {
                columnList: [],
                dataList: [],
            }
        },
        methods: {
            queryPageChart(requestPageConfig) {
                this.$store.commit('chartView/chartNowData/setRequestPageInfo', requestPageConfig, {root: true})
                this.$store.dispatch("chartView/previewChart", {query_type: 'page'}, {root: true})
            },
            onSortChange(orderConf) {
                console.info("orderConf==>", JSON.stringify(orderConf))
                this.$store.commit('chartView/chartNowData/updateColOrder', orderConf, {root: true})
                this.$store.dispatch("chartView/previewChart", {query_type: 'page'}, {root: true})
            }
        },
        computed: {
            ...mapState('chartView/chartNowData', {
                chartStatus: 'status',
                msg: 'msg',
                chartNowInfo: 'chartNowInfo',
                chartColList: 'chartColList',
                chartColData: 'chartColData',
                responsePageInfo: 'responsePageInfo',
                chartNowDataLength: 'chartNowDataLength',
            }),
            ...mapGetters('dataSource', ['getDictData']),
            chartMsg() {
                if (this.chartStatus === 'error') {
                    return `当前图表无数据！`
                }
                return this.msg
            },
            dateRange() {
                let filterStr = "日期范围："
                if (!this.chartNowInfo) {
                    return ""
                }
                const config = this.chartNowInfo.config
                if (config.data_filters && config.data_filters.length) {

                    //TODO
                    const dateFilterConf = config.data_filters.filter(o => o.is_calendar)[0]

                    if (!dateFilterConf) {
                        return ""
                    }

                    if (!dateFilterConf.filter_detail_infos || dateFilterConf.filter_detail_infos.length === 0) {
                        console.error("filters filter_detail_infos 设置出错！")
                        return
                    }

                    const tmpItem = dateFilterConf.filter_detail_infos[0]
                    if (tmpItem.filter_type === 'relative_date') {
                        return filterStr + relativeDateConfig[tmpItem.values[0]]
                    } else {
                        return filterStr + tmpItem.values[0] + ' 至 ' + tmpItem.values[1]
                    }

                }
                return ""
            }
        }
    }
</script>

<style lang="scss" scoped>
    .date-range-tip {
        margin-bottom: 10px;
    }

    .chart-view {
        min-height: 395px;
    }
</style>