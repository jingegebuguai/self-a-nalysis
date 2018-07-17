<template>
    <div>
        <el-card>
            <div class="empty-chart">
                <div>
                    <a href="#" @click="()=>{showDialog('tree')}">
                        <icon name='plus' scale="2.5" color='#afadad'></icon>
                    </a>
                </div>
                <div>快去新建你的第一张图表吧</div>
            </div>
        </el-card>
        <tree-dialog
                @onTreeDialogSuccess="onTreeDialogSuccess"
                @onDialogClose="onDialogClose"
                @onTreeDialogNodeChange="onTreeDialogNodeChange"
        ></tree-dialog>
    </div>
</template>
<script>
    import treeDialog from "../dialog/TreeDialog"
    import {mapMutations} from 'vuex'

    export default {
        components: {
            treeDialog
        },
        methods: {
            onTreeDialogSuccess(nodeData) {
                this.hideDialog()
                this.$router.push({name: 'chart-config', query: {scenario_id: nodeData.id}})
            },
            onTreeDialogNodeChange(nodeData) {
                //this.$emit("onNodeChange", nodeData);
            },
            onDialogClose() {
                this.$emit("onClose")
            },
            ...mapMutations('dataSource', [
                'showDialog',
                'hideDialog'
            ]),
        },
    }
</script>
<style lang="scss" scoped>
    .empty-chart {
        height: 420px;
        width: 100%;
        font-size: 20px;
        color: #afadad;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .iconfont {
            font-size: 20px;
        }
    }
</style>
