<template>
    <div class="chart-now">
        <template v-if="chartListStatus==='empty'">
            <empty-chart></empty-chart>
        </template>
        <template v-if="status==='error'">
            <chart-show-text msg="图表信息获取错误！"></chart-show-text>
        </template>
        <template v-else>
            <div class="page-header" v-if="status === 'success'">
                <div class="page-title">
                    <i class="iconfont icon-barlinechart"></i>
                    {{chartInfoName}}
                </div>
                <div class="chart-config-link">
                    <el-button type="text" @click="editThisChart">
                        <i class="iconfont icon-edit"></i> 编辑图表
                    </el-button>
                </div>
            </div>
            <div class="page-content">
                <div class="chart-now-info">
                    <span v-for="o in chartUpdateTime">
                        {{o}} &nbsp;&nbsp;
                    </span>
                </div>
                <chart-show></chart-show>
            </div>
        </template>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions} from 'vuex'
    import moment from 'moment'
    import chartList from '~/components/ChartView/ChartList'
    import chartShow from '~/components/ChartView/ChartShow/index'
    import emptyChart from '~/components/Common/emptychart'
    import chartShowText from '~/components/ChartView/ChartShow/ChartShowText'

    export default {
        data() {
            return {}
        },
        components: {chartList, chartShow, emptyChart, chartShowText},
        methods: {
            editThisChart() {
                this.$router.push({
                    name: 'chart-config',
                    query: {chart_id: this.queryChartFlag.queryChartId}
                })
            },
        },
        computed: {
            ...mapState('chartView', ['queryChartFlag']),
            ...mapState('chartView/chartList', {
                chartList: 'chartList',
                chartListStatus: 'status'
            }),
            ...mapState('chartView/chartNowData', {
                status: 'status',
                msg: 'msg',
                chartNowInfo: 'chartNowInfo',
            }),
            chartInfoName: function () {
                if (this.status !== 'success') {
                    return '-'
                }
                return this.chartNowInfo.name
            },
            chartUpdateTime: function () {
                if (this.status !== 'success') {
                    return []
                }
                const chartTime = []
                if (this.chartNowInfo.create_time) {
                    chartTime.push(`创建时间：${moment(this.chartNowInfo.create_time).format("YYYY-MM-DD HH:mm:ss")}`)
                }
                if (this.chartNowInfo.last_update_time) {
                    chartTime.push(`最后编辑时间：${moment(this.chartNowInfo.last_update_time).format("YYYY-MM-DD HH:mm:ss")}`)
                }
                return chartTime
            },
        },
    }
</script>

<style lang="scss" scoped>
    .chart-now {
        .page-header {
            padding: 5px 18px;
            display: flex;
            justify-content: space-between;
            .page-title {
                font-size: 20px;
                font-weight: normal;
                color: #699f00;
                .iconfont {
                    font-size: 20px;
                }
            }
            .chart-config-link {
                text-align: right;
                .el-button--text {
                    font-size: 14px;
                    padding: 0;
                    margin: 0;
                    .iconfont {
                        font-size: 14px;
                    }
                }
            }
        }
        .page-content {
            padding: 2px 18px;
            .chart-now-info {
                padding-bottom: 10px;
                font-size: 12px;
            }
            .chart-show {
                min-height: 431px;
            }
        }
    }
</style>