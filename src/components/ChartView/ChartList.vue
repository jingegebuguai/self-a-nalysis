<template>
    <div id="my-chart-list" class="chart-list">
        <div class="chart-name-search">
            <el-input placeholder="图表名称" v-model="filterText" size="mini" suffix-icon="el-icon-search"></el-input>
        </div>
        <el-scrollbar>
            <el-menu :default-active="''+chartNowId"
                     class="col-list"
                     @open="handleOpen"
                     @close="handleClose">
                <el-menu-item v-for="col in chartList" :key="col.id" @click="setCurrentId(col.id)"
                              :index="''+col.id" :class="{'el-menu-item':true,'is-active':col.id === chartNowId}">
                    <div slot="title" class="col-item-content">
                        <div class="col-item-content-title">
                            <i class="iconfont icon-barlinechart"></i>
                            {{col.name}}
                        </div>
                        <div class="col-item-content-operation">
                            <el-button type="text" size="mini" @click.stop="editThisChart(col.id)">
                                <i class="iconfont icon-edit"></i>
                            </el-button>
                            <el-button type="text" size="mini" @click.stop="deleteThisChart(col.id)">
                                <i class="iconfont icon-delete"></i>
                            </el-button>
                        </div>
                    </div>
                </el-menu-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from '~/axios'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import moment from 'moment'
    import ElButton from "element-ui/packages/button/src/button"

    export default {
        components: {ElButton},
        data() {
            return {
                filterText: '',
                chartList: []
            }
        },
        mounted() {
            this.getChartList()
        },
        methods: {
            ...mapActions('chartView', ['queryChart']),
            getChartList() {
                if (this.status === 'success' || this.status === 'empty') {
                    this.chartList = this.filterChart(this.filterText)
                    return
                }
                if (this.status === 'error') {
                    // this.$notify({type: 'warning', message: this.msg})
                }
            },
            ...mapMutations('chartView', ["setQueryChartId"]),
            ...mapMutations('chartView/chartList', ["setChartNowId"]),
            editThisChart(chart_id) {
                this.$router.push({
                    name: 'chart-config',
                    query: {chart_id}
                })
            },
            deleteThisChart: async function (chart_id) {
                try {
                    await this.$confirm('是否要删除该图表?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (error) {
                    return
                }

                let response
                try {
                    response = await axios.delete(`api/charts/${chart_id}`)
                } catch (error) {
                    console.warn('删除失败', error)
                    this.$message({
                        type: 'warning',
                        message: '删除失败!'
                    })
                }
                if (!response.data || !!response.data.errors) {
                    this.$message({
                        type: 'warning',
                        message: '删除失败!'
                    })
                    return
                }
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.$store.dispatch('chartView/chartList/getChartList')
            },
            setCurrentId(id) {
                this.setChartNowId(id)
                this.queryChart({
                    chart_id: id,
                })
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath)
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath)
            }
        },
        watch: {
            filterText() {
                this.getChartList()
            },
            status() {
                this.getChartList()
            }
        },
        computed: {
            ...mapState('chartView/chartList', ['status', 'msg', 'chartNowId']),
            ...mapGetters('chartView/chartList', ['filterChart']),
        }
    }
</script>

<style lang="scss" scoped>
    .chart-list {
        .chart-name-search {
            padding: 5px 18px;
        }
        .el-scrollbar {
            height: 400px;
            margin-top: 10px;
            border-top: 1px solid #e6ebf5;
            .el-menu.col-list {
                border-right: 0;
                .el-menu-item {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    &.is-active {
                        border-left: 1px solid #36ab00;
                        background: #F2F6FC;
                        font-weight: 900;
                        color: #86bb6e;
                    }
                    .col-item-content {
                        display: flex;
                        justify-content: space-between;
                        .col-item-content-title {
                            width: 150px;
                        }
                        .col-item-content-operation {
                            display: none;
                            .el-button {
                                padding: 0;
                            }
                        }
                        &:hover {
                            .col-item-content-operation {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }

</style>