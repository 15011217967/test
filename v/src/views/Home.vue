<template>
  <div class="home">
    <el-form :model="form" label-width="100px" style="width:500px;margin: 0 auto;">
      <el-form-item label="用户账号：">
        <el-input></el-input>
      </el-form-item>
    </el-form>
    <el-button>提交</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home', 
  data() {
    return {
      form:{
        user:'' 
      }
    }
  }
}
</script>

<style scoped>

</style>
