<template>
    <div>
        <!--分析场景配置-字段配置table-新建分析场景入口-->
        <el-table
                v-if="refer=='new'"
                class="scene-column-info-table"
                :data="tableData.columns"
                height="450"
                border
                :empty-text="tableEmptyText"
                cell-class-name="middle-table"
                :header-cell-style="tableHeaderCellStyle"
                :cell-style="tableCellStyle"
                v-loading="scene_column_info_table_loading_new"
                element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
                element-loading-spinner="el-icon-loading"
                element-loading-background="white">
            <el-table-column v-if="tableData.columns"
                             align="center"
                             type="index"
            >
            </el-table-column>
            <template v-if="tableData.columns" v-for="(conf,index) in scene_column_conf">
                <template v-if="scene_column_info_table_custom_render_new.indexOf(conf.prop_conf)==-1">
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
                            :render-header="renderHeader"
                            align="center"
                            show-overflow-tooltip
                            :current-row-key="index">
                        <template slot-scope="scope">
                            <template v-if="conf.prop_conf=='alias'">
                                <el-input v-if="scope.row.attribute=='NATIVE'" size="mini"
                                          v-model="scope.row.alias"></el-input>
                                <span v-else v-text="scope.row.alias"></span>
                            </template>
                            <template v-else-if="conf.prop_conf=='type'">
                                <span v-if="scope.row.type=='DIMENSION'">维度</span>
                                <span v-else>指标</span>
                            </template>

                            <template v-else-if="conf.prop_conf=='memo'">
                                <el-input v-if="scope.row.attribute=='NATIVE'" size="mini"
                                          v-model="scope.row.memo"></el-input>
                                <span v-else v-text="scope.row.memo"></span>
                            </template>
                            <template v-else-if="conf.prop_conf=='attribute'">
                                <span v-if="scope.row.attribute=='CUSTOMIZED'">自定义</span>
                                <span v-else>原生</span>
                            </template>

                            <template v-else-if="conf.prop_conf=='operator'">
                                <div v-if="scope.row.attribute=='CUSTOMIZED'">
                                    <el-button type="text" class="icon-scene" size="mini"
                                               @click="$emit('editRow',scope.row)">
                                        <i class="iconfont icon-edit-scene" title="编辑"></i>
                                    </el-button>
                                    <el-button type="text" class="icon-scene" size="mini"
                                               @click="$emit('deleteRow',scope.row)">
                                        <i class="iconfont icon-delete" title="删除"></i>
                                    </el-button>
                                </div>
                                <span v-else>-</span>
                            </template>
                            <template v-else-if="conf.prop_conf=='is_calendar'">
                                <el-checkbox v-if="scope.row.type=='DIMENSION'"
                                             v-model="scope.row.is_calendar"></el-checkbox>
                                <span v-else>-</span>
                            </template>
                            <template v-else>
                                <el-checkbox v-model="scope.row.is_show"></el-checkbox>
                            </template>
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>

        <!--分析场景配置-字段配置table-编辑分析场景入口-->
        <el-table
                v-if="refer=='edit'"
                class="scene-column-info-table"
                :data="tableData.column_infos"
                height="450"
                border
                :empty-text="tableEmptyText"
                :header-cell-style="tableHeaderCellStyle"
                :cell-style="tableCellStyle"
                v-loading="scene_column_info_table_loading_edit"
                element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
                element-loading-spinner="el-icon-loading"
                element-loading-background="white">
            <el-table-column v-if="tableData"
                             align="center"
                             type="index"
            >
            </el-table-column>
            <template v-if="tableData.column_infos" v-for="(conf,index) in scene_column_conf">
                <template v-if="scene_column_info_table_custom_render_edit.indexOf(conf.prop_conf)==-1">
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            align="center"
                            show-overflow-tooltip
                            :key="index"
                            :current-row-key="index">
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                            :prop="conf.prop_conf"
                            :label="conf.label_conf"
                            :render-header="renderHeader"
                            align="center"
                            show-overflow-tooltip
                            :key="index"
                            :current-row-key="index">

                        <template slot-scope="scope">
                            <template v-if="conf.prop_conf=='alias'">
                                <el-input v-if="scope.row.attribute=='NATIVE'" size="mini"
                                          v-model="scope.row.alias"></el-input>
                                <span v-else v-text="scope.row.alias"></span>
                            </template>
                            <template v-else-if="conf.prop_conf=='type'">
                                <span v-if="scope.row.type=='DIMENSION'">维度</span>
                                <span v-else>指标</span>
                            </template>
                            <template v-else-if="conf.prop_conf=='memo'">
                                <el-input v-if="scope.row.attribute=='NATIVE'" size="mini"
                                          v-model="scope.row.memo"></el-input>
                                <span v-else v-text="scope.row.memo"></span>
                            </template>
                            <template v-else-if="conf.prop_conf=='attribute'">
                                <span v-if="scope.row.attribute=='CUSTOMIZED'">自定义</span>
                                <span v-else>原生</span>
                            </template>

                            <template v-else-if="conf.prop_conf=='operator'">
                                <div v-if="scope.row.attribute=='CUSTOMIZED'">
                                    <el-button type="text" class="icon-scene" size="mini"
                                               @click="$emit('editRow',scope.row)">
                                        <i class="iconfont icon-edit-scene" title="编辑"></i>
                                    </el-button>
                                    <el-button type="text" class="icon-scene" size="mini"
                                               @click="$emit('deleteRow',scope.row)">
                                        <i class="iconfont icon-delete" title="删除"></i>
                                    </el-button>
                                </div>
                                <span v-else>-</span>
                            </template>
                            <template v-else-if="conf.prop_conf=='is_calendar'">
                                <el-checkbox v-if="scope.row.type=='DIMENSION'"
                                             v-model="scope.row.is_calendar" ref="is_calendar"></el-checkbox>
                                <span v-else>-</span>
                            </template>
                            <template v-else>
                                <el-checkbox v-model="scope.row.is_show" ref="is_show"></el-checkbox>
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
                scene_column_info_table_custom_render_new: ['alias', 'type', 'memo', 'attribute', 'operator', 'is_calendar', 'is_show'],
                scene_column_info_table_custom_render_edit: ['alias', 'type', 'memo', 'attribute', 'operator', 'is_calendar', 'is_show'],
                scene_column_info_table_loading_new: null,
                scene_column_info_table_loading_edit: null,
                ...tableStyle,
                ...config,
            }
        },
        methods: {
            renderHeader: function (h, {column, $index}) {
                if (column.label === '字段名称'||column.label === '选择日期字段') {
                    return h('span', [
                        h('span', {
                            style: {color: '#FA5555'}
                        }, '* '),
                        h('span', {}, column.label)
                    ])
                } else if (column.label === '是否展示给用户') {
                    let columns = this.refer === 'new' ? this.tableData.columns : this.tableData.column_infos
                    let columnShow = []
                    columns.map(o => {
                        columnShow.push(o.is_show)
                    })

                    let showFlag = false
                    let showVal = false
                        if (new Set(columnShow).size === 1) {
                            showFlag = false
                            if (columnShow[0] === true) {
                                showVal = true
                            } else {
                                showVal = false
                            }
                        } else {
                            showFlag = true
                        }
                    return h('span', [
                        h('span', {
                            style: {color: '#FA5555'}
                        }, '*'),
                        h('el-checkbox', {
                            attrs: {
                                indeterminate:  showFlag,
                                value: showVal
                            },
                            on: {
                                change: function (value) {
                                        for (let i = 0; i < columns.length; i++) {
                                            columns[i].is_show = value
                                        }
                                }
                            }
                        }),
                        h('span', {}, column.label)
                    ],)
                }
                return h('span', {}, column.label)
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
        watch: {
            selectedDataSourceMetaData_status(val) {
                if (val == 'success') {
                    this.scene_column_info_table_loading_new = false
                }
            },
            scenariosMetaData_status(val) {
                if (val == 'success') {
                    this.scene_column_info_table_loading_edit = false
                }
            }
        }
    }
</script>

<style scoped>
    .alias-input {
        border: 1.2px solid #fa1a26;
        border-radius: 4px;
    }

    .alias-input:focus {
        border: 1.2px solid #fa1a26;
        border-radius: 4px;
    }
</style>