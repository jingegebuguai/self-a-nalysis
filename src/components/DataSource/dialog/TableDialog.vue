<template>
    <el-dialog
            :title="currentDictData.dic_name"
            :visible="dialogVisible && dialogType=='table'"
            width="300"
            :before-close="handleClose"
    >
  <span>
      <data-source-dict-info-table
              :tableData="currentDictData"
      ></data-source-dict-info-table>
  </span>
        <span slot="footer" class="dialog-footer">
    <!--<el-button type="primary" @click="onTableDialogSuccess">确 定</el-button>-->
  </span>
    </el-dialog>
</template>
<script>
    import DataSourceDictInfoTable from "../table/DataSourceDictInfoTable"
    import {mapMutations, mapState} from 'vuex'

    export default {
        methods: {
            handleClose() {
                this.hideDialog()
            },
            ...mapMutations('dataSource',['hideDialog'])
        },
        components: {
            DataSourceDictInfoTable
        },
        computed: {
            ...mapState('dataSource', ['dialogVisible', 'currentDictData','dialogType'])
        }
    };
</script>
<style>
    h5 {
        margin-left: 2%;
        margin-top: -1%;
        margin-bottom: 1%;
    }
</style>

