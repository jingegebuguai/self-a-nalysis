<template>
    <div>
        <i-tip prefixtext="数据过滤-维度值过滤" tip=""></i-tip>
        <el-card>
            <div style="margin: 5px 0">
                有初始值-条件过滤
                <dimension-filter col_name="platform_id" name="平台" dictionary_id="CSHWPI2T9OD3NPRD"
                                  :dialogShow="true"
                                  :filters="platformFilter2"
                                  @confirm="getDimensionFilter"
                                  @remove="()=>{$notify.success('remove')}"
                                  :dev="false"></dimension-filter>
            </div>
            <div style="margin: 5px 0">
                有初始值-精确过滤
                <dimension-filter col_name="platform_id" name="平台" dictionary_id="CSHWPI2T9OD3NPRD"
                                  :dialogShow="false"
                                  :filters="platformFilter1"
                                  @confirm="getDimensionFilter"
                                  @remove="()=>{$notify.success('remove')}"
                                  :dev="false"></dimension-filter>
            </div>
            <div style="margin: 5px 0">
                无初始值
                <dimension-filter col_name="user_type" name="用户类型" dictionary_id="5JCXZ6RLNRN0ALS2"
                                  :dialogShow="false"
                                  @confirm="getDimensionFilter"
                                  @remove="()=>{$notify.success('remove')}"
                                  :dev="false"></dimension-filter>
            </div>
            <div style="margin: 5px 0">
                无初始值
                <dimension-filter col_name="is_login" name="是否登录" dictionary_id="VOPEGR9OCDVVICRE"
                                  :dialogShow="false"
                                  @confirm="getDimensionFilter"
                                  @remove="()=>{$notify.success('remove')}"
                                  :dev="false"></dimension-filter>
            </div>
            <div style="margin: 5px 0">
                无字典
                <dimension-filter col_name="username" name="用户名称"
                                  :dialogShow="false"
                                  @confirm="getDimensionFilter"
                                  @remove="()=>{$notify.success('remove')}"
                                  :dev="false"></dimension-filter>
            </div>
        </el-card>

        <i-tip prefixtext="数据过滤-日期过滤" tip=""></i-tip>
        <el-card>
            <div style="margin: 5px 0">
                初始值：相对日期
                <date-filter col_name="date" name="日期"
                             :dialogShow="false"
                             :filters="dateFilterValueRelative"
                             @confirm="getDimensionFilter"
                             @remove="()=>{$notify.success('remove')}"></date-filter>
            </div>
            <div style="margin: 5px 0">
                初始值：绝对日期
                <date-filter col_name="date" name="日期"
                             :dialogShow="false"
                             :filters="dateFilterValueAbsolute"
                             @confirm="getDimensionFilter"
                             @remove="()=>{$notify.success('remove')}"></date-filter>
            </div>
        </el-card>

        <i-tip prefixtext="数据过滤-数值过滤" tip=""></i-tip>
        <el-card>
            <div style="margin: 5px 0">
                <measure-filter col_name="vv" name="VV"
                                :dialogShow="false"
                                :filters="measureFilterValue"
                                @confirm="getDimensionFilter"
                                @remove="()=>{$notify.success('remove')}"></measure-filter>
            </div>
        </el-card>

        <i-tip prefixtext="通用TreeDialog" tip=""></i-tip>
        <el-card>
            <i-tip prefixtext="使用说明"
                   tip="事件触发dialog显隐性，例如button的click事件，在事件处理方法中调用dataSource.js中的showDialog Mutation,调用方法为 this.showDialog('tree'),需要提前引入dataSource.js中的此Mutation">
            </i-tip>
            <el-button @click="showDialog('tree')">点击打开dialog</el-button>
            <common-dialog
                    @onTreeDialogSuccess="onTreeDialogSuccess"
                    @onDialogClose="onDialogClose"
                    @onTreeDialogNodeChange="onTreeDialogNodeChange"
                    :currentNodeId="dataSource_id"></common-dialog>
        </el-card>

        <i-tip prefixtext="iview树" tip=""></i-tip>
        <el-card>
            <iview-tree></iview-tree>
        </el-card>

        <i-tip prefixtext="iview多级下拉" tip=""></i-tip>
        <el-card>
            <iview-dropdown></iview-dropdown>
        </el-card>

        <i-tip prefixtext="iview穿梭框" tip=""></i-tip>
        <el-card>
            <iview-transfer></iview-transfer>
        </el-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import dimensionFilter from '~/components/ChartConfig/filters/DimensionFilter'
    import dateFilter from '~/components/ChartConfig/filters/DateFilter'
    import iviewTree from '~/demos/iviewTree'
    import iviewDropdown from '~/demos/iviewDropdown'
    import iviewTransfer from '~/demos/iviewTransfer'
    import commonDialog from '~/components/ChartConfig/dialog/ChartConfigDialog'
    import {mapMutations} from 'vuex'
    import MeasureFilter from "~/components/ChartConfig/filters/MeasureFilter"

    export default {
        data() {
            return {
                dataSource_id: 1,
                platformFilter1: {
                    "combine_type": "and",
                    "col_name": "platform_id",
                    "filter_detail_infos": [{
                        "filter_type": "not_in",
                        "values": ["1_11_114", "201_10_101", "201_11_118"]
                    }]
                },
                platformFilter2: {
                    "combine_type": "and",
                    "col_name": "platform_id",
                    "filter_detail_infos": [
                        {
                            "filter_type": "eq",
                            "values": ["442"]
                        },
                        {
                            "filter_type": "contain",
                            "values": ["sef"]
                        }
                    ]
                },
                measureFilterValue: {
                    "col_name": "vv",
                    "combine_type": "and",
                    "filter_detail_infos": [
                        {
                            "filter_type": "equal",
                            "values": [323]
                        }
                    ]
                },
                dateFilterValueRelative: {
                    "col_name": "date",
                    "combine_type": "and",
                    "filter_detail_infos": [
                        {
                            "filter_type": "relative_date",
                            "values": [
                                "now-7d/d"
                            ]
                        }
                    ]
                },
                dateFilterValueAbsolute: {
                    "col_name": "date",
                    "combine_type": "and",
                    "filter_detail_infos": [
                        {
                            "filter_type": "absolute_date",
                            "values": [
                                "2017-12-15",
                                "2017-12-30"
                            ]
                        }
                    ]
                }
            }
        },
        components: {
            MeasureFilter,
            dimensionFilter, iviewTree, iviewDropdown, iviewTransfer, dateFilter, commonDialog
        },
        mounted() {
        },
        methods: {
            getDimensionFilter: function (data) {
                console.info("--------- getDimensionFilter ---------")
                console.info(JSON.stringify(data, null, 2))
            },
            onTreeDialogSuccess(nodeData) {
                /*   点击确定的回调，返回当前选中的node，类型为object。
                 *   返回nodeData的格式为{
                 *   "id": 1,
                 *   "business_id": "qytt",
                 *   "pingbackKey": "al_qytt_dd_topic_appopen_hive",
                 *   "name": "al_qytt_dd_topic_appopen_hive",
                 *   "alias": "用户开启",
                 *   "business_name": "头条业务线",
                 *   "sublist": null
                 }*/
                console.log(JSON.stringify(nodeData))
            },
            onDialogClose() {
                /*
                * 点击右上角X的回调，一般不使用
                * */
            },
            onTreeDialogNodeChange(nodeData) {
                /*
                * 切换Tree中node的回调，返回当且切换的node
                *
                * */
                console.log("切换" + JSON.stringify(nodeData))
            },
            ...mapMutations('dataSource', [
                'showDialog'
            ])
        },
        watch: {},
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .el-card {
        margin-bottom: 30px;
        min-height: 200px;
    }
</style>