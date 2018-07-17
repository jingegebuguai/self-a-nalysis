<template>
    <el-container id="chart-config-page">
        <el-aside width="200px">
            <el-card class="left-header">
                <div class="left-header-title">
                    <div class="title">
                        <i-tip prefixtext='字段库' :subtitle="scenariosName" tip=""></i-tip>
                    </div>
                    <div class="subtitle" :title="scenariosName">{{scenariosName}}</div>
                </div>
                <div class="field_search">
                    <el-input placeholder="查询字段" v-model="filterText" size="mini"
                              suffix-icon="el-icon-search"></el-input>
                </div>
            </el-card>
            <el-card class="left-body">
                <el-scrollbar>
                    <template v-for="cube in cubeColumns">
                        <div class="cube-type">
                            <i :class="['iconfont', 'icon-'+cube.type]"></i> {{cube.type_name}}
                        </div>
                        <draggable element="ul" class="field-list" v-model="cube.columns"
                                   :options="{group:{name:'chart-config',pull:'clone',put:false}}"
                                   :clone="cloneHandler" :move="moveHandler"
                                   @end="onDragged">
                            <li class="field-item" v-for="col in cube.columns" :key="col.col_name"
                                :title="'字段标识：' + col.col_name">
                                <span class="field-text"
                                      :class="{'is-modified':getColumnInfo(col.col_name).alias
                                      && (getColumnInfo(col.col_name).alias != getColumnInfo(col.col_name).name)}">
                                    <i class="iconfont icon-tools"></i>
                                    {{getColumnInfo(col.col_name).alias || getColumnInfo(col.col_name).name}}
                                </span>
                            </li>
                        </draggable>
                    </template>
                </el-scrollbar>
            </el-card>
        </el-aside>
        <el-main>
            <div class="chart-config">
                <el-card class="chart-config-form">
                    <div class="chart-config-basic">
                        <div class="config-title">
                            <div class="title">
                                <i class="iconfont icon-barlinechart"></i>
                                <span class="title-input">
                                    <template v-if="titleEdit===true">
                                        <span type="text" v-text="chart_name" class="title-input-read"></span>
                                        <el-button type="text">
                                            <i class="iconfont icon-edit" @click="titleEdit=false"></i>
                                        </el-button>
                                    </template>
                                    <template v-else>
                                        <input type="text" v-model="chart_name" class="title-input-write"
                                               placeholder="请输入图表名称"/>
                                        <el-button type="text">
                                            <i class="iconfont icon-save" @click="titleEdit=true"></i>
                                        </el-button>
                                    </template>
                                </span>
                            </div>
                        </div>
                        <div class="config-content">
                            <a href="javascript:void(0)" class="chart-type"
                               :class="{'is-active':chart_type === 'table'}"
                               @click.stop="((evt) => {if(chart_type!=='table'){chart_type = 'table'}})">
                                <i class="iconfont icon-table"></i>
                            </a>
                            <a href="javascript:void(0)" class="chart-type"
                               :class="{'is-active':chart_type === 'line_chart'}"
                               @click.stop="((evt) => {if(chart_type!=='line_chart'){chart_type = 'line_chart'}})">
                                <i class="iconfont icon-chart"></i>
                            </a>
                        </div>
                    </div>

                    <div :class="['drop-area', {'can-drop': draggableFlag.dimension}]">
                        <div class="area-title">
                            <template v-if="chart_type==='table'">
                                <i class="iconfont icon-dimension"></i>&nbsp;维度
                            </template>
                            <template v-else-if="chart_type==='line_chart'">
                                <i class="iconfont icon-dimension"></i>&nbsp;x 轴
                            </template>
                        </div>
                        <div class="area-content">
                            <draggable element="ul" class="dimension-list" v-model="dimensions"
                                       :options="{group:{name:'chart-config',pull:false,put:true}}"
                                       @end="onDragged">
                                <template v-if="dimensions && dimensions.length">
                                    <li v-for="(obj, index) in dimensions" :key="obj.col_name"
                                        v-if="obj.col_name">
                                        <draggable-column type="dimension"
                                                          :col_name="obj.col_name"
                                                          :alias="getColumnInfo(obj.col_name).alias"
                                                          :init_order_type="obj.order_type"
                                                          @remove="()=>{removeColumn(index,'dimension')}"
                                                          @confirm="(conf)=>confirmConf(index,'dimension',conf)">
                                        </draggable-column>
                                    </li>
                                </template>
                                <span class="drag-tip-text" v-else>拖动左侧字段至此</span>
                            </draggable>
                        </div>
                    </div>


                    <div :class="['drop-area', {'can-drop': draggableFlag.measure}]">
                        <div class="area-title">
                            <template v-if="chart_type==='table'">
                                <i class="iconfont icon-measure"></i>&nbsp;指标
                            </template>
                            <template v-else-if="chart_type==='line_chart'">
                                <i class="iconfont icon-measure"></i>&nbsp;y 轴
                            </template>
                        </div>
                        <div class="area-content">
                            <draggable element="ul" class="measure-list" v-model="measures"
                                       :options="{group:{name:'chart-config',pull:false,put:true}}"
                                       @end="onDragged">
                                <template v-if="measures && measures.length">
                                    <li v-for="(obj, index) in measures" :key="obj.col_name"
                                        v-if="obj.col_name">
                                        <draggable-column type="measure"
                                                          :col_name="obj.col_name"
                                                          :alias="getColumnInfo(obj.col_name).alias"
                                                          :init_order_type="obj.order_type"
                                                          :init_formatter_type="obj.formatter_info.formatter_type"
                                                          :init_formatter_decimal="obj.formatter_info.decimal"
                                                          @remove="()=>{removeColumn(index,'measure')}"
                                                          @confirm="(conf)=>confirmConf(index,'measure',conf)">
                                        </draggable-column>
                                    </li>
                                </template>
                                <span class="drag-tip-text" v-else>拖动左侧字段至此</span>
                            </draggable>
                        </div>
                    </div>

                    <div :class="['drop-area', {'can-drop': draggableFlag.splitdim}]" v-if="chart_type==='line_chart'">
                        <div class="area-title">
                            <i class="iconfont icon-dimension"></i>&nbsp;趋势线
                        </div>
                        <div class="area-content">
                            <draggable element="ul" class="splitdim-list" v-model="splitdims"
                                       :options="{group:{name:'chart-config',pull:false,put:true}}"
                                       @end="onDragged">
                                <template v-if="splitdims && splitdims.length">
                                    <li v-for="(obj, index) in splitdims" :key="obj.col_name"
                                        v-if="getColumnInfo(obj.col_name)">
                                        <draggable-column type="dimension"
                                                          :col_name="obj.col_name"
                                                          :alias="getColumnInfo(obj.col_name).alias"
                                                          :init_order_type="obj.order_type"
                                                          @remove="()=>{removeColumn(index,'splitdim')}"
                                                          @confirm="(conf)=>confirmConf(index,'splitdim',conf)">
                                        </draggable-column>
                                    </li>
                                </template>
                                <span class="drag-tip-text" v-else>拖动左侧字段至此</span>
                            </draggable>
                        </div>
                    </div>

                    <div :class="['drop-area', {'can-drop': draggableFlag.filter}]">
                        <div class="area-title">
                            <i class="iconfont icon-filter"></i>&nbsp;筛选条件
                        </div>
                        <div class="area-content">
                            <draggable element="ul" class="filter-list" v-model="filters"
                                       :options="{group:{name:'chart-config',pull:false,put:true}}"
                                       @end="onDragged">
                                <template v-if="filters && filters.length">
                                    <li v-for="(filter, index) in filters" :key="filter.col_name"
                                        v-if="filter.col_name">
                                        <template v-if="getColumnInfo(filter.col_name).type === 'DIMENSION'">
                                            <date-filter
                                                    v-if="getColumnInfo(filter.col_name).is_calendar"
                                                    :col_name="filter.col_name"
                                                    :name="getColumnInfo(filter.col_name).alias || filter.col_name"
                                                    :filters="filter"
                                                    @confirm="((conf) => confirmConf(index,'filter', conf))"
                                                    @remove="(() => removeColumn(index,'filter'))"
                                                    :dialogShow="show_filter_dialog">
                                            </date-filter>
                                            <dimension-filter
                                                    v-else
                                                    :col_name="filter.col_name"
                                                    :name="getColumnInfo(filter.col_name).alias || filter.col_name"
                                                    :dict="getColumnInfo(filter.col_name).dict"
                                                    :filters="filter"
                                                    @confirm="((conf) => confirmConf(index,'filter', conf))"
                                                    @remove="(() => removeColumn(index,'filter'))"
                                                    :dialogShow="show_filter_dialog">
                                            </dimension-filter>
                                        </template>
                                        <template v-else-if="getColumnInfo(filter.col_name).type === 'MEASURE'">
                                            <measure-filter
                                                    :col_name="filter.col_name"
                                                    :name="getColumnInfo(filter.col_name).alias || filter.col_name"
                                                    :filters="filter"
                                                    @confirm="((conf) => confirmConf(index,'filter', conf))"
                                                    @remove="(() => removeColumn(index,'filter'))"
                                                    :dialogShow="show_filter_dialog">
                                            </measure-filter>
                                        </template>
                                    </li>
                                </template>
                                <span class="drag-tip-text" v-else>拖动左侧字段至此</span>
                            </draggable>
                        </div>
                    </div>
                </el-card>
            </div>
            <el-card class="chart-show">
                <chart-show/>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue'
    import axios from '~/axios'
    import draggable from 'vuedraggable'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import {Notification} from 'element-ui'
    import {Dropdown, DropdownMenu, DropdownItem, DropdownDivider} from '../components/Common/dropdown'
    import DraggableColumn from '~/components/ChartConfig/draggable/index'
    import DimensionFilter from '~/components/ChartConfig/filters/DimensionFilter'
    import MeasureFilter from '~/components/ChartConfig/filters/MeasureFilter'
    import DateFilter from '~/components/ChartConfig/filters/DateFilter'
    import ChartShow from '~/components/ChartView/ChartShow/index'
    import {config} from '~/components/ChartConfig/common/const'

    export default {
        data() {
            return {
                name_state: 'read',
                username: '',
                filterText: '',
                columns: [],
                titleEdit: true,
                show_filter_dialog: false,
                filter_existed_warning: false,
                draggableFlag: {
                    dimension: false,
                    measure: false,
                    filter: false,
                    splitdim: false
                }
            }
        },
        components: {
            draggable,
            Dropdown,
            DropdownMenu,
            DropdownItem,
            DropdownDivider,
            DraggableColumn,
            DimensionFilter,
            MeasureFilter,
            DateFilter,
            ChartShow,
        },
        mounted() {
            //新增图表，初始化图表配置
            const scenario_id = this.$route.query['scenario_id']
            if (scenario_id) {
                this.titleEdit = false//图表标题设置为可编辑状态，提示用户输入
                this.initChartConfig(scenario_id)//初始化图表配置信息
                this.updateChartDataStatus({status: 'init', msg: '请输入查询条件！'})//图表查看模块置为空
                return
            }
            //修改图表，获取要修改的图表配置
            const chart_id = this.$route.query['chart_id']
            if (chart_id) {
                this.$store.dispatch('chartConfig/getChartInfo', chart_id, {
                    root: true
                })
            }
        },
        methods: {
            clearDragableFlag() {
                const flag = this.draggableFlag
                flag.dimension = false
                flag.measure = false
                flag.filter = false
                flag.splitdim = false
            },
            onDragged(evt) {
                this.clearDragableFlag()
            },
            cloneHandler(data) {
                const {col_name, type} = data
                this.show_filter_dialog = true
                this.filter_existed_warning = false
                console.info("==> cloneHandler", type, JSON.stringify(data))
                if (type === 'DIMENSION') {//“维度”字段可以拖放到维度、趋势线、过滤器区域
                    if (this.chart_type === 'line_chart') {//折线图，只能有一个维度
                        if (this.dimensions.length >= 1) {
                            this.draggableFlag.dimension = false
                        }
                    } else {
                        this.draggableFlag.dimension = true
                    }
                    this.draggableFlag.splitdim = true
                    this.draggableFlag.filter = true
                } else if (type === 'MEASURE') {//任意“指标”字段可以拖放到指标区域，指标区域内的“指标”字段可以拖放到过滤器区域
                    this.draggableFlag.measure = true
                    if (this.measures.filter(o => o.col_name === col_name).length > 0) {
                        this.draggableFlag.filter = true
                    }
                }
                return {col_name}
            },
            moveHandler(evt) {
                const {col_name, type} = evt.draggedContext.element

                const targetClassName = evt.relatedContext.component.$el.className
                console.info("==> targetClassName cubeType: ", targetClassName, type)
                if (targetClassName !== 'filter-list') {//非过滤器字段
                    if (type === 'DIMENSION') {//“维度”字段可以拖放到维度、趋势线、过滤器区域
                        if (targetClassName !== 'dimension-list' && targetClassName !== 'splitdim-list' && targetClassName !== 'filter-list') {
                            return false
                        }
                        const isColExist = evt.relatedContext.list.filter(dim => (dim['col_name'] === col_name)).length > 0
                        if (isColExist && !this.filter_existed_warning) {
                            this.filter_existed_warning = true
                            Notification.warning({
                                title: '警告',
                                message: '已存在该字段的维度'
                            })
                            return false
                        }
                        if (targetClassName === 'dimension-list') {
                            if (this.chart_type === 'line_chart') {//折线图，只能有一个维度
                                if (this.dimensions.length >= 1) {
                                    return false
                                }
                            }
                        }
                    } else if (type === 'MEASURE') {//任意“指标”字段可以拖放到指标区域，指标区域内的“指标”字段可以拖放到过滤器区域
                        if (targetClassName !== 'measure-list' && targetClassName !== 'filter-list') {
                            return false
                        }
                        if (targetClassName === 'filter-list' && this.measures.filter(o => o.col_name === col_name).length === 0) {
                            return false
                        }
                    }
                    return true
                } else {//过滤器字段
                    const isFilterExisted =
                        evt.relatedContext.list.filter(filter => (filter['col_name'] === col_name)).length > 0

                    if (isFilterExisted && !this.filter_existed_warning) {
                        this.filter_existed_warning = true
                        Notification.warning({
                            title: '警告',
                            message: '已存在该字段的过滤器'
                        })
                        return false
                    }
                    return !isFilterExisted
                }
            },
            removeColumn(index, type) {
                this.$store.commit('chartConfig/removeColumn', {index, type})
                this.saveChartConfig(true)
            },
            confirmConf(index, type, conf) {//字段配置修改：排序、格式化
                const oldOrderColumns = [...this.dimensions, ...this.splitdims, ...this.measures]
                //初始化order_type
                for (let col of oldOrderColumns) {
                    if (!col.order_type) {
                        col.order_type = 'none'
                    }
                }
                if (conf.order_type !== 'none') {//排序操作
                    //清除其他字段排序
                    for (let col of oldOrderColumns) {
                        col.order_type = 'none'
                    }
                } else {//拖放操作
                    if (this.getColumnInfo(conf.col_name).is_calendar) {//日期字段默认按倒序排
                        conf.order_type = 'desc'
                    }
                }

                if (type === 'dimension') {
                    Vue.set(this.dimensions, index, conf)
                } else if (type === 'splitdim') {
                    Vue.set(this.splitdims, index, conf)
                } else if (type === 'measure') {
                    Vue.set(this.measures, index, conf)
                } else if (type === 'filter') {
                    Vue.set(this.filters, index, conf)
                }

                this.$store.commit('chartConfig/updateColumn', {
                    dimensions: this.dimensions,
                    splitdims: this.splitdims,
                    measures: this.measures,
                    filters: this.filters,
                })

                this.saveChartConfig(true)
            },
            ...mapActions('chartConfig', [
                'getDataSourceMetadata',
                'initChartConfig',
                'saveChartConfig',
                'getChartInfo'
            ]),
            ...mapMutations('chartView/chartNowData', {
                updateChartDataStatus: 'updateStatus'
            })
        },
        watch: {
            scenario_info() {
                if (!this.scenario_info) {
                    return
                }
                this.columns = this.scenario_info.column_infos.filter(o => o.is_show)
                if (!(this.filters && this.filters.length)) {
                    for (let col of this.columns) {
                        if (col.data_type === 'date') {
                            this.filters = [{col_name: col.col_name}]
                            break
                        }
                    }
                }
            },
            filterText(newValue) {
                this.columns = this.filterCols(newValue)
            },
        },
        computed: {
            scenariosName() {
                if (!this.scenario_info) {
                    return ''
                }
                return this.scenario_info.name
            },
            chartNowInfoState() {
                return this.$store.state.chartConfig
            },
            cubeColumns() {
                if (!this.columns || this.columns.length === 0) {
                    return []
                }
                return [{
                    type: "dimension",
                    type_name: "维度",
                    columns: this.columns.filter(o => o.type === 'DIMENSION')
                }, {
                    type: "measure",
                    type_name: "指标",
                    columns: this.columns.filter(o => o.type === 'MEASURE')
                }]
            },
            dimensions: {
                get() {
                    if (!this.chartNowInfoState.dimensions) {
                        return []
                    }
                    return this.chartNowInfoState.dimensions
                },
                set(dimensions) {
                    this.$store.commit('chartConfig/updateColumn', {dimensions})
                    this.saveChartConfig(true)
                }
            },
            splitdims: {
                get() {
                    if (!this.chartNowInfoState.splitdims) {
                        return []
                    }
                    return this.chartNowInfoState.splitdims
                },
                set(splitdims) {
                    this.$store.commit('chartConfig/updateColumn', {splitdims})
                    this.saveChartConfig(true)
                }
            },
            measures: {
                get() {
                    if (!this.chartNowInfoState.measures) {
                        return []
                    }
                    return this.chartNowInfoState.measures
                },
                set(measures) {
                    this.$store.commit('chartConfig/updateColumn', {measures})
                    this.saveChartConfig(true)
                }
            },
            filters: {
                get() {
                    if (!this.chartNowInfoState.filters) {
                        return []
                    }
                    return this.chartNowInfoState.filters
                },
                set(filters) {
                    this.$store.commit('chartConfig/updateColumn', {filters})
                    this.saveChartConfig(true)
                }
            },
            chart_name: {
                get() {
                    return this.chartNowInfoState.chart_name
                },
                set(val) {
                    this.$store.commit('chartConfig/updateChartName', val)
                }
            },
            chart_type: {
                get() {
                    return this.chartNowInfoState.chart_type
                },
                set(chart_type) {
                    this.$store.commit('chartConfig/updateChartType', chart_type)
                    this.saveChartConfig(true)
                }
            },
            ...mapState('chartConfig', [
                'scenario_info', 'column_map', 'chart_id', 'last_modified'
            ]),
            ...mapGetters('chartConfig', [
                'filterCols', 'getColumnInfo'
            ]),
        }
    }
</script>

<style lang="scss" scoped src="~/components/ChartConfig/style/page.scss"></style>