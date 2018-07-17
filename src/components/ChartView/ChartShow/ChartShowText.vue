<template>
    <div class="chart-show-text">
        {{msg}}
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        props: ['msg'],
    }
</script>

<style lang="scss" scoped>
    .chart-show-text {
        height: 420px;
        width: 100%;
        font-size: 20px;
        text-align: center;
        line-height: 420px;
        color: #afadad;
    }
</style>