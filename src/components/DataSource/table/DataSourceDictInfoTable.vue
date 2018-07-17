<template>
    <!--字段库-字典信息页面table（废弃）-->
    <el-table class="datasource-dict-info-table"
              :data="tableData.info"
              height="450"
              border
              :empty-text="tableEmptyText"
              :header-cell-style="tableHeaderCellStyle"
              :cell-style="tableCellStyle"
              width="300"
    >
        <template v-for="(conf,index) in dict_info_conf">
            <el-table-column
                    :prop="conf.prop_conf"
                    :label="conf.label_conf"
                    show-overflow-tooltip
                    :current-row-key="index">
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
                ...tableStyle,
                ...config
            }
        },
        props: {
            tableData: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style></style>