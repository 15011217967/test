<template>
  <div class="bg-fff item-margin">
    <el-form
      class="item-form"
      :model="filtersData"
      label-width="100px"
      size="small"
      :rules="rules"
      ref="filtersData"
      inline
    >
      <el-row>
        <h5 class="item-title">基本信息</h5>
        <el-col :span="16">
          <el-form-item label="海报：" prop="image">
            <el-upload-img
              :imgApi="imgApi"
              v-model="filtersData.image"
              :EchoDisplayImages="filtersData.image"
              CatalogName="marketing"
              :describe="logoImage_describe"
              :LssUpimgLimit="1"
            ></el-upload-img>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item prop="sort" label="顺序：">
            <el-input
              class="input-w-2"
              placeholder="请输入图片顺序"
              :disabled="editDisabled"
              v-model="filtersData.sort"
              oninput="value=value.replace(/[^\d]/g, '')"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="el-right">
          <div class="blockDiv">
            <span class="lookImg">预览图</span>
            <div class="imageBlock">
              <el-image :src="filtersData.image[0].url" fit="fill" v-if="filtersData.image.length"></el-image>
            </div>
          </div>
          <div class="codeItem">
            <div id="qrcode" ref="qrcode">
              <img src="@/assets/img/code.png" width="60" height="60" />
            </div>
            <span>长按识别二维码</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="item-footer">
      <el-button
        v-if="this._type == 'add'"
        size="small"
        @click="submitForm('filtersData')"
        type="primary"
      >确定</el-button>
      <el-button
        v-else-if="this._type == 'edit'"
        size="small"
        @click="submitForm('filtersData')"
        type="primary"
      >修改</el-button>
      <el-button size="small" @click="routerback">取消</el-button>
    </div>
  </div>
</template>
<!-- 工单池 -->
<script>
import ElUploadImg from "@/components/uploadImg/el_upload_img_multi";

/**
 * 规格详情页面 新增 修改同一页面
 */
export default {
  data() {
    return {
      imgUrl: "",
      filtersData: {
        image: [],
        sort: "",
        id: ""
      },
      productImages: [],
      rules: {
        image: [
          {
            type: "array",
            required: true,
            message: "请上传海报",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: "请输入海报顺序",
            trigger: "blur"
          }
        ]
      },

      editDisabled: false,
      showDisabled: false,
      _type: "",
      _id: "",

      // 长传图片路径
      imgApi: this.api.market.picture_upload,
      // 是否禁止
      disabled: [Boolean],
      // 门店logo描述
      logoImage_describe: "图片尺寸为750*1334,大小不超过2M"
    };
  },
  created() {
    //获取上页面传参
    this.getQueryparams();
  },
  methods: {
    //获取上页面参数
    getQueryparams() {
      this._type = this.$route.query.type;
      this._id = this.$route.query.id;
      let itemStatus = this._type;
      switch (itemStatus.toString()) {
        case "add": //新增
          this.editDisabled = false;
          this.showDisabled = false;
          this.productImages = [];
          this.filtersData = {
            image: [],
            //  image: [{
            //   url: "https://lss-test-bucket.oss-cn-beijing.aliyuncs.com/product/59e5b0afd7574584812916be6ba0f860.png"
            // }],
            sort: "",
            id: ""
          };
          break;
        case "edit": //修改
          this.editDisabled = false;
          this.showDisabled = false;
          this.getData();
          break;
      }
    },
    //获取数据
    getData() {
      var that = this;
      this.request(this.api.market.market_get, {
        id: this._id
      }).then(res => {
        let _data = res;
        console.log(_data);
        that.filtersData.image.push({ url: _data.image });
        that.filtersData.sort = _data.sort;
        that.filtersData.id = _data.id;

        // console.log(that.filtersData.sort, "11111111111");

        if (!!_data.image) {
          this.productImages = [{ url: _data.image }];
        }
      });
    },
    //新增
    submitForm(formName) {
      // console.log(this.filtersData, 88888888888);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否确认保存？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              if (this._type.toString() == "edit") {
                this.request(this.api.market.market_updateValid, {
                  image: this.filtersData.image[0].url,
                  sort: this.filtersData.sort,
                  id: this.filtersData.id
                }).then(res => {
                  this.$router.push({
                    path: "/market/poster/market_poster_list"
                  });
                });
              } else {
                this.request(this.api.market.market_save, {
                  image: this.filtersData.image[0].url,
                  sort: this.filtersData.sort
                }).then(res => {
                  this.$router.push({
                    path: "/market/poster/market_poster_list"
                  });
                });
              }
            })
            .catch(() => {
             
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //后退
    routerback() {
      this.$router.go(-1);
    }
  },
  computed: {
    image() {
      return this.filtersData.image;
    }
  },
  components: {
    ElUploadImg
  }
};
</script>
<style  lang="less" scoped>
h5 {
  color: #222;
  margin-left: -15px;
}
.base-c {
  height: 900px;
}
.el-right {
  float: right;
  position: absolute;
  top: 0;
  right: 304px;
  width: 400px;
  border: 1px solid #ccc;
}
.blockDiv {
}
.lookImg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 30px;
  background: #333;
  z-index: 99;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
.blockDiv ,.imageBlock {
  width: 100%;
  min-height:60px;
}
.imageBlock .el-image,.imageBlock .el-image image{
  width: 100%;
  height: 100%;
}
.codeItem {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 70px;
  position: relative;
  left: 0;
  bottom: 3px;
  width: 100%;
  background: #fff;
}
</style>
