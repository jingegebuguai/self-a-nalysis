<template>
    <el-dialog
            title="预览分析场景"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
            modal
    >
        <preview-form
            :previewData="previewData"
            :refer="refer"
            :newIndexForm="newIndexForm"
        ></preview-form>
    </el-dialog>
</template>
<script>
    import PreviewForm from '~/components/ScenariosConfig/table/PreviewForm'
    export default {
        methods:{
            handleClose(){
                this.$emit('onPreviewDataDialogClose')
            }
        },
        components:{PreviewForm},
        props:['previewData','refer','newIndexForm','dialogVisible']
    }
</script>

<style lang="scss" scoped>

</style>

