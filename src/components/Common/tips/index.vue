<template>
    <div>
        <h4>
            {{prefixtext}}
            <el-tooltip v-if="!!tip" :content="tip" placement="right">
                <i class="el-icon-question"></i>
            </el-tooltip>
            {{suffixtext}}
        </h4>
    </div>
</template>
<script>
  export default {
    props: {
      prefixtext: {
        type: String,
        required: false
      },
      suffixtext: {
        type: String,
        required: false
      },
      tip: {
        type: String,
        required: true
      }
    }
  }
</script>
<style lang="scss" scoped>
    h4 {
        font-size: 22px;
        margin: 0 0 3px 0;
        font-weight: normal;
        color: #699f00;
        .el-tooltip {
            font-size: 16px;
        }
    }
</style>
