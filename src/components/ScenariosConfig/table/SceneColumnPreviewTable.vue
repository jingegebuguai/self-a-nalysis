<template>
    <div>
        <!--分析场景预览-预览new-->
        <el-table
                v-if="refer=='preview_new'"
                class="scene-column-info-table"
                :data="afterFilterData.columns"
                height="300"
                border
                :empty-text="tableEmptyText"
                cell-class-name="middle-table"
                :header-cell-style="tableHeaderCellStyle"
                :cell-style="tableCellStyle">
            <el-table-column v-if="afterFilterData.columns"
                             align="center"
                             type="index"
            >
            </el-table-column>
            <template v-if="afterFilterData.columns" v-for="(conf,index) in scene_column_preview_conf">
                <template v-if="scene_column_preview_table_custom_render.indexOf(conf.prop_conf)==-1">
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            align="center"
                            show-overflow-tooltip
                            :current-row-key="index">
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            align="center"
                            show-overflow-tooltip
                            :current-row-key="index">
                        <template slot-scope="scope">
                            <template v-if="conf.prop_conf=='type'">
                                <span v-if="scope.row.type=='DIMENSION'">维度</span>
                                <span v-else>指标</span>
                            </template>

                            <template v-if="conf.prop_conf=='attribute'">
                                <span v-if="scope.row.attribute=='CUSTOMIZED'">自定义</span>
                                <span v-else>原生</span>
                            </template>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>

        <!--分析场景预览-预览edit-->
        <el-table
                v-if="refer=='preview_edit'"
                class="scene-column-info-table"
                :data="afterFilterData.column_infos"
                height="300"
                border
                :empty-text="tableEmptyText"
                cell-class-name="middle-table"
                :header-cell-style="tableHeaderCellStyle"
                :cell-style="tableCellStyle">
            <el-table-column v-if="afterFilterData.column_infos"
                             align="center"
                             type="index"
            >
            </el-table-column>
            <template v-if="afterFilterData.column_infos" v-for="(conf,index) in scene_column_preview_conf">
                <template v-if="scene_column_preview_table_custom_render.indexOf(conf.prop_conf)==-1">
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            align="center"
                            show-overflow-tooltip
                            :current-row-key="index">
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            align="center"
                            show-overflow-tooltip
                            :current-row-key="index">
                        <template slot-scope="scope">
                            <template v-if="conf.prop_conf=='type'">
                                <span v-if="scope.row.type=='DIMENSION'">维度</span>
                                <span v-else>指标</span>
                            </template>

                            <template v-if="conf.prop_conf=='attribute'">
                                <span v-if="scope.row.attribute=='CUSTOMIZED'">自定义</span>
                                <span v-else>原生</span>
                            </template>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>
    </div>
</template>

<script>
    import {tableStyle} from '~/components/Common/table/style'
    import {config} from '~/components/Common/table/config'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                scene_column_preview_table_custom_render: ['type', 'attribute'],
                afterFilterData: {},
                ...tableStyle,
                ...config,
            }
        },
        props: {
            tableData: {
                type: Object,
                required: false
            },
            refer: {
                type: String,
                required: true
            }
        },
        computed: {
            ...mapState('sceneConfig', [
                'selectedDataSourceMetaData_status',
                'scenariosMetaData_status'
            ])
        },
        mounted() {
            if (this.tableData.hasOwnProperty('id')) {    //本地数据
                this.filterData(this.tableData)
            }
        },
        watch: {
            tableData(val) {    //接口数据
                this.filterData(val)
            }
        },
        methods: {
            filterData(tableData) {
                let column = []
                let filterColumn = []
                this.refer === 'preview_new' ? column = tableData.columns : column = tableData.column_infos
                filterColumn = column.filter(o => {
                    return o.is_show
                })
                this.afterFilterData={}
                this.refer === 'preview_new' ? this.afterFilterData.columns = filterColumn : this.afterFilterData.column_infos = filterColumn
            }
        }
    }
</script>

<style scoped>
</style>