<template>
    <div>
        <filter-button :name="name" @showConfigDialog="dialogVisible = true" @remove="$emit('remove')"></filter-button>

        <el-dialog
                title="数据过滤"
                :width="dev?'900px':'510px'"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                class="dimension-filter">

            <div style="display:flex;justify-content:space-between;">
                <div style="width:510px;">

                    <div class="filter-type">
                        <el-radio v-model="filterType" label="precise" :disabled="!dict">精确过滤</el-radio>
                        <el-radio v-model="filterType" label="condition">条件过滤</el-radio>
                    </div>

                    <div class="dict-title">
                        <div>字段：{{name}}</div>
                        <div v-if="filterType==='precise'">
                            <el-select v-model="preciseFilter.filter_type" placeholder="请选择" size="mini"
                                       style="width:150px;">
                                <el-option label="包含下列选项" value="in"></el-option>
                                <el-option label="不包含下列选项" value="not_in"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="filter-content">
                        <el-transfer v-if="filterType==='precise'"
                                     filterable
                                     :titles="['全选', '全选']"
                                     :filter-method="preciseFilter.filterMethod"
                                     filter-placeholder="请输入搜索内容"
                                     v-model="preciseFilter.values"
                                     :data="dictArr">
                        </el-transfer>
                        <div v-else>
                            <el-form :model="conditionForm" ref="conditionForm" label-width="100px"
                                     class="condition-form">
                                <el-form-item
                                        v-for="(item, index) in conditionForm.filters"
                                        :label="name"
                                        :key="index"
                                        :prop="'filters.' + index + '.filter_value'"
                                        :rules="{
                                          required: true,
                                          message: '请填写完整条件',
                                          trigger: 'blur'
                                        }">
                                    <div style="display:flex;justify-content:space-between;">
                                        <div>
                                            <el-select size="mini" v-model="item.filter_type" placeholder="请选择">
                                                <el-option
                                                        v-for="item in conditionForm.rules.options"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input v-if="isTextInputShow(item.filter_type)" size="mini"
                                                      v-model="item.filter_value"></el-input>
                                        </div>
                                        <el-button type="text" size="mini" @click.prevent="removeFilter(item)">
                                            <i class="iconfont icon-minus"></i>
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <div style="display:flex;justify-content:space-between;">
                                        <div>
                                            <el-button type="text" size="mini" @click="addFilter">
                                                <i class="iconfont icon-plus"></i> 新增条件
                                            </el-button>
                                        </div>
                                        <div class="condition-join-type">
                                            <el-select v-model="conditionForm.combine_type" placeholder="请选择"
                                                       size="mini" style="width:150px;">
                                                <el-option label="满足所有条件" value="and"></el-option>
                                                <el-option label="满足以上任一条件" value="or"></el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>

                </div>
                <div v-if="dev" style="width:300px;font-size:12px;border: 1px dashed lightgrey;padding:5px 10px;">
                    <pre><code>{{JSON.stringify(filterConfig,null,2)}}</code></pre>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
            </span>

        </el-dialog>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import axios from '~/axios'
    import filterButton from "~/components/ChartConfig/filters/FilterButton"

    const ruleOptions = [{
        value: 'eq',
        label: '等于'
    }, {
        value: 'ne',
        label: '不等于'
    }, {
        value: 'contain',
        label: '包含'
    }, {
        value: 'not_contain',
        label: '不包含'
    }, {
        value: 'not_empty',
        label: '不为空'
    }, {
        value: 'empty',
        label: '为空'
    }]

    export default {
        components: {filterButton},
        props: ['col_name', 'name', 'dict', 'filters', 'dev', 'dialogShow'],
        mounted: async function () {
            if (this.dict !== null) {
                this.filterType = 'precise'
            } else {
                this.filterType = 'condition'
            }
            if (this.filters) {
                this.filterConfig = this.filters
            }
            if (this.dialogShow !== null) {
                this.dialogVisible = this.dialogShow
            }
        },
        data() {
            return {
                filterType: '',
                preciseFilter: {
                    filter_type: 'in',
                    values: [],
                    filterMethod(query, item) {
                        return item.label.indexOf(query) > -1
                    },
                },
                conditionForm: {
                    filters: [{
                        filter_type: 'eq',
                        filter_value: ''
                    }],
                    rules: {
                        options: ruleOptions,
                        value: ''
                    },
                    combine_type: 'and'
                },
                dialogVisible: false
            }
        },
        computed: {
            dictArr: function () {
                const json = this.col_dict_map[this.dict]
                return Object.keys(json).map(key => ({
                    label: json[key],
                    key
                }))
            },
            filterConfig: {
                get: function () {
                    const col_name = this.col_name
                    if (this.filterType === 'precise') {
                        return {
                            combine_type: 'and',
                            col_name,
                            filter_detail_infos: [{
                                filter_type: this.preciseFilter.filter_type,
                                values: this.preciseFilter.values
                            }]
                        }
                    } else {
                        return {
                            combine_type: this.conditionForm.combine_type,
                            col_name,
                            filter_detail_infos: this.conditionForm.filters.map(o => ({
                                filter_type: o.filter_type,
                                values: o.filter_type === 'empty' || o.filter_type === 'not_empty' ? [] : [o.filter_value]
                            }))
                        }
                    }
                },
                set: function (filters) {
                    if (!filters.col_name) {
                        console.error("==> filter col_name 设置错误")
                        return
                    }

                    this.col_name = filters.col_name

                    if (filters.filter_detail_infos && filters.filter_detail_infos.length === 0) {
                        console.error("==> filter filter_detail_infos 不能为空")
                        return
                    }

                    if (filters.filter_detail_infos.length === 1 && ['in', 'not_in'].indexOf(filters.filter_detail_infos[0].filter_type) >= 0) { //精确匹配 precise：in, not_in

                        const tmpItem = filters.filter_detail_infos[0]
                        if (!tmpItem.values) {
                            console.error("==> filter filter_value 设置错误")
                            return
                        }

                        this.preciseFilter.filter_type = filters.filter_detail_infos[0].filter_type
                        this.preciseFilter.values = tmpItem.values
                        this.filterType = 'precise'

                    } else { //条件匹配 condition

                        this.filterType = 'condition'
                        this.conditionForm.combine_type = filters.combine_type

                        const tmpItemArr = filters.filter_detail_infos

                        const formFilterArr = []
                        const ruleArr = ruleOptions.map(o => o.value)

                        for (let o of tmpItemArr) {
                            if (ruleArr.indexOf(o.filter_type) < 0) {
                                console.error(`==> filter ${o.filter_type} values 设置错误：`, o)
                                return
                            }
                            if (o.filter_type === 'empty' || o.filter_type === 'not_empty') {
                                if (o.values.length !== 0) {
                                    console.error(`==> filter ${o.filter_type} values 设置错误：`, o)
                                    return
                                }
                            } else {
                                if (o.values.length !== 1) {
                                    console.error(`==> filter ${o.filter_type} values 设置错误：`, o)
                                    return
                                }
                            }
                            formFilterArr.push({
                                filter_type: o.filter_type,
                                filter_value: o.values[0]
                            })
                        }

                        this.conditionForm.filters = formFilterArr
                    }
                }
            },
            ...mapState('chartConfig', ['col_dict_map'])
        },
        methods: {
            removeFilter(item) {
                let index = this.conditionForm.filters.indexOf(item)
                if (index !== -1) {
                    this.conditionForm.filters.splice(index, 1)
                }
            },
            addFilter() {
                this.conditionForm.filters.push({
                    filter_value: '',
                    filter_type: 'eq'
                })
            },
            isTextInputShow(type) {
                return type !== 'not_empty' && type !== 'empty'
            },
            handleClose(done) {
                done()
            },
            confirm() {
                this.dialogVisible = false
                this.$emit("confirm", this.filterConfig)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dimension-filter {
        .filter-type {
            padding: 0 0 5px 0;
        }
        .dict-title {
            font-size: 14px;
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
        }
        .filter-content {
            .iconfont {
                font-size: 12px;
            }
            .el-select {
                width: 100px;
            }
            .el-input {
                width: 200px;
            }
        }
    }
</style>

<style lang="scss">
    .dimension-filter {
        @import "../../../theme/transfer.scss";
        @import "../../../theme/form.scss";
    }
</style>