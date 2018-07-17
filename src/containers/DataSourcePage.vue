<template>
    <el-container id="data-source-page">
        <el-aside width="220px" class="aside-wrap">
            <el-card style="width: 100%">
                <div style="padding: 5px 18px;">
                    <i-tip prefixtext='分析场景' :tip="tip"></i-tip>
                </div>
                <i-tree :selectedKey="getFirstSlideNode"
                        :lowHeight="false"
                        @onNodeClick="onSlideNodeClick"></i-tree>
            </el-card>
        </el-aside>
        <el-main>
            <el-card>
                <i-panel
                        @onTreeDialogSuccess="onTreeDialogSuccess"
                        @onTreeDialogNodeChange="onTreeDialogNodeChange"
                        @onDialogClose="onDialogClose"
                ></i-panel>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import iTree from "../components/DataSource/tree"
    import iChart from "../components/Common/emptychart"
    import iTip from "../components/Common/tips"
    import iPanel from "../components/DataSource/panel"
    import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                tip: '不同分析场景下包含不同字段，可根据需要选择相应的分析场景进行分析'
            }
        },
        components: {
            iTree,
            iChart,
            iTip,
            iPanel
        },
        mounted() {
            this.checkStatus()
        },
        methods: {
            checkStatus(loadingData) {
                switch (loadingData) {
                    case 'previewTableData':
                        if (this.previewTableData_status == 'error') {
                            this.$notify({type: 'warning', message: this.previewTableData_msg})
                        }
                        break

                    case 'columnInfoTableData':
                        if (this.columnInfoTableData_status == 'error') {
                            this.$notify({type: 'warning', message: this.columnInfoTableData_msg})
                        }
                        break

                    case 'dictTableData':
                        if (this.dictTableData_status == 'error') {
                            this.$notify({type: 'warning', message: this.dictTableData_msg})
                        }
                        break

                    case 'tableTree':
                        if (this.tableTree_status == 'error') {
                            this.$notify({type: 'warning', message: this.tableTree_msg})
                        }

                }
            },
            onSlideNodeClick(nodeData) {
                if (!nodeData || nodeData.hasOwnProperty('scenarios') || nodeData.id == this.currentSlideNode.id) {
                    return
                }
                if (nodeData.id != -1) {
                    this.setCurrentSlideNode(nodeData)
                    this.reloadAction(nodeData.id)
                }else{
                    this.setCurrentSlideNode(nodeData)
                    this.columnInfoTableDataRefresh({})
                    this.previewTableDataRefresh([])
                }
            },
            onTreeDialogSuccess(nodeData) {
                this.$router.push({name: 'chart-config', query: {scenario_id: nodeData.id}})
            },
            onTreeDialogNodeChange(nodeData) {
            },
            onDialogClose() {
            },
            ...mapActions('dataSource', [
                'columnInfoTableDataAction',
                'reloadAction'
            ]),
            ...mapMutations('dataSource', [
                'setCurrentSlideNode',
                'columnInfoTableDataRefresh',
                'previewTableDataRefresh'
            ])
        },
        watch: {
            previewTableData_status() {
                this.checkStatus('previewTableData')
            },
            columnInfoTableData_status() {
                this.checkStatus('columnInfoTableData')
            },
            dictTableData_status() {
                this.checkStatus('dictTableData')
            },
            tableTree_status() {
                this.checkStatus('tableTree')
            },
        },
        computed: {
            ...mapState('dataSource', [
                'previewTableData_status',
                'previewTableData_msg',
                'columnInfoTableData_status',
                'columnInfoTableData_msg',
                'dictTableData_status',
                'dictTableData_msg',
                'tableTree_status',
                'tableTree_msg',
                'currentSlideNode'
            ]),
            ...mapGetters('dataSource', [
                'getFirstSlideNode'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .el-container {
        .el-aside {
            height: 434px;
            overflow: inherit;
            .el-card {
                :global(.el-card__body) {
                    padding: 10px 0 10px 0;
                    width: 220px;
                }
            }
        }
        .el-main {
            width: 1270px;
            height: 100%;
            padding: 0 0 0 4px;
            .el-card {
                height: 550px;
            }
        }
    }
</style>