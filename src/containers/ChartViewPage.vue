<template>
    <el-container id="chart-view-page">
        <el-aside width="220px">
            <el-card>
                <page-header/>
                <chart-list/>
            </el-card>
        </el-aside>
        <el-main>
            <el-card>
                <chart-now/>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions} from 'vuex'
    import moment from 'moment'
    import pageHeader from '~/components/ChartView/PageHeader'
    import chartList from '~/components/ChartView/ChartList'
    import chartNow from '~/components/ChartView/ChartNow'

    export default {
        data() {
            return {}
        },
        components: {pageHeader, chartList, chartNow},
        mounted() {
            // console.log("初始获取'我的图表'")
            this.$store.dispatch('chartView/chartList/getChartList')
        },
        methods: {},
        watch: {},
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .el-container {
        .el-card {
            min-height: 550px;
            :global(.el-card__body) {
                padding: 10px 0 10px 0;
            }
        }
        .el-aside {
            width: 250px;
        }
        .el-main {
            height: 100%;
            padding: 0 0 0 4px;
            :global(.el-card__body) {
                height: 513px;
            }
        }
    }
</style>