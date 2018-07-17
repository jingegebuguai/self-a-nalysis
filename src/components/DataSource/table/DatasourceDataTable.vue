<template>
    <!--字段库-预览数据table-->
    <el-table class="datasource-data-table"
              :data="columnInfo"
              height="430"
              border
              :empty-text="tableEmptyText"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
              v-loading="datasource_data_table_loading"
              element-loading-text="加载中，请稍等 (╭￣3￣)╭♡"
              element-loading-spinner="el-icon-loading"
              element-loading-background="white">
        <template v-if="tableData.column_infos" v-for="(data,index) in tableData.column_infos">
            <el-table-column
                    :label="data.alias"
                    :prop="data.col_name.replace(/(\[|\])/g,'')"
                    show-overflow-tooltip
                    :align="data.type=='DIMENSION'? 'left':'right'"
                    :header-align="data.type=='DIMENSION'? 'left':'right'"
                    min-width="120"
                    :current-row-key="index">
            </el-table-column>
        </template>
    </el-table>
</template>

<script>
    import {tableStyle} from '~/components/Common/table/style'
    import {config} from '~/components/Common/table/config'
    import {mapState} from 'vuex'

    export default {
        mounted() {
            this.previewTableData_status == 'success' ?
                this.datasource_data_table_loading = false :
                this.tableData ? this.datasource_data_table_loading = false : this.datasource_data_table_loading = true
            this.getNewPreviewData(this.columnInfo)
        },
        data() {
            return {
                datasource_data_table_loading: null,
                ...tableStyle,
                ...config
            }
        },
        watch: {
            previewTableData_status(val) {
                val == 'success' ? this.datasource_data_table_loading = false : this.datasource_data_table_loading = true
            },
            columnInfo(val) {
                this.getNewPreviewData(val)
            }
        },
        methods: {
            getNewPreviewData(columnInfo) {
                columnInfo.map(o => {
                    for (let field in o) {
                        if (field.indexOf('[') != -1) {
                            let data = o[field]
                            let newField = field.replace(/(\[|\])/g, '')
                            o[newField] = data
                            delete o[field]
                        }
                    }
                })
            }
        },
        computed: {
            ...mapState('dataSource', [
                'previewTableData_status'
            ])
        },
        props: {
            tableData: {
                type: Object,
                required: true
            },
            columnInfo: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style></style>