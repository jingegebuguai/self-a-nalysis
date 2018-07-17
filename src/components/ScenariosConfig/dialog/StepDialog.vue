<template>
    <el-dialog
            title="新建分析场景"
            :visible="dialogVisible && dialogType=='step'"
            width="75%"
            :before-close="onStepDialogClose"
            :close-on-press-escape="false"
            :close-on-click-modal="false"

    >
        <el-container>
            <el-header>
                <el-steps :active="active" align-center finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="选择数据源表"></el-step>
                    <el-step title="分析场景字段配置"></el-step>
                    <el-step title="预览"></el-step>
                </el-steps>
            </el-header>
            <hr width="100%" class="line" color="#eee" align="center"/>
            <el-main>
                <el-form :model="newIndexForm" :rules="rules" ref="newIndexFormRef" label-width="120px"
                         label-position="right"
                         size="small" class="newIndexForm">

                    <template v-if="active==0">
                        <el-form-item label="业务线:" prop="business_name">
                            <el-input v-model="newIndexForm.business_name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="分析场景名称:" prop="name">
                            <el-input v-model="newIndexForm.name" placeholder="请输入分析场景名称"></el-input>
                        </el-form-item>
                        <el-form-item label="分析场景备注:" prop="memo">
                            <el-input v-model="newIndexForm.memo" placeholder="请输入分析场景备注"></el-input>
                        </el-form-item>
                    </template>

                    <template v-if="active==1">
                        <el-form-item label="数据源表选择:" prop="table_name">
                            <el-select
                                    class="select-class"
                                    v-model="currentTableInfo" filterable
                                    value-key="name"
                                    :placeholder="sceneData.refer=='new' ? '请选择数据源表': selectedDataSourceMetaData.name"
                                    :disabled="sceneData.refer=='new' ? false: true"
                                    @change="handleSelectTable"
                            >
                                <el-option
                                        v-for="item in getTableNamesByBizKey(currentBizLine)"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item">
                                </el-option>
                            </el-select>


                        </el-form-item>
                        <div class="table-info" v-show="selectedDataSourceMetaData.hasOwnProperty('id')">
                            <el-row :gutter="0">
                                <el-col :span="2">
                                    <h4 class="span-class">表名：</h4>
                                </el-col>
                                <el-col :span="22">
                                    <span v-text="newIndexForm.table_name"></span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :span="2">
                                    <h4 class="span-class">表说明：</h4>
                                </el-col>
                                <el-col :span="22">
                                    <span>暂无</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="0">
                                <el-col :span="2">
                                    <h4 class="span-class">链接信息：</h4>
                                </el-col>
                                <el-col :span="22">
                                    <span>暂无</span>
                                </el-col>
                            </el-row>
                        </div>
                        <scene-select-datasource-table
                                :tableData="selectedDataSourceMetaData"
                                v-show="selectedDataSourceMetaData.hasOwnProperty('id')"
                        ></scene-select-datasource-table>
                    </template>

                    <template v-if="active==2">
                        <div class="step-main">
                            <el-input prefix-icon="el-icon-search" size="mini"
                                      class="input-style" placeholder="输入查找字段" @input="filterTable"></el-input>
                            <el-button type="text" class="step-title-right" @click="addIndex">
                                <i class="iconfont icon-plus"></i> 新增自定义指标
                            </el-button>
                        </div>

                        <scene-column-config-table
                                class="meta-table"
                                :tableData="tableData"
                                :refer="sceneData.refer"
                                @editRow="editRow"
                                @deleteRow="deleteRow">
                        </scene-column-config-table>
                        <custom-dialog
                                @onCustomDialogSuccess="onCustomDialogSuccess"
                                @onDialogClose="onCustomDialogClose"
                                :dialogVisible="newIndexDialogVisible"
                                :rowData="rowData">
                        </custom-dialog>
                    </template>

                    <template v-if="active==3">
                        <preview-form
                                :previewData="tableData"
                                :newIndexForm="newIndexForm"
                                :refer="sceneData.refer"
                        ></preview-form>
                    </template>
                </el-form>
            </el-main>
        </el-container>
        <hr width="100%" class="line" color="#eee" align="center"/>
        <span slot="footer" class="dialog-footer">
            <div v-if="active==2">
                <span class="warning-star">{{error}}</span>
            </div>
            <el-button v-if="active!=0" type="primary" @click="previous" size="mini">上一步</el-button>
            <el-button v-if="active &lt; 3" type="primary" @click="next" size="mini">下一步</el-button>
            <template v-else>
                <el-button type="primary" size="mini" @click="onStepDialogSuccess('save')">保存</el-button>
                <el-button type="primary" size="mini" @click="onStepDialogSuccess('online')">发布上线</el-button>
            </template>
        </span>
    </el-dialog>
</template>

<script>
    import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
    import CustomDialog from './CustomIndexDialog'
    import SceneSelectDatasourceTable from '../table/SceneSelectDatasourceTable'
    import SceneColumnConfigTable from '../table/SceneColumnConfigTable'
    import PreviewForm from '~/components/ScenariosConfig/table/PreviewForm'
    import moment from 'moment'

    export default {
        data() {
            return {
                active: 0,
                currentTableInfo: {},
                newIndexDialogVisible: false,
                tableData: {},
                suggestionStatus: 'init',
                calcRefer: '',
                newIndexForm: {},
                rowData: {},
                rowIndex: 0,
                rules: {
                    name: [{required: true, message: '分析场景名称不能为空', trigger: 'blur'}],
                    table_name: [{required: true, message: '请至少选择一个数据源表', trigger: 'blur'}],
                },
                error: ''
            }
        },
        methods: {
            previous() {
                if (--this.active < 0) this.active = 0
            },
            next() {
                this.submitPartForm('newIndexFormRef')
            },
            submitPartForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (this.active == 2) {
                        let column = this.sceneData.refer == 'new' ? this.tableData.columns : this.tableData.column_infos
                        let isDateFiledFlag = false
                        let isShowFieldFlag = false
                        for (let i = 0; i < column.length; i++) {
                            if (column[i].alias == '' && column[i].is_show) {
                                console.info("'" + column[i].col_name + "' 字段名称不能为空")
                                this.error = "'" + column[i].col_name + "' 字段名称不能为空"
                                return false
                            }
                            if (column[i].is_calendar) {
                                isDateFiledFlag = true
                            }
                            if (column[i].is_show) {
                                isShowFieldFlag = true
                            }
                        }
                        if (!isDateFiledFlag) {
                            console.info('请至少选择一个日期字段')
                            this.error = '请至少选择一个日期字段'
                            return false
                        }
                        else if (!isShowFieldFlag) {
                            console.info('请至少选择一个字段展示给用户')
                            this.error = '请至少选择一个字段展示给用户'
                            return false
                        }
                        else {
                            if (++this.active > 3) this.active = 3
                            this.error = ''
                            return true
                        }
                    } else {
                        if (valid) {
                            if (++this.active > 3) this.active = 3
                            this.error = ''
                            return true
                        } else {
                            return false
                        }
                    }
                });
            },
            handleSelectTable(item) {
                this.newIndexForm.tableName = item.name
                this.getSelectDataSourceMetaData(item.id)
            },
            addIndex() {
                this.calcRefer = 'new'
                this.rowData = {}
                this.newIndexDialogVisible = true
            },
            onStepDialogSuccess(status) {
                this.$confirm(status == 'save' ? '确认保存' : '确认直接发布上线', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delete this.newIndexForm.table_name
                    let param = {}
                    param = this.newIndexForm
                    status == 'save' ? param.status = 0 : param.status = 1
                    param.last_publish_time = moment().format('YYYY-MM-DD HH:mm:ss')
                    if (this.sceneData.refer == 'new') {
                        param.column_infos = this.tableData.columns
                        this.addNewScenarios(param)
                    } else {
                        param.column_infos = this.tableData.column_infos
                        this.updateScenarios({scenariosId: this.tableData.id, param: param, way: status})
                    }
                    this.active = 0
                    this.hideDialog()
                    this.clearSelectedDataSourceMetaData()
                    this.$emit('onStepDialogSuccess')
                }).catch(() => {
                })
            },
            onStepDialogClose() {
                this.active = 0
                this.hideDialog()
                this.clearSelectedDataSourceMetaData()
                this.$emit('onDialogClose')
            },
            onCustomDialogSuccess(column) {
                if (this.calcRefer == 'new') {
                    this.addMetaData({refer: this.sceneData.refer, row: column})
                } else {
                    this.editMetaData({refer: this.sceneData.refer, index: this.rowIndex, newRow: column})
                }
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.newIndexDialogVisible = false
            }
            ,
            onCustomDialogClose() {
                this.newIndexDialogVisible = false
            },
            editRow(row) {
                this.calcRefer = 'edit'
                this.rowData = row
                this.getRowIndex(row)
                this.newIndexDialogVisible = true
            },
            deleteRow(row) {
                this.$confirm('是否删除该自定义指标?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removeMetaData({refer: this.sceneData.refer, row: row})
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {

                });
                console.log('delete', row)
            },
            getTableData(data) {
                this.tableData = data
            },
            filterTable(keyword) {
                this.getTableData(this.getFilterColumn({entry: this.sceneData.refer, keyword: keyword}))
            },
            getRowIndex(row) {
                let columnData = []
                if (this.sceneData.refer == 'new') {
                    columnData = this.selectedDataSourceMetaData.columns
                } else {
                    columnData = this.scenariosMetaData.column_infos
                }
                for (let i = 0; i < columnData.length; i++) {
                    if (columnData[i].col_name == row.col_name) {
                        this.rowIndex = i
                        break
                    }
                }
            },
            initForm(val) {
                let param = {}
                if (this.sceneData.refer == 'new') {
                    param.id = null
                    param.name = ''
                    param.memo = ''
                    param.business_id = val.business_id
                    param.business_name = val.business_name
                    param.status = 1
                    param.datasource_id = 0
                    param.creator = this.userName
                    param.create_time = ''
                    param.last_publish_time = ''
                    param.last_update_time = ''
                    param.column_infos = null
                } else {
                    param.id = val.id
                    param.name = val.name
                    param.memo = val.memo
                    param.business_id = val.business_id
                    param.business_name = val.business_name
                    param.status = val.status
                    param.datasource_id = val.datasource_id
                    param.creator = val.creator
                    param.create_time = val.create_time
                    param.last_publish_time = val.last_publish_time
                    param.last_update_time = val.last_update_time
                    param.column_infos = null
                }
                this.newIndexForm = param
            },
            ...mapMutations('dataSource', [
                'hideDialog',
            ]),
            ...mapMutations('sceneConfig', [
                'addMetaData',
                'editMetaData',
                'removeMetaData',
                'clearSelectedDataSourceMetaData'
            ]),
            ...mapActions('sceneConfig', [
                'getSelectDataSourceMetaData',
                'addNewScenarios',
                'updateScenarios'
            ])
        },
        computed: {
            ...mapState('dataSource', [
                'dialogVisible',
                'dialogType',
                'userName'
            ]),
            ...mapState('sceneConfig', [
                'tableSuggestion',
                'selectedDataSourceMetaData',
                'selectedDataSourceMetaData_status',
                'scenariosMetaData',
                'scenariosMetaData_status',
                'tableSuggestion_status',
                'currentBizLine',
                'newScenarios_msg',
                'updateModifyScenarios_msg',
                'newScenarios_msg'
            ]),
            ...mapGetters('sceneConfig', [
                'getBizNameByKey',
                'getFilterColumn',
                'getTableNamesByBizKey'
            ]),
        }
        ,
        components: {
            CustomDialog, SceneSelectDatasourceTable, SceneColumnConfigTable, PreviewForm
        }
        ,
        props: ['sceneData'],
        watch:
            {
                sceneData(val) {
                    this.initForm(val)
                },
                selectedDataSourceMetaData_status: {
                    handler(val) {
                        if (val == 'success') {
                            if (this.sceneData.refer == 'new') {
                                this.tableData = this.selectedDataSourceMetaData
                            }
                            this.newIndexForm.table_name = this.selectedDataSourceMetaData.name
                            this.newIndexForm.datasource_id = this.selectedDataSourceMetaData.id
                        }
                        if (val == 'error') {
                            this.$notify({type: 'warning', message: '获取数据源元信息出错'})
                        }
                    },
                    deep: true
                },
                scenariosMetaData_status: {
                    handler(val) {
                        if (val == 'success') {
                            if (this.sceneData.refer == 'edit') {
                                this.tableData = this.scenariosMetaData
                            }
                        }
                    },
                    deep: true
                },
                tableSuggestion_status(val) {
                    if (val == 'success') {
                        this.suggestionStatus = 'success'
                    } else {
                        this.suggestionStatus = 'init'
                    }
                },
                updateModifyScenarios_msg(val) {
                    if (typeof val != 'undefined' && val != '') {
                        this.$notify({type: val.indexOf('成功') != -1 ? 'success' : 'warning', message: val})
                    }
                },
                newScenarios_msg(val) {
                    if (typeof val != 'undefined' && val != '') {
                        this.$notify({type: val.indexOf('成功') != -1 ? 'success' : 'warning', message: val})
                    }
                }
            }
    }
</script>
<style scoped>
    .newIndexForm {
        width: 100%;
        margin-top: 10px;
        padding-left: 35px;
        padding-right: 35px;
    }

    .table-info {
        margin-left: 30%;
        font-weight: bold;
        font-size: 12px;
    }

    .table-view {
        margin-top: 20px;
        height: 800px;
        border: 1px solid #000;
    }

    .step-main {
        margin-top: 20px;
    }

    .step-title-right {
        float: right;
    }

    .input-style {
        width: 180px;
    }

    .auto-complete {
        width: 100%;
    }

    .meta-table {
        width: 100%;
    }

    .step-title {
        margin-bottom: 10px;
    }

    .warning-star {
        float: left;
        color: #fa5555;
        margin-left: 3%;
    }

    .waring-text {
        float: left;
        font-size: 13px;
    }

    .span-class {
        float: left;
        margin-right: -45px;
    }

    .select-class {
        width: 100%;
    }

</style>
