<!--
用法:
<DateFilter @type  @date></DateFilter>
type为relative和absolute
为relative的时候date返回 -1，-7，-30...
为absolute的时候date返回obj, obj.startDate,obj.endDate
-->
<template>
    <div>
        <filter-button :name="name" @showConfigDialog="dialogVisible = true" @remove="$emit('remove')"></filter-button>
        <el-dialog
                title="数据过滤"
                width="600px"
                height="800px"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                class="dimension-filter">
            <div class="date-text">
                <h5>{{name}}</h5>
            </div>

            <div class="date-tabs">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="相对日期" name="relative_date">
                        <div class="relative-date-content">
                            <el-tabs v-model="activeNameRelativeDate" @tab-click="handleClickRelative"
                                     tabPosition="right">
                                <el-tab-pane label="昨天" name="now-1d/d"></el-tab-pane>
                                <el-tab-pane label="最近一周" name="now-7d/d"></el-tab-pane>
                                <el-tab-pane label="最近一个月" name="now-1M/d"></el-tab-pane>
                            </el-tabs>
                        </div>

                        <div>
                            <el-tabs v-model="activeNameRelativeDate" @tab-click="handleClickRelative"
                                     tabPosition="right" style="width: 30%">
                                <el-tab-pane label="最近三个月" name="now-3M/d"></el-tab-pane>
                                <el-tab-pane label="最近半年" name="now-6M/d"></el-tab-pane>
                                <el-tab-pane label="最近一年" name="now-12M/d"></el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="绝对日期" name="absolute_date" style="height: 400px">
                        <div class="show-time-left"><h4>开始日期：{{ this.absoluteDate.startDate }}</h4></div>
                        <div class="show-time-right"><h4>结束日期：{{ this.absoluteDate.endDate }}</h4></div>
                        <datePicker @getDate="getDate" style="margin-top: 30px"
                                    :selectedValue="absoluteDate"></datePicker>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="success">确 定</el-button>
        </span>

        </el-dialog>
    </div>

</template>

<script>
    import filterButton from "~/components/ChartConfig/filters/FilterButton"
    import datePicker from './DatePicker'

    export default {
        props: ['col_name', 'name', 'filters', 'dialogShow'],
        mounted() {
            if (this.filters != null) {
                this.filterConfig = this.filters
            }
            if (this.dialogShow !== null) {
                this.dialogVisible = this.dialogShow
            }
        },
        data() {
            return {
                dialogVisible: false,
                activeName: '',
                activeNameRelativeDate: '',
                absoluteDate: {startDate: '', endDate: ''}
            }
        }
        ,
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event)
            }
            ,
            handleClickRelative(tab, event) {
                this.activeNameRelativeDate = tab.name
            }
            ,
            handleClose(done) {
                done()
            },
            getDate(Date) {
                this.absoluteDate.startDate = Date.startDate
                this.absoluteDate.endDate = Date.endDate
            },
            success() {
                console.log("success")

                if (this.activeName === 'absolute_date' && ((this.absoluteDate.startDate === '' || this.absoluteDate.endDate === '') || (typeof(this.absoluteDate.startDate) === 'undefined' || typeof(this.absoluteDate.endDate) === 'undefined'))) {
                    this.$confirm("请至少选择一个日期！").then(_ => {
                    }).catch(_ => {
                    })
                    return
                }

                if (this.activeName === 'relative_date' && this.activeNameRelativeDate === '' || typeof(this.activeNameRelativeDate) === 'undefined') {
                    this.$confirm("请至少选择一个日期！").then(_ => {
                    }).catch(_ => {
                    })
                    return
                }

                if (this.activeName === 'absolute_date') {
                    this.activeNameRelativeDate = ''
                    this.dialogVisible = false
                    this.$emit('confirm', this.filterConfig)
                } else {
                    this.absoluteDate.startDate = ''
                    this.absoluteDate.endDate = ''
                    this.dialogVisible = false
                    this.$emit('confirm', this.filterConfig)
                }
            }
        },
        components: {
            datePicker, filterButton
        },
        computed: {
            filter_value() {
                if (this.activeName === 'absolute_date') {
                    var absolute_date = []
                    absolute_date.push('now-' + this.activeNameRelativeDate)
                } else {
                    var relative_date = []
                    relative_date.push(this.startDate)
                    relative_date.push(this.endDate)
                    return relative_date
                }
            },
            filterConfig: {
                get: function () {
                    const retConfig = {
                        col_name: this.col_name,
                        combine_type: 'and',
                        filter_detail_infos: [{
                            filter_type: this.activeName
                        }]
                    }

                    if (this.activeName === 'absolute_date') {
                        retConfig.filter_detail_infos[0].values = [this.absoluteDate.startDate, this.absoluteDate.endDate]
                    } else {
                        retConfig.filter_detail_infos[0].values = [this.activeNameRelativeDate]
                    }
                    return retConfig
                },
                set: function (filters) {
                    if (!filters.filter_detail_infos || filters.filter_detail_infos.length === 0) {
                        console.error("filters filter_detail_infos 设置出错！")
                        return
                    }

                    const tmpItem = filters.filter_detail_infos[0]
                    this.activeName = tmpItem.filter_type
                    if (this.activeName === 'relative_date') {
                        this.activeNameRelativeDate = tmpItem.values[0]
                    } else {
                        this.absoluteDate.startDate = tmpItem.values[0]
                        this.absoluteDate.endDate = tmpItem.values[1]
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dimension-filter {

        /*width: 480px;*/
        .filter-type {
            padding: 0 0 5px 0;
        }

        .dict-title {
            font-size: 12px;
            margin: 5px 0;
        }

        .filter-content {

            .iconfont {
                font-size: 12px;
            }

            .el-select {
                width: 100px;
            }

            .el-input {
                width: 200px;
            }

        }
    }

    .date-text {
        margin-left: 20px;
    }

    .date-tabs {
        margin-left: 20px;
    }

    .relative-date-content {
        float: left;
    }

    .absolute_date_content {
        float: left;
    }

    .picker {
        min-width: 220px
    }

    .show-time-left {
        display: inline-block;
    }

    .show-time-right {
        display: inline-block;
        margin-left: 190px;
    }
</style>

<style lang="scss">
    .dimension-filter {
        @import "../../../theme/transfer.scss";
        @import "../../../theme/form.scss";
    }
</style>