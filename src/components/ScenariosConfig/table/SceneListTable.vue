<template>
    <!--分析场景配置-分析场景列表table-->
    <el-table class="scene-list-table"
              :data="sceneList"
              height="450"
              border
              :empty-text="tableEmptyText"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
    >
        <template v-if="sceneList" v-for="(conf,index) in scene_list_conf">
            <template v-if="scene_list_table_custom_render.indexOf(conf.prop_conf)==-1">
                <el-table-column
                        :prop="conf.prop_conf"
                        :label="conf.label_conf"
                        show-overflow-tooltip
                        align="center"
                        min-width="120"
                ></el-table-column>
            </template>
            <template v-else>
                <el-table-column
                        :prop="conf.prop_conf"
                        :label="conf.label_conf"
                        show-overflow-tooltip
                        align="center"
                        min-width="120"
                >
                    <template slot-scope="scope">
                        <template v-if="conf.prop_conf=='status'">
                            <span v-if="scope.row.status==1">使用中</span>
                            <span v-else-if="scope.row.status==0">未上线</span>
                            <span v-else>未知</span>
                        </template>
                        <template v-else-if="conf.prop_conf=='operator'">
                            <div class="button-container">
                                <el-button type="text" class="icon-scene" size="mini"
                                           @click="$emit('previewClick',scope.row)">
                                    <i class="iconfont icon-eye" title="预览"></i>
                                </el-button>
                                <el-button type="text" class="icon-scene" size="mini"
                                           @click="$emit('editClick',scope.row)">
                                    <i class="iconfont icon-edit-scene" title="编辑"></i>
                                </el-button>
                                <el-button type="text" class="icon-scene" size="mini"
                                           @click="$emit('offlineClick',scope.row)" :disabled="scope.row.status==0">
                                    <i class="iconfont icon-forbidden" :title="scope.row.status==0 ?'未上线':'下线'"></i>
                                </el-button>
                            </div>
                        </template>
                    </template>
                </el-table-column>
            </template>
            </el-table-column>
        </template>
    </el-table>
</template>

<script>
    import {tableStyle} from '~/components/Common/table/style'
    import {config} from '~/components/Common/table/config'

    export default {
        data() {
            return {
                scene_list_table_custom_render: ['status', 'operator'],
                ...tableStyle,
                ...config
            }
        },
        props: {
            sceneList: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>
    .button-container {
        text-align: center;
    }
</style>