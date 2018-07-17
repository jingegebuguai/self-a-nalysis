<template>
    <div>
        <el-table :data="chartColData"
                  border
                  :empty-text="style.tableEmptyText"
                  :header-cell-style="style.tableHeaderCellStyle"
                  :cell-style="style.tableCellStyle"
                  @sort-change="onSortChange">
            <el-table-column v-for="col in columnList"
                             :prop="col.prop"
                             :label="col.label"
                             show-overflow-tooltip
                             :align="col.align"
                             :key="col.prop"
                             :sortable="false">
                <template slot-scope="scope">
                    <span :title="scope.row[scope.column.property].value">
                        {{ scope.row[scope.column.property].show_value }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div class="table-buttom">
            <div class="table-buttom-left">
                每页显示 {{responsePageInfo.limit}} 条
            </div>
            <div class="table-buttom-right">
                <el-pagination @size-change="pageSizeChange"
                               @current-change="currentPageChange"
                               background
                               layout="total, prev, pager, next"
                               :current-page="responsePageInfo.page"
                               :page-size="responsePageInfo.limit"
                               :total="responsePageInfo.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import numeral from 'numeral'
    import {tableStyle} from '~/components/Common/table/style'
    import config from '~/components/ChartView/ChartShow/data/table'

    export default {
        props: ['chartColList', 'chartColData', 'responsePageInfo', 'chartDataLength'],
        data() {
            return {
                style: tableStyle,
                requestPageConfig: {
                    page: 0,
                    limit: config.chart_table_page_size
                }
            }
        },
        mounted() {
        },
        methods: {
            changePageConfig() {
                this.$emit("page_config_changed", this.requestPageConfig)
            },
            pageSizeChange(size) {
                this.requestPageConfig.limit = size
                this.changePageConfig()
            },
            currentPageChange(page) {
                this.requestPageConfig.page = page
                this.changePageConfig()
            },
            onSortChange({column, prop, order}) {
                if (!prop || !order) {
                    return
                }
                let orderStr = "none"
                if (order === 'ascending') {
                    orderStr = "asc"
                } else {
                    orderStr = "desc"
                }
                console.info("onSortChange", column, prop, order)
                // this.$emit("order_config_changed", {
                //     col_name: prop,
                //     order_type: orderStr
                // })
            }
        },
        watch: {},
        computed: {
            columnList() {
                if (!this.chartColList) {
                    return []
                }
                return this.chartColList.map(o => ({
                    prop: o.col_name,
                    label: o.col_label,
                    align: o.cube_type === 'dimension' ? 'left' : 'right'
                }))
            },
            defaultSort() {
                if (!this.chartColList) {
                    return {}
                }
                const orderCol = this.chartColList.find(o => o.order_type !== 'none')
                return {
                    prop: orderCol.col_name,
                    order: orderCol.order_type === 'asc' ? 'ascending' : 'descending'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table-buttom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        .table-buttom-left {
            line-height: 10px;
            font-size: 13px;
            color: #5a5e66;
        }
        .table-buttom-right {

        }
    }
</style>