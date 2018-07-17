<template>
    <span class="span_allitem">
        <span @click="Expanded">
            <!-- 一期内容 -->
            <span v-if="!node.hasOwnProperty('scenarios')">
                <template v-if="node.id==-1">
                    <span style="color: #d1d1d1;" disabled>（暂无分析场景）</span>
                </template>
                <template v-else>
                    <i class="iconfont icon-cube" style="font-size:14px;"></i>
                    <span>{{node.name}}</span>
                </template>
            </span>
                <span v-else>
                        {{node.business_name}}
                </span>
        </span>
  </span>


    <!-- 二期内容，修改节点
  <Input v-if="node.status == 1" style="width: 100px;" v-model="node.name" size="small" ></Input>
  <icon v-if="node.status == 0" name='table'></icon>
  <icon v-if="node.status == -1" name='minus-square'></icon>
  <span v-if="node.status != 1">{{node.name}}</span> -->
    <!--二期内容，修改节点
     <span v-if="node.status == 1">
      <Button  style="margin-left: 8px;" size="small" type="success" icon="checkmark-circled" @click="SaveEdit">确认</Button>
      <Button style="margin-left: 8px;" size="small" type="ghost" icon="checkmark-circled" @click="CancelEdit">取消</Button>
    </span>
    <span class="span_icon">
       <icon v-if="node.status == 0" style="margin-left: 8px" color="gray" name="pencil" size="16" @click.native="OpenEdit"></icon>
       <icon v-if="node.status == 0" style="margin-left: 8px" name="plus" color="gray" size="16" @click.native="Append"></icon>
       <icon v-if="node.status == 0&&node.children.length < 1" style="margin-left: 8px" type="ios-trash" color="red" size="18" @click.native="Delete"></Icon>
    </span>-->
</template>

<script>
    export default {
        data() {
            return {
                node: this.value,
                nodeData: JSON.parse(JSON.stringify(this.value))
            }
        },
        props: {
            value: {
                default: function () {
                    return {}
                }
            },
            treeNode: {
                default: function () {
                    return {}
                }
            },
        },
        methods: {
            OpenEdit() {
                this.node.status = 1
                this.node.isAdd = false
            },
            Append() {
                //添加节点事件
                this.$emit('Append')
            },
            SaveEdit() {
                //保存节点事件
                this.$emit('SaveEdit', this.nodeData)
            },
            CancelEdit() {
                this.node.status = 0
                this.$emit('CancelEdit', this.nodeData)
            },
            Delete() {
                this.$emit('Delete', this.nodeData)
            },
            Expanded() {
                this.treeNode.expanded = this.treeNode.expanded ? false : true
            }
        },
        watch: {
            value: {
                handler: function (val, oldVal) {
                    this.node = val
                },
                deep: true
            },
            node: {
                handler: function (val) {
                    this.$emit('input', val)
                },
                deep: true
            }
        }
    }
</script>
<style scoped>
    .span_allitem {
        display: inline;
        width: 100%;
    }

    .span_icon {
        margin-left: 10px;
        display: none;
    }

    .span {
        font-size: 16px;
    }
</style>
