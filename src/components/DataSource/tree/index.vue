<template>
    <div>
        <div style="padding: 5px 18px;">
            <el-input size="mini"
                      placeholder="输入关键字进行过滤"
                      v-model="filterText" suffix-icon="el-icon-search">
            </el-input>
        </div>
        <el-scrollbar>
            <el-tree
                    :class="[lowHeight ? 'col-list-low' : 'col-list-high']"
                    :data="getTableTree"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    ref="tree"
                    empty-text="暂无数据"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="true"
                    node-key="id"
                    :render-content="renderContent"
                    default-expand-all>
            </el-tree>
        </el-scrollbar>
        <!--
          二期功能，添加表
          <Button  style="margin-top: 10px" type="info" @click="addNode" long>添加根目录</Button> -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import TreeItem from './TreeItem.vue'
    import {mapGetters} from 'vuex'
    import ElButton from "element-ui/packages/button/src/button"
    import '../../../utils/pinyinUtil'
    export default {
        props: ['selectedKey', 'lowHeight'],
        data() {
            return {
                isMounted: false,
                filterText: '',
                treeData: this.value,
                runParam: {},
                defaultProps: {
                    children: 'scenarios',
                    label: 'name'
                }
            }
        },
        mounted() {
            const that = this
            if (that.selectedKey) {
                Vue.nextTick(function () {
                    // console.info("==> tree mounted, selected key is: ", that.selectedKey)
                    that.$refs.tree.setCurrentKey(that.selectedKey)
                    that.$emit('onNodeClick', that.$refs.tree.getCurrentNode())
                })
            }
        },
        updated() {

        },
        methods: {
            filterNode(value, data) {
                if (!value) return true
                if (data.name != null) {
                    return data.name.indexOf(value) !== -1 || pinyinUtil.getFirstLetter(data.name).toLowerCase().indexOf(value.toLowerCase().trim()) !==-1 || pinyinUtil.getPinyin(data.name).replace(/\s/g, "").indexOf(value.toLowerCase().trim())!==-1
                }
            },
            /* addNode(){
               this.treeData.splice(0,0,{
                 value:this.$utilHelper.generateUUID(),
                 label: '请输入模块名称',
                 children: [],
                 status:1,
                 isAdd:true
               })
             },*/
            handleNodeClick(nodeData) {
                if (nodeData && nodeData.hasOwnProperty('scenarios')) {
                    return
                }
                this.$emit('onNodeClick', nodeData)
            },
            renderContent(h, {node, data, store}) {
                return h(TreeItem, {
                    props: {
                        value: data,
                        treeNode: node
                    },
                    on: {
                        input: (node) => {
                            data = node
                        },
                        Append: () => {
                            node.expanded = true
                            data.children.push({
                                value: this.$utilHelper.generateUUID(),
                                label: '请输入模块名称',
                                children: [],
                                status: 1,
                                isAdd: true
                            })
                        },
                        //删除节点
                        Delete: (nodeData) => {
                            //递归查找父节点
                            var parentNode = this.$utilHelper.getNode(this.treeData, data.value).parentNode
                            this.runParam.parentNode = parentNode
                            this.runParam.data = data
                            this.runParam.nodeData = nodeData
                            this.$emit('DelNode', parentNode, data, this.CanDelNext)

                        },
                        //保存节点
                        SaveEdit: (nodeData) => {
                            //递归查找父节点
                            var parentNode = this.$utilHelper.getNode(this.treeData, data.value).parentNode
                            this.runParam.parentNode = parentNode
                            this.runParam.data = data
                            this.runParam.nodeData = nodeData
                            this.$emit('SaveEdit', parentNode, data, this.CanSaveNext)
                        },
                        //撤销修改
                        CancelEdit: (nodeData) => {
                            //递归查找父节点
                            var parentNode = this.$utilHelper.getNode(this.treeData, data.value).parentNode
                            if (data.isAdd) {
                                parentNode.children.forEach((v, i) => {
                                    if (v.value == data.value) {
                                        parentNode.children.splice(i, 1)
                                    }
                                })
                            } else {
                                parentNode.children.forEach((v, i) => {
                                    if (v.value == data.value) {
                                        parentNode.children.splice(i, 1, JSON.parse(JSON.stringify(nodeData)))
                                    }
                                })
                            }
                        }
                    }
                })
            },
            CanSaveNext(isNext, nodeId) {
                let parentNode = this.runParam.parentNode
                let nodeData = this.runParam.nodeData
                let data = this.runParam.data
                if (isNext) {
                    parentNode.children.forEach((v, i) => {
                        if (v.value == data.value) {
                            if (this.HOST != "static" && data.isAdd) {
                                data.value = nodeId
                            }
                            data.status = 0
                            parentNode.children.splice(i, 1, data)
                        }
                    })
                } else {
                    if (!data.isAdd) {
                        parentNode.children.forEach((v, i) => {
                            if (v.value == nodeData.value) {
                                data.label = nodeData.label
                                parentNode.children.splice(i, 1, data)
                            }
                        })
                    }
                }
                this.runParam = {}
            },
            CanDelNext(isNext) {
                let parentNode = this.runParam.parentNode
                let nodeData = this.runParam.nodeData
                let data = this.runParam.data
                if (isNext) {
                    parentNode.children.forEach((v, i) => {
                        if (v.value == data.value) {
                            parentNode.children.splice(i, 1)
                        }
                    })
                }
                this.runParam = {}
            }
        },
        watch: {
            selectedKey: function (val) {
                const that = this
                Vue.nextTick(function () {
                    if (that.selectedKey) {
                        that.$refs.tree.setCurrentKey(that.selectedKey)
                        that.$emit('onNodeClick', that.$refs.tree.getCurrentNode())
                    }
                })
            },
            value: {
                handler: function (val, oldVal) {
                    // console.info("====> value")
                    this.treeData = val
                },
                deep: true
            },
            treeData: {
                handler: function (val) {
                    // console.info("====> handler")
                    this.$emit('input', val)
                },
                deep: true
            },
            filterText(val) {
                // console.info("====> filterText")
                this.$refs.tree.filter(val)
            }
        },
        components: {
            ElButton,
            TreeItem
        },
        computed: {
            ...mapGetters('dataSource', [
                'getTableTree'
            ])
        }
    }
</script>
<style lang="scss" scoped>
    .el-scrollbar{
        width: 100%;
        margin-top: 10px;
        border-top: 1px solid #e6ebf5;
        .el-tree {
            font-size: 13px;
            list-style: none;
            font-weight: 900;
            &.col-list-high {
                height: 434px;
            }
            &.col-list-low {
                min-height: 200px;
                max-height: 300px;
            }
        }
    }
</style>