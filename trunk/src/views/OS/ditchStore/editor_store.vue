<template>
  <div class="container">
    <div class="title">店铺基本信息</div>
    <el-form ref="form" :model="formData" label-width="150px">
      <el-form-item label="店铺来源：">
        <el-select v-model="formData.region" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称：">
        <el-input v-model="formData.name" style="width:200px;" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：">
        <el-select v-model="formData.type" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人：">
        <el-input v-model="formData.person" style="width:200px;" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input v-model="formData.phone" style="width:200px;" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sureBtnClick">确认修改</el-button>
        <el-button @click="cancelBtnClick">取消</el-button>
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