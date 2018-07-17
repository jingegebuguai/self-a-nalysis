<template>
    <el-dialog
            title="新建图表"
            :visible="dialogVisible && dialogType=='tree'"
            width="30%"
            :before-close="handleClose"
    >
  <span>
    <h5>选择数据表</h5>
      <i-tree :selectedKey="currentSlideKey"
              @onNodeClick='getNodeData'
              :lowHeight="true"
      ></i-tree>
  </span>
        <span slot="footer" class="dialog-footer">

    <el-button type="primary" @click="onTreeDialogSuccess">确 定</el-button>
  </span>
    </el-dialog>
</template>
<script>
    import iTree from "../../DataSource/tree";
    import {mapGetters, mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                currentNode: {}
            }
        },
        mounted() {
        },
        methods: {
            handleClose(done) {
                        this.hideDialog()
                        this.$emit('onDialogClose')
            },
            onTreeDialogSuccess() {
                if (!this.currentNode || this.currentNode.hasOwnProperty('scenarios') || this.currentNode.id==-1) {  //点击的是根节点，提示选项为空
                    this.$confirm("请至少选择一个分析场景!")
                        .then(_ => {
                        })
                        .catch(_ => {
                        });
                } else {
                    this.$emit('onTreeDialogSuccess', this.currentNode)
                }
            },
            getNodeData(nodeData) {
                this.currentNode = nodeData
                this.$emit('onTreeDialogNodeChange', nodeData)
            },
            ...mapMutations('dataSource',['hideDialog']),
        },
        components: {
            iTree
        },
        computed: {
            ...mapState('dataSource', ['dialogVisible', 'currentSlideNode','dialogType']),
            ...mapGetters('dataSource', ['getTableTree']),
            currentSlideKey: function () {
                /*if (this.currentSlideNode && this.currentSlideNode.key) {
                    return this.currentSlideNode.key
                }*/
                let tree=this.getTableTree
                let key=''
                for (let i = 0; i < tree.length; i++) {
                    if (tree[i].scenarios != null && tree[i].scenarios.length) {
                        for (let j = 0; j < tree[i].scenarios.length; j++) {
                            if(this.currentNodeId==tree[i].scenarios[j].id){
                                return tree[i].business_id + tree[i].scenarios[j].id
                            }
                        }
                    }
                }
            }
        },
        props: {
            currentNodeId: {
                type: Number,
                required: false
            }
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

