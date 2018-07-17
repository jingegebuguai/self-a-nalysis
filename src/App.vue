<template>
    <div class="container">
        <div class="header">
            <top-nav></top-nav>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import TopNav from '~/components/Common/TopNav.vue'
    import ElContainer from "element-ui/packages/container/src/main"

    export default {
        components: {
            ElContainer,
            TopNav
        },
        data() {
            return {}
        },
        mounted() {
            this.$store.dispatch('dataSource/tableTreeAction')
            this.$store.dispatch('dataSource/getUsername')
            this.$store.dispatch('dataSource/getIsAdmin')
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        font-family: "Tahoma, Helvetica, Arial, 微软雅黑, sans-serif;";
        font-size: 14px;
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .header {
            width: 100%;
            margin-bottom: 4px;
        }
        .main {
            width: 100%;
            .el-card {
                min-height: 550px;
                padding-top: 10px;
            }
        }
    }
</style>

<style lang="scss">
    body {
        background-color: #f4f4f4;
    }
</style>