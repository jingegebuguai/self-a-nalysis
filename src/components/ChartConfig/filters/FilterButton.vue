<template>
    <div class="filter-item">
        <span class="filter-button-click" @click.stop="$emit('showConfigDialog')">
            <i class="iconfont icon-config"></i>
        </span>
        {{name}}
        <span class="filter-button-click button-remove" @click.stop="$emit('remove')">
            <i class="iconfont icon-remove"></i>
        </span>
    </div>
</template>

<script>
    export default {
        props: ['name'],
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .filter-item {
        display: inline-block;
        background: #ababab;
        color: white;
        font-size: 12px;
        height: 26px;
        line-height: 26px;
        margin: 0;
        padding: 0 8px;
        cursor: move;
        .filter-button-click {
            .iconfont {
                cursor: pointer;
                font-size: 12px;
                &:hover {
                    color: #65fb70;
                }
            }
            &.button-remove {
                visibility: hidden;
            }
        }
        &:hover {
            .button-remove {
                visibility: visible;
            }
        }
    }
</style>