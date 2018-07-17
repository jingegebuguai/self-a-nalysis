<template>
    <div class="i-panel">
        <template v-if="!getPreviewTableData &&!getColumnInfoTableData">
            <el-card class="no-tables">
                <h3 class="no-tables-fonts">请先申请字段库以开始使用可视化分析！</h3>
            </el-card>
        </template>
        <template v-else>
            <panel-nav :tableData="getPreviewTableData" @new_index="showDialogMethod('custom_index')"></panel-nav>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="字段信息" name="column_info">
                    <datasource-column-info-table
                            :tableData="getColumnInfoTableData"
                            v-if="activeName=='column_info'"
                    >
                    </datasource-column-info-table>
                </el-tab-pane>
                <el-tab-pane label="数据预览" name="data_preview">
                    <span class="default-count"><h6 style="font-style: italic; color: #b0b0b0">默认显示随机50条数据</h6></span>
                    <datasource-data-table
                            v-if="activeName=='data_preview'"
                            :tableData="getColumnInfoTableData"
                            :columnInfo="getPreviewTableData"
                    ></datasource-data-table>
                </el-tab-pane>
            </el-tabs>
            <!--<tree-dialog
                    @onTreeDialogSuccess="onTreeDialogSuccess"
                    @onDialogClose="onDialogClose"
                    @onTreeDialogNodeChange="onTreeDialogNodeChange"
                    :currentNodeId="currentSlideNode.id">
            </tree-dialog>-->

            <table-dialog
                    @onDialogClose="onDialogClose"
            ></table-dialog>
        </template>
    </div>

</template>

<script>
    import PanelNav from './PanelNav.vue'
    import DatasourceColumnInfoTable from '../table/DatasourceColumnInfoTable'
    import DatasourceDataTable from '../table/DatasourceDataTable'
    import TreeDialog from '../../Common/dialog/TreeDialog'
    import TableDialog from '../dialog/TableDialog'
    import {mapGetters, mapMutations, mapState} from 'vuex'

    export default {
        data() {
            return {
                activeName: 'column_info',
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event)
            },
            onDictClick(column_info) {
                this.showDialogMethod('table')
                let currentDictId = column_info.dictionary_id
                let currentDictData = this.getDictTableData.data.filter(o => o.dic_id === currentDictId)
                if (currentDictData.length !== 1) {
                    console.warn("获取当前左侧数据源出错！")
                    return
                }
                this.setCurrentDictData(currentDictData[0])
            },
            onTreeDialogSuccess(nodeData) {
                this.hideDialog()
                this.$emit('onTreeDialogSuccess', nodeData)
            },
            onTreeDialogNodeChange(nodeData) {
                this.$emit('onTreeDialogNodeChange', nodeData)
            },
            onDialogClose() {
                this.$emit('onDialogClose')
            },
            ...mapMutations('dataSource', [
                'showDialog',
                'setCurrentDictData',
                'hideDialog'
            ]),
            showDialogMethod(type) {
                this.showDialog(type)
            }
        },
        components: {
            PanelNav, TreeDialog, TableDialog, DatasourceColumnInfoTable, DatasourceDataTable
        },
        watch: {
            currentSlideNode(val) {
                this.activeName = 'column_info'
            }
        },
        computed: {
            ...mapGetters('dataSource', [
                'getPreviewTableData',
                'getDictTableData',
                'getColumnInfoTableData',
            ]),
            ...mapState('dataSource', [
                'currentSlideNode'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .i-panel {
        min-height: 450px;
    }

    .default-count {
        float: right;
        margin-bottom: 5px;
        margin-right: 5px;
    }

    .no-tables {
        height: 540px;
        text-align: center;
        margin-top: 30px;
    }

    .no-tables-fonts {
        margin-top: 15%;
    }
</style>