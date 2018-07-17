<template>
    <!--字段库-字段信息页面table-->
    <el-table class="datasource-column-info-table"
              :data="tableData.column_infos"
              height="430"
              border
              :empty-text="tableEmptyText"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
              v-loading="datasource_column_info_table_loading"
              element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
              element-loading-spinner="el-icon-loading"
              element-loading-background="white">
        <el-table-column v-if="tableData.column_infos"
                type="index"
                width="240"
                align="center"
                >
        </el-table-column>
        <template v-if="tableData.column_infos" v-for="(conf,index) in column_info_conf">
            <template v-if="datasource_column_info_table_custom_render.indexOf(conf.prop_conf)==-1">
                <el-table-column
                        :prop="conf.prop_conf"
                        :label="conf.label_conf"
                        show-overflow-tooltip
                        align="center"
                        :current-row-key="index">
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column
                        :label="conf.label_conf"
                        show-overflow-tooltip
                        align="center"
                        :current-row-key="index">
                    <template slot-scope="scope" v-if="scope.row.type!=null">
                        <span v-if="scope.row.type=='DIMENSION'">维度</span>
                        <span v-else>指标</span>
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
            this.columnInfoTableData_status == 'success' ?
                this.datasource_column_info_table_loading = false :
                this.tableData ? this.datasource_column_info_table_loading = false : this.datasource_column_info_table_loading = true
        },
        data() {
            return {
                datasource_column_info_table_custom_render: ['type'],
                datasource_column_info_table_loading: null,
                ...tableStyle,
                ...config
            }
        },
        watch: {
            columnInfoTableData_status(val) {
                val == 'success' ? this.datasource_column_info_table_loading = false : this.datasource_column_info_table_loading = true
            }
        },
        computed: {
            ...mapState('dataSource', [
                'columnInfoTableData_status'
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