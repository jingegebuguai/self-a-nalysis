<template>
    <div>
        <filter-button :name="name" @showConfigDialog="dialogVisible = true" @remove="$emit('remove')"></filter-button>
        <el-dialog
                title="数据过滤"
                width="600px"
                height="800px"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                class="dimension-filter">
            <div class="date-text">
                <h5>{{name}}</h5>
            </div>
            <div class="view-filter">
                <el-select v-model="selectValue" size="mini">
                    <el-option
                            v-for="item in selectOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="view-filter">
                <template v-if="this.selectValue!='between'">
                    <el-input v-model="inputSingle" size="mini" type="number"></el-input>
                </template>
                <template v-else>
                    <el-input v-model="inputStart" size="mini" class="view-filter-input" type="number"></el-input>
                    ~
                    <el-input v-model="inputEnd" size="mini" class="view-filter-input" type="number"></el-input>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="success">确 定</el-button>
        </span>

        </el-dialog>
    </div>

</template>

<script>
    import filterButton from "~/components/ChartConfig/filters/FilterButton"

    export default {
        props: ['col_name', 'name', 'filters', 'dialogShow'],
        components: {
            filterButton
        },
        mounted() {
            if (this.filters) {
                this.filterConfig = this.filters
            }
            if (this.dialogShow !== null) {
                this.dialogVisible = this.dialogShow
            }
        },
        data() {
            return {
                inputSingle: '',
                inputStart: '',
                inputEnd: '',
                dialogVisible: false,
                selectValue: '',
                selectOptions: [
                    {
                        value: 'between',
                        label: '介于'
                    },
                    {
                        value: 'eq',
                        label: '等于'
                    },
                    {
                        value: 'ne',
                        label: '不等于'
                    },
                    {
                        value: 'gt',
                        label: '大于'
                    },
                    {
                        value: 'lt',
                        label: '小于'
                    },
                    {
                        value: 'le',
                        label: '大于等于'
                    },
                    {
                        value: 'ge',
                        label: '小于等于'
                    },
                ]
            }
        },
        computed: {
            filterConfig: {
                get: function () {
                    const retConfig = {
                        col_name: this.col_name,
                        combine_type: 'and',
                        filter_detail_infos: [{
                            filter_type: this.selectValue
                        }]
                    }
                    if (this.selectValue === 'between') {
                        if (this.inputStart > this.inputEnd) {
                            this.$confirm("开始值不能大于结束值哦~").then(_ => {
                            }).catch(_ => {
                            })
                            return
                        }
                        retConfig.filter_detail_infos[0].values = [parseInt(this.inputStart), parseInt(this.inputEnd)]
                    } else {
                        retConfig.filter_detail_infos[0].values = [parseInt(this.inputSingle)]
                    }
                    return retConfig
                },
                set: function (filters) {
                    if(!filters.filter_detail_infos || filters.filter_detail_infos.length === 0){
                        return
                    }
                    const tmpItem = filters.filter_detail_infos[0]
                    this.selectValue = tmpItem.filter_type
                    if (this.selectValue === 'between') {
                        this.inputStart = tmpItem.values[0]
                        this.inputEnd = tmpItem.values[1]
                    } else {
                        this.inputSingle = tmpItem.values[0]
                    }
                }
            }
        },
        methods: {
            handleClose(done) {
                done()
                return
            },
            success() {
                this.dialogVisible = false
                this.$emit('confirm', this.filterConfig)
            }
        }
    }
</script>

<style scoped>
    .view-filter {
        display: inline-block;
    }

    .view-filter-input {
        width: 150px;
    }
</style>