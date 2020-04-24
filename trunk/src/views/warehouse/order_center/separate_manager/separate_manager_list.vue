<template>
  <!-- 以下是新改版本 -->
  <div class="content">
    <div class="left">
      <div class="top">策略列表</div>
      <div class="bottom">
        <p class="title">策略名称</p>
        <ul>
          <li v-for="item in strategyData" :key="item.id" @click="liClickEvent(item.id)">
            <p>{{item.name}}</p>
            <i class="el-icon-arrow-right"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <p>策略信息</p>
        <el-button type="primary" size="small" @click="saveAndEditorStrategyData">{{btnTitle}}</el-button>
      </div>
      <div class="bottom">
        <el-form :model="formData" label-width="160px" :rules="formRules" ref="ruleForm">
          <el-form-item label="订单性质：" prop="typeName">
            <el-select
              v-model="formData.typeName"
              :disabled="typeDisabled"
              placeholder="请输入"
              @change="typeNameChanged"
            >
              <el-option
                v-for="item in propertyData"
                :key="item.id"
                :label="item.description"
                :value="item.description"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存使用范围：" prop="inventoryType">
            <div class="radi0-div">
              <el-radio v-model="formData.inventoryType" label="10001">全部库存</el-radio>
              <br />
              <p class="dec-msg">（根据所有仓库库存随机锁定使用）</p>
              <el-radio v-model="formData.inventoryType" label="10002">单仓库存</el-radio>
              <el-select
                v-model="formData.inventoryName"
                @change="inventoryNameChanged"
                placeholder="请输入"
                :disabled="inventoryDisabled"
              >
                <el-option
                  v-for="item in warehouseData"
                  :key="item.id"
                  :label="item.warehouseName"
                  :value="item.warehouseName"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="拆单规则：" prop="conditionCodeStatus">
            <div class="check-list">
              <el-checkbox v-model="formData.conditionCodeStatus">按仓库维度，条件：</el-checkbox>
              <div class="separate-div">
                <p>1.订单单仓库满足，距离最近单仓发货;</p>
                <p>2.订单商品多仓库满足，多仓发货，按仓库拆单;</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="其他规则：">
            <div class="check-list">
              <el-checkbox v-model="formData.ownerSplitValidStatus">多货主管控仓库，按货主拆单</el-checkbox>
              <p class="other-dec">（存在多货主管理的仓库需选择）</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//库存使用范围校验
const verifyinventoryName = (rule, value, callback, self) => {
  if (value == "10002" && self.formData.inventoryName.length == 0) {
    callback(new Error("请选择一个仓库"));
  } else {
    callback();
  }
};
//拆单规则校验
const conditionCodeStatusChange = (rule, value, callback) => {
  if (value == false) {
    callback(new Error("请选择拆单规则"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      btnTitle: "编辑",
      //标识订单性质
      typeDisabled: true,
      //标识单仓库存
      inventoryDisabled: true,
      formData: {
        id: "",
        //订单性质名称
        typeName: "",
        //订单性质
        type: "",
        //库存类型
        inventoryType: "10001",
        //仓库编码
        inventoryCode: "",
        //仓库名称
        inventoryName: "",
        //拆单规则
        conditionCodeStatus: true,
        //条件类型
        conditionCode: "",
        //其他规则
        ownerSplitValidStatus: false,
        //货主维度拆单标识
        ownerSplitValid: 0,
        //策略编码
        strategyCode: ""
      },
      //form表单验证规则
      formRules: {
        typeName: [
          { required: true, message: "订单性质不能为空", trigger: "blur" }
        ],
        inventoryType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              verifyinventoryName(rule, value, callback, this);
            }, // 自定义验证
            trigger: "blur"
          }
        ],
        conditionCodeStatus: [
          {
            required: true,
            validator: conditionCodeStatusChange, // 自定义验证
            trigger: "blur"
          }
        ]
      },
      //策略数据
      strategyData: [],
      //订单性质数据
      propertyData: [],
      //仓库数据
      warehouseData: []
    };
  },
  watch: {
    btnTitle(val, old) {
      console.log(val);
      console.log(old);
      if (val == "编辑") {
        this.typeDisabled = true;
        this.inventoryDisabled = true;
      } else {
        this.typeDisabled = false;
        this.inventoryDisabled = false;
      }
    }
  },
  async mounted() {
    //得到单仓库存数据
    await this.getWarehouseListData();
    //得到订单性质数据
    await this.getOrderPropertyListData();
    //得到列表数据
    await this.getOrderStrategyListData();
  },
  methods: {
    //得到拆单列表得数据
    getOrderStrategyListData() {
      this.request(this.api.warehouse.orderStrategy_list, {}).then(res => {
        console.log(res);
        //默认取出当前第一个得id
        this.formData.id = res.data[0].id;
        this.strategyData = res.data;
        this.$nextTick(() => {
          let formData = JSON.parse(JSON.stringify(res.data[0]));
          if (formData.type.length > 0) {
            this.formData.typeName = this.propertyData.find(
              item => item.code == formData.type
            ).description;
          }
          this.formData.inventoryType = formData.inventoryType;
          if (formData.inventoryCode.length > 0) {
            this.formData.inventoryName = this.warehouseData.find(
              item => item.warehouseCode == formData.inventoryCode
            ).warehouseName;
          }
          this.formData.conditionCodeStatus =
            formData.conditionCode == "1" ? true : false;
          this.formData.ownerSplitValidStatus = formData.ownerSplitValid;
        });
      });
    },
    //获取订单性质数据
    getOrderPropertyListData() {
      this.request(
        this.api.warehouse
          .warehouseBase_configuration_configurationDictionaryByCode,
        { code: "CONFIGURABLE09" }
      ).then(res => {
        this.propertyData = res;
      });
    },
    //获取当仓库存数据
    getWarehouseListData() {
      this.request(this.api.warehouse.warehouse_list, { isValid: true }).then(
        res => {
          this.warehouseData = res.data;
        }
      );
    },
    //当前策略的点击事件
    liClickEvent(primary) {
      console.log("liClick---");
      this.formData.id = primary;
      this.request(this.api.warehouse.orderStrategy_getByPrimary, {
        primary
      }).then(res => {
        console.log(res);
      });
    },
    //订单性质数据改变时
    typeNameChanged(val) {
      console.log(val);
      let type = this.propertyData.find(item => item.description == val).code;
      this.formData.type = type;
    },
    //仓库选项改变时
    inventoryNameChanged(val) {
      console.log(val);
      let inventoryCode = this.warehouseData.find(
        item => item.warehouseName == val
      ).warehouseCode;
      this.formData.inventoryCode = inventoryCode;
    },
    //编辑和保存按钮得点击事件
    saveAndEditorStrategyData() {
      // this.btnTitle = btnTitle == "编辑" ? "保存" : "编辑";
      if (this.btnTitle == "编辑") {
        this.btnTitle = "保存";
        this.typeDisabled = false;
        this.inventoryDisabled = false;
        return;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.formData.conditionCode = this.formData.conditionCodeStatus
            ? "1"
            : "0";
          this.formData.ownerSplitValid = this.formData.ownerSplitValidStatus
            ? 1
            : 0;
          this.request(
            this.api.warehouse.orderStrategy_save,
            this.formData
          ).then(res => {
            console.log("保存成功---");
            this.btnTitle = "编辑";
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  padding: 0 10px;
  position: absolute;
  top: 68px;
  bottom: 10px;
  right: 0;
  left: 0;
  .left {
    width: 25%;
    margin-right: 10px;
    background-color: #fff;
    overflow-y: auto;
    .top {
      margin: 0 10px;
      padding: 15px 0;
      padding-bottom: 18px;
      border-bottom: 1px solid #ccc;
    }
    .bottom {
      margin: 20px 10px;
      padding-top: 25px;
      .title {
        font-weight: 700;
        padding-bottom: 15px;
      }
      ul {
        margin-right: 30px;
        li {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ccc;
          justify-content: space-between;
          &:hover {
            background-color: #f8f8f8;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    background-color: #fff;
    .top {
      margin: 0 40px;
      padding-top: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bottom {
      margin: 40px;
      .dec-msg {
        position: absolute;
        left: 10%;
        top: 0;
        color: #ccc;
      }
      .check-list /deep/ .el-checkbox__label {
        color: #222;
      }
      .radi0-div /deep/ .el-radio__label {
        color: #222;
      }
      .separate-div {
        margin-left: 20px;
      }
      .other-dec {
        position: absolute;
        left: 20%;
        top: 0;
        color: #ccc;
      }
    }
  }
}
</style>