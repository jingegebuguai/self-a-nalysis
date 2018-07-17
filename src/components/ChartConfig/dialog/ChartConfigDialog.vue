<template>
    <tree-dialog
            @onTreeDialogSuccess="onTreeDialogSuccess"
            @onDialogClose="onDialogClose"
            @onTreeDialogNodeChange="onTreeDialogNodeChange"
            :currentNodeId="currentNodeId"
    >
    </tree-dialog>
</template>

<script>
    import TreeDialog from '../../Common/dialog/TreeDialog'
    import {mapMutations} from 'vuex'

    export default {
        components: {
            TreeDialog
        },
        methods: {
            onTreeDialogSuccess(nodeData) {
                if (this.currentNodeId == null) {
                    this.hideDialog()
                    this.$emit('onTreeDialogSuccess', nodeData)
                } else {
                    if (this.currentNodeId != nodeData.id) {
                        this.$confirm("切换数据表后将清空当前图表的配置，是否继续？")
                            .then(_ => {
                                this.hideDialog()
                                this.$emit('onTreeDialogSuccess', nodeData)
                            })
                            .catch(_ => {
                            })
                    } else {
                        this.hideDialog()
                    }
                }
            },
            onTreeDialogNodeChange(nodeData) {
                this.$emit('onTreeDialogNodeChange', nodeData)
            },
            onDialogClose() {
                this.$emit('onDialogClose')
            },
            ...mapMutations('dataSource', [
                'hideDialog'
            ])
        },
        props: {
            currentNodeId: {
                type: Number,
                required: false
            }
        }
    }
</script>

<style></style>