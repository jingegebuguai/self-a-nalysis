<template>
    <el-container id="scene-config-page">
        <el-main>
            <el-card>
                <div class="include-business">
                    <el-select v-model="currentBiz" placeholder="请选择业务线" size="small">
                        <el-option
                                v-for="item in bizLines"
                                :key="item.business_id"
                                :label="item.business_name"
                                :value="item.business_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="scene-main">
                    <h4 class="scene-title">分析场景列表</h4>
                    <el-button type="text" class="scene-title-right" @click="addScene">
                        <i class="iconfont icon-plus"></i> 新增分析场景
                    </el-button>
                </div>
                <scene-list-table
                        :sceneList="scene_list"
                        @previewClick="preview"
                        @offlineClick="offline"
                        @editClick="edit"
                ></scene-list-table>
            </el-card>
        </el-main>
        <step-dialog
                @onDialogClose="onDialogClose"
                @onStepDialogSuccess="onStepDialogSuccess"
                :sceneData="sceneData"
        ></step-dialog>
        <preview-form-dialog
                :previewData="scenariosPreviewData"
                refer="edit"
                :dialogVisible="dialogVisible"
                @onPreviewDataDialogClose="onPreviewDataDialogClose"
        ></preview-form-dialog>
    </el-container>
</template>
<script>
    import StepDialog from '../components/ScenariosConfig/dialog/StepDialog'
    import PreviewFormDialog from '../components/ScenariosConfig/dialog/PreviewDataDialog'
    import SceneListTable from '../components/ScenariosConfig/table/SceneListTable'
    import moment from 'moment'
    import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                scene_list: [],
                sceneData: {},
                dialogVisible: false
            }
        },
        methods: {
            addScene() {
                if (this.currentBizLine == '' || this.currentBizLine == null) {
                    this.$notify({type: 'warning', message: '获取业务线信息失败'})
                } else {
                    this.sceneData = {
                        business_id: this.getBizNameByKey(this.currentBizLine).business_id,
                        business_name: this.getBizNameByKey(this.currentBizLine).business_name,
                        refer: 'new'
                    }
                    this.showDialog('step')
                }
            },
            onDialogClose() {
            },
            onPreviewDataDialogClose() {
                this.dialogVisible = false
            },
            onStepDialogSuccess() {
            },
            preview(nodeData) {
                this.dialogVisible = true
                this.getScenariosPreviewData(nodeData.id)
            },
            offline(nodeData) {
                if (nodeData.status == 0) {
                    this.$notify({type: 'warning', message: '该场景已经处于下线状态！'})
                } else {
                    this.$confirm('确定要下线 \'' + nodeData.name + '\' 吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let param = {}
                        param.create_time = nodeData.create_time
                        param.creator = nodeData.creator
                        param.last_update_time = nodeData.last_update_time
                        param.last_publish_time = nodeData.last_publish_time
                        param.name = null
                        param.memo = null
                        param.business_id = null
                        param.business_name = null
                        param.datasource_id = null
                        param.column_infos = null
                        param.status = 0
                        this.updateScenariosStatusById({scenariosId: nodeData.id, param: param})
                    }).catch(() => {
                    })
                }
            },
            edit(nodeData) {
                nodeData['refer'] = 'edit'
                this.getSelectDataSourceMetaData(nodeData.datasource_id)
                this.getScenariosMetaData(nodeData.id)
                this.sceneData = nodeData
                this.showDialog('step')
            },
            ...mapMutations('dataSource', [
                'hideDialog',
                'showDialog',
            ]),
            ...mapMutations('sceneConfig', [
                'updateCurrentBiz',
                'updateScenariosStatusInMetaData'
            ]),
            ...mapActions('sceneConfig', [
                'getSelectDataSourceMetaData',
                'getSuggestionMapByBizKey',
                'getScenariosMetaData',
                'updateScenariosStatusById',
                'getScenariosPreviewData'
            ])
        },
        computed: {
            currentBiz: {
                get() {
                    if (this.currentBizLine != '' && this.currentBizLine != null && typeof this.currentBizLine != 'undefined') {
                        this.scene_list = this.bizScenesMap[this.currentBizLine]
                        return this.currentBizLine
                    }
                    return null
                },
                set(value) {
                    this.updateCurrentBiz(value)
                    this.getSuggestionMapByBizKey(this.currentBizLine)
                    this.scene_list = this.bizScenesMap[value]
                }
            },
            ...mapState('sceneConfig', [
                'bizLines',
                'bizScenesMap',
                'currentBizLine',
                'scenariosPreviewData',
                'scenariosMetaData',
                'onlineScenarios_status',
                'onlineScenarios_msg',
                'scenariosPreviewData_status'
            ]),
            ...mapGetters('sceneConfig', [
                'getBizNameByKey'
            ])
        },
        watch: {
            onlineScenarios_msg(val) {
                if (typeof val != 'undefined') {
                    this.$notify({type: val.indexOf('成功') != -1 ? 'success' : 'warning', message: val})
                }
            },
            scenariosPreviewData_status(status) {
                if (status == 'error') {
                    this.$notify({type: 'warning', message: '获取分析场景预览信息出错'})
                }
            }
        },
        components: {
            StepDialog, SceneListTable, PreviewFormDialog
        }
    }
</script>
<style lang="scss" scoped>
    .el-container {
        height: 550px;

        .el-main {
            height: 550px;
            padding: 0 0 0 0px;
        }
    }

    .scene-main {
        margin-top: 30px;
        margin-left: 3px;

        .scene-title {
            display: inline-block;
        }

        .scene-title-right {
            display: inline-block;
            margin-right: 10px;
            float: right;
        }
    }
</style>