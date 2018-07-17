<template>
    <!--分析场景配置第二步-选择数据源table-->
    <el-table class="scene-select-datasource-table"
              :data="tableData.columns"
              height="450"
              border
              :empty-text="tableEmptyText"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
              v-loading="scene_select_datasource_table_loading"
              element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
              element-loading-spinner="el-icon-loading"
              element-loading-background="white">
        <el-table-column v-if="tableData.columns"
                type="index"
        >
        </el-table-column>
        <template v-if="tableData.columns" v-for="(conf,index) in data_table_conf">
            <template v-if="scene_select_datasource_table_render.indexOf(conf.prop_conf)==-1">
                <el-table-column
                        :prop="conf.prop_conf"
                        :label="conf.label_conf"
                        align="center"
                        show-overflow-tooltip
                        header-align="center"
                        min-width="120"
                ></el-table-column>
            </template>
            <template v-else>
                <el-table-column
                        :prop="conf.prop_conf"
                        :label="conf.label_conf"
                        align="center"
                        show-overflow-tooltip
                        header-align="center"
                        min-width="120"
                >
                    <template slot-scope="scope">
                        <template v-if="conf.prop_conf=='type'">
                            <span v-if="scope.row.type=='DIMENSION'">维度</span>
                            <span v-else>指标</span>
                        </template>
                    </template>
                </el-table-column>
            </template>
        </template>
    </el-table>
</template>

<script>
    import {tableStyle} from '~/components/Common/table/style'
    import {config} from '~/components/Common/table/config'
    import {mapState} from 'vuex'

    export default {
        mounted() {
            if (this.selectedDataSourceMetaData_status == 'success') {
                this.scene_select_datasource_table_loading = false
            }
        },
        data() {
            return {
                scene_select_datasource_table_loading: null,
                scene_select_datasource_table_render: ['type'],
                ...tableStyle,
                ...config
            }
        },
        watch: {
            selectedDataSourceMetaData_status(val) {
                val == 'success' ? this.scene_select_datasource_table_loading = false : this.scene_select_datasource_table_loading = true
                if(val=='error'){
                    this.$notify({type: 'warning', message: '获取数据源表信息出错'})
                }
            }
        },
        computed: {
            ...mapState('sceneConfig', [
                'selectedDataSourceMetaData_status'
            ])
        },
        props: {
            tableData: {
                type: Object,
                required: false
            }
        }
    }
</script>

<style></style>