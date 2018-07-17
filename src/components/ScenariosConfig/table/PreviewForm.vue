<template>
    <div>
        <div class="step-title">
            <h3>分析场景</h3>
            <hr width="100%" class="line" color="#eee" align="center"/>
        </div>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">业务线：</h4>
            </el-col>
            <el-col :span="20">
                <span v-text="newIndexForm ?newIndexForm.business_name:previewData.hasOwnProperty('business_name')? previewData.business_name:''"></span>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">分析场景名称：</h4>
            </el-col>
            <el-col :span="20">
                <span v-text="newIndexForm ?newIndexForm.name:previewData.hasOwnProperty('name')? previewData.name:''"></span>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">分析场景备注：</h4>
            </el-col>
            <el-col :span="20">
                <span v-text="newIndexForm ?newIndexForm.memo:previewData.hasOwnProperty('memo')? previewData.memo:''"></span>
            </el-col>
        </el-row>

        <div class="step-title">
            <h3>分析场景字段</h3>
            <hr width="100%" class="line" color="#eee" align="center"/>
        </div>
        <scene-column-preview-table
                class="meta-table"
                :tableData="previewData"
                :refer="'preview_'+ refer"
        ></scene-column-preview-table>

        <div class="step-title">
            <h3>字段来源表</h3>
            <hr width="100%" class="line" color="#eee" align="center"/>
        </div>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">字段来源表：</h4>
            </el-col>
            <el-col :span="20">
                <span v-text="newIndexForm ?newIndexForm.table_name:previewData.hasOwnProperty('table_name')? previewData.table_name:''"></span>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">表说明：</h4>
            </el-col>
            <el-col :span="20">
                <span>暂无</span>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="4">
                <h4 class="span-class">链接信息：</h4>
            </el-col>
            <el-col :span="20">
                <span>暂无</span>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import SceneColumnPreviewTable from './SceneColumnPreviewTable'

    export default {
        props: ['previewData', 'refer', 'newIndexForm'],
        components: {SceneColumnPreviewTable}
    }
</script>
<style>
    .line {
        height: 0.5px;
        margin-top: 10px;
    }

    .step-title {
        margin-top: 15px;
        margin-bottom: 10px;
    }

    .span-class {
        float: right;
        margin-right: 5px;
    }
</style>

