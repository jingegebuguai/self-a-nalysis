<template>
    <div class="editor-column">
        <!--<el-popover transition="none"
                ref="popover4"
                placement="bottom"
                width="300"
                v-model="visible2"
                trigger="click">
            <el-input size="mini" style="width:250px;" v-model="newName">
                <el-button slot="append" type="success" @click="toggleTypeSuccess" size="mini" plain>确定</el-button>
            </el-input>
        </el-popover>-->
        <template>

            <el-tooltip class="item" effect="dark" :content="name" placement="top">
                <!--<span :class="{'cell-item' : hasUpdate, 'col-title': true}">-->
                <span>
                    <span class="col-title-text">{{name}}</span>
                    <el-button type="text" class="show-edit" v-popover:popover4>
                        <i class="iconfont icon-pencil-line"></i>
                    </el-button>
                </span>
            </el-tooltip>
        </template>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                visible2: false,
                newName: ''
            }
        },
        mounted(){
            this.newName=this.hasUpdate? this.hasAlias:this.name
        },
        methods: {
            toggleTypeSuccess() {
                if (this.newName == null || this.newName == "" || (this.hasAlias == null ? this.newName == this.name : this.newName == this.hasAlias)) {
                    return
                }
                const renameColumn = {}
                renameColumn.alias = this.newName
                renameColumn.col_name = this.colId
                renameColumn.datasource_id = null
                renameColumn.last_update_time = null
                renameColumn.username = null
                this.renameColumnAction({renameParam: renameColumn, index: this.index})
                this.visible2 = false

            },
            ...mapActions('dataSource', [
                'renameColumnAction',
            ])
        },
        props: {
            name: {
                type: String,
                required: true
            },
            hasAlias: {
                type: null,
                required: true
            },
            colId: {
                type: String,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        computed: {
            hasUpdate() {
                return this.hasAlias == null ? false : this.name != this.hasAlias
            },
            getNewName: {
                get(){
                    return this.hasUpdate? this.hasAlias: this.name
                },
                set(name){
                    this.newName=name
                }
            },
            currentSlideNode(){
                return this.$store.state.dataSource.currentSlideNode
            }
        },
        watch: {
            getNewName (){
                this.newName=this.getNewName
            },
            currentSlideNode(val){
                this.visible2 = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cell-item {
        display: inline-block;
        border-bottom-color: #000;
        border-bottom-style: dashed;
        border-bottom-width: 1px;
    }
    .editor-column{
        position: relative;
        .show-edit {
            position: absolute;
            display: none;
            right: 0;
            font-size: 13px;
            padding: 0;
            .iconfont {
                font-size: 13px;
            }
        }
    }
</style>

<style lang="scss">
    .datasource-data-table {
        /*tr :hover {
            .show-edit {
                display: inline-block;
            }
        }*/
    }
</style>