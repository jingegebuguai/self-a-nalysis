<template>
    <div class="top-nav">
        <div class="button-style" v-if="$route.path=='/chart-config'">
            <div class="button-item">
                <el-button type="success" plain size="mini" @click="saveChart">保存</el-button>
            </div>
            <div class="button-item">
                <el-button type="success" plain size="mini" @click="returnToChartView">返回</el-button>
            </div>
        </div>
        <div v-else>
            <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
                <el-menu-item index="/chart-view">我的图表</el-menu-item>
                <el-menu-item index="/datasource">字段库</el-menu-item>
                <el-menu-item v-if="isAdmin" index="/scene-config">分析场景配置</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data() {
            return {}
        },
        watch: {
            saveStatus(status) {
                if (status === 'success') {
                    this.$message({
                        type: 'success',
                        message: '图表配置保存成功'
                    })
                } else if (status === 'error') {
                    this.$message({
                        type: 'warning',
                        message: this.saveMsg
                    })
                    //恢复图表状态为loading，以使saveStatus继续被监听到
                    this.$store.commit('chartConfig/saveConfigStatus', {status: 'loading'}, {root: true})
                }
            }
        },
        methods: {
            saveChart() {
                console.info("save")
                this.$store.dispatch('chartConfig/saveChartConfig', false)
            },
            returnToChartView() {
                if (this.is_modified) {
                    this.$confirm('当前图表未保存，是否保存图表?', '提示', {
                        confirmButtonText: '保存',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.saveChart()
                    }).catch(() => {
                        this.$router.push({
                            name: 'chart-view'
                        })
                    })
                } else {
                    this.$router.push({
                        name: 'chart-view'
                    })
                }
            }
        },
        computed: {
            ...mapState('chartConfig', [
                'saveStatus',
                'saveMsg',
                'is_modified'
            ]),
            ...mapState('dataSource', [
                'isAdmin'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .top-nav {
        .button-style {
            display: flex;
            justify-content: flex-end;
            height: 40px;
            line-height: 40px;
            background: white;
            .button-item {
                margin: 0 10px 0 0;
            }
        }

        .el-menu {
            &.el-menu--horizontal {
                .el-menu-item {
                    color: #2d2f33;
                    border-bottom: 2px solid #36ab00;
                    height: 40px;
                    line-height: 40px;
                }
            }
        }
    }
</style>