<!--
 * @Description: 打印
 * @Author: elephant  
 * @Date: 2019-08-20 08:58:12
 * @LastEditTime: 2020-04-17 15:44:06
 * @LastEditors: Please set LastEditors
 -->
<template>
<div>
  <el-dialog
    v-if="printsDialogVisible"
    title="打印吊牌"
    :visible.sync="printsDialogVisible"
    class="alarmPopup"
    width="1050px"
    top="5vh"
    append-to-body
  >
    <div class="dialog-search">
      <el-form
        class="item-form"
        :model="filtersData"
        label-width="100px"
        size="small"
        ref="filtersDataRef"
        inline
      >
        <el-form-item prop="printsOptions" label="选择打印机：">
          <el-select v-model="printsValue" placeholder="请选择">
            <el-option
              v-for="item in printsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="setNum" label="批量设置：">
          <el-input class="input-w" placeholder="请输入数量" v-model.number="filtersData.setNum"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="handleAllNum" type="primary" plain size="small">确定</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableListData"
        v-loading="tableLoading"
        stripe
        empty-text="暂无数据"
        header-align="center"
        header-row-class-name="item-table-header"
        :highlight-current-row="true"
        @selection-change="handleSelectionChange"
        :height="tableHeight"
        size="mini"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="code" align="center" label="商品编码" min-width="100"></el-table-column>
        <el-table-column prop="productCode" align="center" label="商品款号" min-width="100"></el-table-column>
        <el-table-column prop="name" align="center" label="商品名称" min-width="100"></el-table-column>
        <el-table-column prop="image" align="center" label="商品图片" min-width="100">
          <template slot-scope="scope">
            <img :src="scope.row.image" class="table-img-wh" />
          </template>
        </el-table-column>
        <el-table-column prop="fullCateName" align="center" label="商品分类" min-width="100"></el-table-column>
        <el-table-column prop="tagBrandName" align="center" label="品牌" min-width="100"></el-table-column>
        <el-table-column prop="size" align="center" label="尺码" min-width="80"></el-table-column>
        <el-table-column prop="color" align="center" label="颜色" min-width="80"></el-table-column>
        <el-table-column prop="printNum" fixed="right" align="center" label="打印数量" min-width="160">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.printNum" :min="1" :max="100"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
       <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersForm.pageIndex"
            :page-sizes="[10,20,30,40,50]"
            :page-size="filtersForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
    </div>
    <div class="item-right mt-10">
      <el-button size="small" @click="closeDialog">取消打印</el-button>
      <el-button size="small" @click="submitPrint()" type="primary">确认打印</el-button>
    </div>
  </el-dialog>
  <!-- 打印状态弹窗 -->
  <prints-status-dialog @setParentPrintsStatus="getPrintsStatus"  ref="printsStatusRef"></prints-status-dialog>
  </div>
</template>
<script>
//引入LODOP模块
import { getLodop } from "@/utils/LodopFuncs.js";
//引入 打印样式模块
import { printWinform } from "@/utils/print_50_120_shu.js";
// 引入弹出打印状态组件；
import PrintsStatusDialog from "./PrintsStatusDialog.vue";

let LODOP;
//打印的数据
let printData = [];
export default {
  name: "tp-prints-dialog",
  components: {
    PrintsStatusDialog,
  },
  data() {
    return {
      filtersForm:{
        pageIndex:1,
        pageSize:10,
        orderByTwo:'color',
        orderBy:'productCode'
      },
      filtersData: {
        setNum: null
      },
      total:0,
      tableListData: [],
      printsOptions: [],
      printsDialogVisible: false,
      printsValue: null,
      //选择后打印的数据
      selectPrintData: [],
      tableLoading:false,
      tableHeight:500,
      parentParams:{}
    };
  },
  created() {
    this.init();
    this.windowHeight(document.documentElement.clientHeight);
  },
  mounted() {
       
  },
  methods: {
    init() {
      this.filtersData = { setNum: null };
      this.tableListData = [];
      this.selectPrintData = [];
      this.parentParams = {};
      this.filtersForm = {
        pageIndex:1,
        pageSize:10,
        orderByTwo:'color',
        orderBy:'productCode'
      };
      printData = [];
    },
    //获取打印机
    getLodopData() {
      try {
        LODOP = getLodop();
        let arr = [];
        let iPrinterCount = LODOP.GET_PRINTER_COUNT();
        for (let i = 0; i < iPrinterCount; i++) {
          arr.push({
            label: LODOP.GET_PRINTER_NAME(i),
            value: i
          });
        }
        // console.log(arr);
        this.printsOptions = arr;
      } catch (error) {
        console.log('无打印机驱动！');
      }
    },
    popupInit(parentParams) {
      this.init();
      this.parentParams = parentParams;
      this.getTableList();
      this.printsDialogVisible = true;
      this.getLodopData();
    },
    //获取列表
    getTableList() {
      this.tableLoading=true;
      this.request(this.api.product.productGoods_listTwo, {
        productSearchVO:this.parentParams,
        productGoodsSearchVO:this.filtersForm
      },true).then(res => {
        this.tableLoading=false;
        let _data = res.data;
        for (let i = 0; i < _data.length; i++) {
          _data[i].printNum = 1;
        }
        this.tableListData = _data;
        this.total = res.totalCount;
      }).catch(err =>{
        this.tableLoading=false;
      });
    },
    //当前选中的数据
    handleSelectionChange(val) {
      this.selectPrintData = val;
    },
    //提交打印
    submitPrint() {
      if(this.printsValue == null){
        this.$message.error('请选择打印机！')
        return
      }
      if (this.selectPrintData.length > 0) {
        let arr = [];
        for (let i = 0; i < this.selectPrintData.length; i++) {
          arr.push({
            count: this.selectPrintData[i].printNum,
            productGoodsCode: this.selectPrintData[i].code
          });
        }
        this.tableLoading=true;
        this.request(this.api.product.productGoodsSn_createSns, arr).then(
          res => {
            this.handlePrint(res);
            this.tableLoading=false;
          }
        ).catch(err=>{
          this.tableLoading=false;
        });
      } else {
        this.$message.error("请选择打印数据！");
      }
    },
    handlePrint(_data) {
      // LODOP.SELECT_PRINTER();//选择打印机
      // LODOP.SET_PRINTER_INDEXA(this.printsValue);
      // LODOP.SET_PRINT_MODE("RESELECT_PRINTER",true);// 允许重选打印机
      if (_data.length > 0) {
        printData = [];
        for (let i = 0; i < _data.length; i++) {
          let productGoodsSns = _data[i].productGoodsSns || [];
          for (let k = 0; k < productGoodsSns.length; k++) {
            let dataList = JSON.parse(JSON.stringify(_data[i]));
            let obj = new Object();
            obj = dataList;
            obj.productGoodsSn = productGoodsSns[k];
            printData.push(obj);
            dataList = null;
            obj = null;
          }
        }
       // console.log(printData);
        if (!!printData) {
          LODOP = getLodop();
          //console.log(LODOP.SET_PRINTER_INDEX(this.printsValue)); 返回true 标识成功
          // LODOP.SET_PRINTER_INDEXA(this.printsValue);
          for (let i = 0; i < printData.length; i++) {
            printWinform(LODOP, printData[i], this.printsValue);
          }
          // LODOP.NewPage();
          if (LODOP.CVERSION) {
            CLODOP.On_Return = (TaskID, Value) => {
              if (!!Value) {
                //打印状态
                this.$refs.printsStatusRef.propInit();
              }else{
                alert("放弃打印！");
              }
            
            };
            return;
          }
        }
      }
    },
  
    //获取子组件返回的打印成功能
    getPrintsStatus(){
      //console.log(555);
      let snArr=[];
      for (let i = 0; i < printData.length; i++) {
        snArr.push({sn:printData[i].productGoodsSn});
      };
      this.request(this.api.product.productGoodsSn_confirmed,snArr).then(res => {
        this.$message.success('更新打印数据成功');
         this.$refs.printsStatusRef.closeDialog();
      }).catch(err =>{
        this.$message.error('更新打印数据失败');
         this.$refs.printsStatusRef.closeDialog();
      });
    },
    closeDialog() {
      this.printsDialogVisible = false;
    },
    windowHeight(val){
      this.tableHeight = (val - 250 ) < 660 ? val - 250 : 660 ;
    },
  //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersForm.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersForm.pageSize = val;
      this.getTableList();
    },
    //处理全部数量
    handleAllNum() {}
  },
  watch: {
    //监听setNum
    "filtersData.setNum": function(val) {
      if (Number.isFinite(val)) {
        for (let i = 0; i < this.tableListData.length; i++) {
          this.tableListData[i].printNum = val;
        }
      } else {
        this.filtersData.setNum = null;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.alarmPopup /deep/ .el-dialog__body {
  padding: 0 20px 30px;
}
.alarmPopup /deep/ .el-input-number {
  line-height: 26px;
}
.item-form{
  padding: 0 20px ;
}
</style>
