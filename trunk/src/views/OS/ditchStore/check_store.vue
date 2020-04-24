<template>
  <div class="container">
    <div class="title">店铺基本信息</div>
    <el-form ref="form" :model="formData" label-width="150px">
      <el-form-item label="店铺来源：">
        <p>hh</p>
      </el-form-item>
      <el-form-item label="店铺名称：">
        <p>啊实打实</p>
      </el-form-item>
      <el-form-item label="店铺类型：">
        <p>免费</p>
      </el-form-item>
      <el-form-item label="负责人：">
        <p>免费</p>
      </el-form-item>
      <el-form-item label="联系电话：">
        <p>免费</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: ""
      }
    };
  },
  methods: {
    sureBtnClick() {
      console.log("sureBtnClick");
    },
    cancelBtnClick() {
      console.log("cancelBtnClick");
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  position: absolute;
  top: 70px;
  bottom: 10px;
  left: 10px;
  right: 10px;
  .title {
    height: 50px;
    box-sizing: border-box;
    line-height: 10px;
    padding-left: 40px;
    padding-top: 26px;
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid #ccc;
  }
}
</style>