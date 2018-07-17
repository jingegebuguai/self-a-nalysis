<template>
    <el-dialog
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose"
            :modal="false"
    >
  <span>
      <div class="page-header">
        <div class="page-title">
            <span class="column-title">自定义指标</span>
            <!--<span class="column-subtitle">（
            <span>{{warning}}</span>
                ）</span>-->
        </div>
      </div>
        <el-form label-position="right" label-width="100px" :model="customForm" size="small" class="form-index"
                 :rules="rules" ref="customindex">
          <el-form-item label="指标名称 :" prop="alias">
                <el-input v-model="customForm.alias" placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item label="计算规则 :" prop="calc_rule">
              <at v-model="customForm.calc_rule" ref="calc_rule"></at>
          </el-form-item>
           <el-form-item label="指标备注 :" prop="memo">
                <el-input v-model="customForm.memo" placeholder="请输入指标备注"></el-input>
          </el-form-item>
        </el-form>
  </span>
        <span slot="footer" class="dialog-footer">

    <el-button type="primary" @click="onCustomDialogSuccess" size="medium">确 定</el-button>
  </span>
    </el-dialog>
</template>
<script>
    import At from '../at/At'
    import moment from 'moment'
    import {mapState} from 'vuex'

    export default {
        data() {
            var checkCalcRule = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('计算规则不能为空'))
                }
                else {
                    const legalSymbol = '+-*/()'
                    const bracketsContains = value    //([platform]+[version])/2
                    const bracketsNotContains = value.replace(/(\[|\])/g, '').match(/\W/g)  //(platform+version)/2 中非数字字母下划线
                    let illegalSymbolFlag = false
                    let illegalSymbol = ''
                    if (bracketsNotContains!=null) {
                        for (let i = 0; i < bracketsNotContains.length; i++) {
                            if (legalSymbol.indexOf(bracketsNotContains[i]) == -1) {
                                illegalSymbol = bracketsNotContains[i]
                                illegalSymbolFlag = true
                                break
                            }
                        }
                    }
                    if (illegalSymbolFlag) {
                        callback(new Error("算式包含非法字符 '" + illegalSymbol + "' "))
                    } else {
                        let resultLeftCount = bracketsContains.match(/\(/g) ? bracketsContains.match(/\(/g).length : 0
                        let bracketsLeftCount = bracketsContains.match(/\[/g) ? bracketsContains.match(/\[/g).length : 0
                        let resultRightCount = bracketsContains.match(/\)/g) ? bracketsContains.match(/\)/g).length : 0
                        let bracketsRightCount = bracketsContains.match(/\]/g) ? bracketsContains.match(/\]/g).length : 0
                        if (resultLeftCount != resultRightCount) {
                            let lackBracketsSymbol = resultLeftCount - resultRightCount > 0 ? ')' : '('
                            callback(new Error("括号个数不匹配,请检查 '" + lackBracketsSymbol + "' 的个数"))
                        } else if (bracketsLeftCount != bracketsRightCount) {
                            let lackBracketsSymbol = bracketsLeftCount - bracketsRightCount > 0 ? '[' : ']'
                            callback(new Error("括号个数不匹配,请检查 '" + lackBracketsSymbol + "' 的个数"))
                        } else {
                            let illegalColumnFlag = false
                            let hasLeft = false;
                            let column = ''
                            let columnArr = []
                            let illegalColumnName = ''
                            for (let i = 0; i < value.length; i++) {
                                if (value[i] == '[') {
                                    hasLeft = true
                                    continue
                                }
                                if (hasLeft && value[i] != ']') {
                                    column += value[i]
                                }
                                if (value[i] == ']') {
                                    hasLeft = false
                                    columnArr.push(column)
                                    column = ''
                                }
                            }
                            for (let i = 0; i < columnArr.length; i++) {
                                if (!this.colMap.hasOwnProperty(columnArr[i])) {
                                    illegalColumnName = columnArr[i]
                                    illegalColumnFlag = true
                                    break
                                }
                            }
                            if (illegalColumnFlag) {
                                callback(new Error("包含非法字段 '" + illegalColumnName + "' "))
                            } else {
                                let calcRuleFlag = false
                                let leftBracketRule1 = new RegExp(/(\(|\+|-|\*|\/)*\((\[|[1-9])/) // (|+|-|*|/|'' +(+ [|数字
                                let leftBracketRule2 = new RegExp(/(\(|\+|-|\*|\/)*\[(\w*)/) // (|+|-|*|/|'' +[+ 字段名
                                let rightBracketRule1 = new RegExp(/(\)|[0-9]|\])\)(\)|\+|-|\*|\/)*/) // )|数字|] +)+ )|+|-|*|/|''
                                let rightBracketRule2 = new RegExp(/\w+\](\)|\+|-|\*|\/)*/) //    字段名 +]+ )|+|-|*|/|''
                                let plusSymbolRule = new RegExp(/(\)|\]|[0-9]|\s)\+(\(|\[|[0-9]+)/) //    )|]|数字  +++ (|[|数字
                                let minusSymbolRule = new RegExp(/(\)|\]|[0-9]|\s)-(\(|\[|[0-9]*)/) //    )|]|数字  +-+ (|[|数字
                                let multiplySymbolRule = new RegExp(/(\)|\]|[0-9]|\s)\*(\(|\[|[0-9]*)/) //    )|]|数字  +*+ (|[|数字
                                let divideSymbolRule = new RegExp(/(\)|\]|[0-9]|\s)\/(\(|\[|[1-9]*)/) //    )|]|数字  +/+ (|[|数字
                                let numRule = new RegExp(/(\(|\+|-|\*|\/)*\d+(\)|\+|-|\*|\/)*/) //   (|+|-|*|/|''  +数字+ )|+|-|*|/|''
                                let columnRule = new RegExp(/\[\w+\]/) //   [ +字段名+ ]

                                let hasParentheses = false
                                let hasBrackets = false
                                let hasPlus = false
                                let hasMinus = false
                                let hasMultiply = false
                                let hasDivide = false
                                let hasNum = false
                                let hasColumn = false

                                bracketsContains.indexOf('(') === -1 ? hasParentheses = false : hasParentheses = true
                                bracketsContains.indexOf('[') === -1 ? hasBrackets = false : hasBrackets = true
                                bracketsContains.indexOf('+') === -1 ? hasPlus = false : hasPlus = true
                                bracketsContains.indexOf('-') === -1 ? hasMinus = false : hasMinus = true
                                bracketsContains.indexOf('*') === -1 ? hasMultiply = false : hasMultiply = true
                                bracketsContains.indexOf('/') === -1 ? hasDivide = false : hasDivide = true
                                bracketsContains.match(/\d/) ? hasNum = true : hasNum = false
                                bracketsContains.match(/\w/) ? hasColumn = true : hasColumn = false

                                /*console.log('hasParentheses', hasParentheses)
                                console.log('hasBrackets', hasBrackets)
                                console.log('hasPlus', hasPlus)
                                console.log('hasMinus', hasMinus)
                                console.log('hasMultiply', hasMultiply)
                                console.log('hasDivide', hasDivide)
                                console.log('hasNum', hasNum)
                                console.log('hasColumn', hasColumn)*/
                                calcRuleFlag =
                                    hasParentheses ? leftBracketRule1.test(bracketsContains) : true &&
                                    rightBracketRule1.test(bracketsContains) &&
                                    hasBrackets ? leftBracketRule2.test(bracketsContains) : true &&
                                    rightBracketRule2.test(bracketsContains) &&
                                    hasPlus ? plusSymbolRule.test(bracketsContains) : true &&
                                    hasMinus ? minusSymbolRule.test(bracketsContains) : true &&
                                    hasMultiply ? multiplySymbolRule.test(bracketsContains) : true &&
                                    hasDivide ? divideSymbolRule.test(bracketsContains) : true &&
                                    hasNum ? numRule.test(bracketsContains) : true &&
                                    hasColumn ? columnRule.test(bracketsContains) : true
                                if (!calcRuleFlag) {
                                    callback(new Error('输入的算式不合法'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    }

                }
            };
            return {
                customForm: {
                    'col_name': '',
                    'alias': '',
                    'memo': '',
                    'type': 'MEASURE',
                    'attribute': 'CUSTOMIZED',
                    'calc_rule': '',
                    'is_calendar': false,
                    'last_update_time': '',
                    'is_show': true,
                    'dict': null
                },
                myRule: '',
                warning: '自定义指标会显示给所有相关用户使用，请谨慎操作！',
                updateRule: '',
                rules: {
                    alias: [{required: true, message: '指标名称不能为空', trigger: 'blur'}],
                    calc_rule: [{required: true, validator: checkCalcRule, trigger: 'blur'}]
                }
            }
        },
        methods: {
            handleClose(done) {
                this.$emit('onDialogClose')
            },
            onCustomDialogSuccess() {
                this.$refs.customindex.validate((valid) => {
                    if (!valid) {
                        return
                    } else {
                        this.customForm.last_update_time = moment().format('YYYY-MM-DD HH:mm:ss')
                        this.$emit('onCustomDialogSuccess', this.customForm)
                    }
                })
            }
        },
        watch: {
            rowData(val) {
                if (val.hasOwnProperty('alias') && val.hasOwnProperty('calc_rule') && val.hasOwnProperty('memo')) {
                    this.customForm.alias = val.alias
                    this.customForm.calc_rule = val.calc_rule
                    this.customForm.memo = val.memo
                } else {
                    this.customForm.alias = ''
                    this.customForm.calc_rule = ''
                    this.customForm.memo = ''
                }
            },
            'customForm.calc_rule'(val) {
                this.customForm.col_name = this.customForm.calc_rule
            }
        },
        computed: {
            ...mapState('sceneConfig', [
                'colMap'
            ])
        },
        props: ['rowData', 'dialogVisible'],
        components: {
            At
        }
    };
</script>

<style lang="scss" scoped>
    .page-header {
        display: flex;
        justify-content: space-between;

        .page-title {
            font-size: 14px;
            margin: 0 0 10px 0;
            font-weight: normal;
        }

        .column-title {
            font-size: 16px;
            font-weight: bold;
        }

        .column-subtitle {
            font-size: 13px;
            color: #fa5555;
        }

    }

    .form-index {
        margin-top: 18px;
    }

    .editor {
        width: 400px;
        height: 200px;
        overflow: auto;
        white-space: pre-wrap;
        border: solid 2px rgba(0, 0, 0, .5);
    }

    .editor img {
        max-width: 10em;
        vertical-align: bottom;
    }
</style>

