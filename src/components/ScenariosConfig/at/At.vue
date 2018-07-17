<template>
    <div>
        <at :members="members" name-key="col_name" at="[" suffix="] " :filterMatch="filter">
            <template slot="item" slot-scope="s">
                <!--<i class="iconfont icon-text" v-if="s.item.data_type === 'string'"></i>
                <i class="iconfont icon-number" v-if="s.item.data_type === 'number'"></i>
                <i class="iconfont icon-date" v-if="s.item.data_type === 'date'"></i>-->
                <span class='at-tip-text' v-text="s.item.col_name"></span>
            </template>
            <div class="editor"
                 contenteditable
                 placeholder="指标名需要加上 [ ] 哦~"
                 v-text="ruleHtml"
                 @keyup.enter="refresh"
                 @focus="refresh"
                 @input="refresh"
                 @blur="refresh"
                 ref="rules"
            ></div>
        </at>
        <span class="at-tip2">{{tips2}}</span>
    </div>
</template>

<script>
    import Vue from 'vue'
    import At from 'vue-at'
    import {mapState, mapMutations} from 'vuex'
    import '../../../utils/pinyinUtil'

    export default {
        name: 'app',
        data() {
            return {
                members: [],
                tips2: "支持四则运算，包括+、-、*、/、()、常数",
                ruleHtml: '',
                isLocked: false
            }
        },
        mounted() {
            this.members = this.selectedDataSourceMetaData.columns.filter(o=>{
                return o.attribute=='NATIVE'
            })
            if (!this.isLocked) {
                this.ruleHtml = this.value
            }
        },
        methods: {
            filter(name, chunk, at) {
                return name.toLowerCase().indexOf(chunk.toLowerCase()) > -1 || pinyinUtil.getFirstLetter(name).toLowerCase().indexOf(chunk.toLowerCase()) > -1 || pinyinUtil.getPinyin(name).toLowerCase().replace(/\s/g, "").indexOf(chunk.toLowerCase()) > -1
            },
            refresh($event) {
                this.$nextTick(() => {
                    this.resolveToRule($event, $event.target.innerHTML)
                })
            },
            resolveToRule($event, rule) {
                if ($event.type == 'blur') {
                    this.isLocked = false
                }
                if ($event.type == 'focus') {
                    this.isLocked = true
                }
                let colMap = {}
                if (this.selectedDataSourceMetaData.columns) {
                    for (let col of this.selectedDataSourceMetaData.columns) {
                        colMap[col.col_name] = col.col_name
                    }
                }
                this.updateColMap(colMap)
                rule = rule.replace(/(\r|\n|\s|<div>|<\/div>|<br>)/g, '')
                this.$emit('input', rule)
            },
            ...mapMutations('sceneConfig', [
                'updateColMap'
            ])
        },
        components: {
            At
        },
        computed: {
            ...mapState('sceneConfig', [
                'selectedDataSourceMetaData'
            ])
        },
        watch: {
            value(newVal) {
                if (!this.isLocked) {
                    this.ruleHtml = !newVal ? "" : newVal
                }
            }
        },
        props: ['value']
    }
</script>

<style scoped>
    .editor {
        width: 100%;
        height: 200px;
        overflow: auto;
        white-space: pre-wrap;
        border: solid 1px #eee;
        border-radius: 6px;
    }

    .editor:focus {
        outline: none;
        width: 100%;
        height: 200px;
        overflow: auto;
        white-space: pre-wrap;
        border: solid 1px #36ab00;
        border-radius: 8px;
    }

    .editor img {
        max-width: 10em;
        vertical-align: bottom;
    }

    #app .atwho-li img {
        height: 100%;
        width: auto;
        -webkit-transform: scale(.8);
    }

    #app .atwho-li span {
        padding-left: 8px;
    }

    .at-tip {
        font-size: 13px;
        color: #fa5555;
    }

    .at-tip2 {
        font-size: 13px;
    }

    [contenteditable=true]:empty:before {
        content: attr(placeholder);
        color:#c9cdd5;
        user-modify: read-write-plaintext-only;
        display: block; /* For Firefox */
    }

    .iconfont {
        color: #699f00;
    }

    .at-tip-text {
        margin-left: 5px;
        font-weight: bold;
    }

    .column-color {
        color: #0099cc;
        font-style: italic;
    }
</style>