<template>
    <div class="page-header">
        <div class="page-title">
            <i-tip prefixtext='我的图表' tip=""></i-tip>
        </div>
        <div :span="12" class="chart-config-link">
            <el-button type="text" @click="showDialog('tree')">
                <i class="iconfont icon-plus"></i> 新建图表
            </el-button>
            <div>
                <common-dialog @onTreeDialogSuccess="onTreeDialogSuccess"></common-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapMutations} from 'vuex'
    import commonDialog from '~/components/ChartConfig/dialog/ChartConfigDialog'

    export default {
        data() {
            return {}
        },
        components: {commonDialog},
        mounted() {
        },
        methods: {
            ...mapMutations('dataSource', [
                'showDialog'
            ]),
            onTreeDialogSuccess(nodeData) {
                this.$router.push({name: 'chart-config', query: {scenario_id: nodeData.id}})
            }
        },
        watch: {},
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 5px 18px;
        .chart-config-link {
            .el-button--text {
                font-size: 14px;
                padding: 0;
                margin: 0;
                .iconfont {
                    font-size: 14px;
                }
            }
        }
    }
</style>