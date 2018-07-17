<template>
    <div class="page-header">
        <div class="page-title">
            <span class="column-title">
                字段库
            </span>
            <span class="column-subtitle">
                <i class="iconfont icon-cube" style="font-size: 16px;"></i>
                <span v-if="currentSlideNode.alias"> {{currentSlideNode.alias}}</span>
                <span v-else="currentSlideNode.name"> {{currentSlideNode.name}}</span>
            </span>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'

    export default {
        methods: {
            new_index() {
                this.$emit('new_index')
            }
        },
        computed: {
            ...mapGetters('dataSource', [
                'getColumnInfoTableData',
            ]),
            ...mapState('dataSource', [
                'currentSlideNode'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .page-header {
        display: flex;
        justify-content: space-between;
        .page-title {
            font-size: 14px;
            font-weight: normal;
            .column-title{
                font-size: 20px;
                font-weight: normal;
                color: #699f00;
            }
            .column-subtitle{
                font-size: 13px;
                color: #909399;
                margin-left: 8px;
            }
        }
        .chart-config-link {
            text-align: right;
            .el-button--text {
                font-size: 14px;
                padding: 0;
                margin: 0;
                .iconfont {
                    font-size: 14px;
                }
            }
        }
    }
</style>