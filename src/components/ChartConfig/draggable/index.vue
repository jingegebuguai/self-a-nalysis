<template>
    <div>
        <dropdown>
            <div class="tag-item" slot="dropdown-toggle">
                <i class="iconfont icon-dropdown"></i>
                {{alias || col_name}}
                <span class="tag-remove" @click="removeColumn">
                <i class="iconfont icon-remove"></i>
            </span>
            </div>
            <dropdown-menu>
                <dropdown-item is-extensible>排序
                    <dropdown-menu>
                        <dropdown-item v-for="order in order_types"
                                       :name="order.name"
                                       :is-active="init_order_type === order.name"
                                       :click-handler="()=>changeOrderType(order.name)"
                                       :key="order.name">
                            {{order.text}}
                        </dropdown-item>
                    </dropdown-menu>
                </dropdown-item>
                <dropdown-item v-if="type==='measure'" :click-handler="showNumberFormatDialog">
                    数值格式
                </dropdown-item>
            </dropdown-menu>
        </dropdown>

        <el-dialog title="数值展示格式" :visible.sync="show_number_format" width="450px">
            <el-row style="margin-top:15px">
                <el-col :span="24">
                    <el-radio v-model="formatter_type" label="number">数值</el-radio>
                    <el-radio v-model="formatter_type" label="percent">百分比</el-radio>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px">
                <el-col :span="24">
                    小数位数：
                    <el-input-number v-model="formatter_decimal" controls-position="right"
                                     size="small" :min="0" :max="10"></el-input-number>
                </el-col>
            </el-row>
            <el-row style="margin:15px 0;text-align:right">
                <el-col :span="24">
                    <el-button size="small" @click="hideNumberFormatDialog">取消</el-button>
                    <el-button type="primary" size="small" @click="confirm">确认
                    </el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import axios from '~/axios'
    import {Dropdown, DropdownMenu, DropdownItem, DropdownDivider} from '~/components/Common/dropdown'
    import {config} from '~/components/ChartConfig/common/const'

    export default {
        components: {
            Dropdown,
            DropdownMenu,
            DropdownItem,
            DropdownDivider,
        },
        props: ['type', 'col_name', 'alias', 'init_order_type', 'init_formatter_type', 'init_formatter_decimal'],
        data() {
            return {
                order_type: this.init_order_type,
                order_types: config.order_types,
                show_number_format: false,
                formatter_type: this.init_formatter_type,
                formatter_decimal: this.init_formatter_decimal,
            }
        },
        methods: {
            showNumberFormatDialog() {
                this.show_number_format = true
            },
            hideNumberFormatDialog() {
                this.show_number_format = false
            },
            removeColumn() {
                this.$emit('remove')
            },
            changeOrderType(order){
                this.order_type = order
                this.confirm()
            },
            confirm() {
                const result = {
                    col_name: this.col_name,
                    order_type: this.order_type,
                }
                if (this.type === 'measure') {
                    result.formatter_info = {
                        formatterType: this.formatter_type,
                        decimal: this.formatter_decimal
                    }
                }
                this.$emit('confirm', result)
                this.show_number_format = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tag-item {
        display: inline-block;
        height: 26px;
        padding-left: 8px;
        padding-right: 8px;
        line-height: 26px;
        background-color: #80c13f;
        font-size: 12px;
        color: #fff;
        cursor: move;
        .tag-remove {
            visibility: hidden;
        }
        &:hover {
            .tag-remove {
                visibility: visible;
            }
        }
        .iconfont {
            font-size: 12px;
            cursor: pointer;
            &:hover {
                color: #65fb70;
            }
        }
    }
</style>