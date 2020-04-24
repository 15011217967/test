<template>
  <div>
    <div class="search_div">
      <el-form ref="formData" :model="signData" label-width="110px" :inline="true">
        <el-form-item label="模糊查询：" prop="searchKey">
          <el-input v-model="signData.searchKey" placeholder="网销店铺名称/负责人/联系电话" style="width:330px;"></el-input>
        </el-form-item>
        <el-form-item label="店铺类型：" prop="businessStatus">
          <el-select v-model="signData.businessStatus" placeholder="请选择">
            <el-option
              v-for="item in orderStateData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺来源：" prop="orderType" label-width="100px">
          <el-select v-model="signData.orderType" placeholder="请选择">
            <el-option
              v-for="item in orderTypeData"
              :key="item.id"
              :label="item.description"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormData" size="small">搜索</el-button>
          <el-button @click="resetFormData('formData')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-button type="primary" @click="addBtnClickEvent" size="small" style="margin-left:10px;">新增</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="暂无数据"
        header-row-class-name="item-table-header"
        @selection-change="selectionChange"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column prop="businessStatus" label="网销店铺名称">
          <!-- <template slot-scope="scope">{{ scope.row.businessStatus | filterBusinessStatus}}</template> -->
        </el-table-column>
        <el-table-column label="店铺类型">
          <template slot-scope="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column prop="type" label="店铺来源">
          <!-- <template slot-scope="scope">{{ scope.row.type | filtersType }}</template> -->
        </el-table-column>
        <el-table-column prop="consignee" label="负责人"></el-table-column>
        <el-table-column prop="consigneeTelephone" label="联系电话"></el-table-column>
        <el-table-column prop="createTime" label="更新时间" width="180px">
          <!-- <template slot-scope="scope">{{ scope.row.createTime | timestampToTime }}</template> -->
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="checkBtnClick(scope.row)" type="text" size="small">查看</el-button>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="saveCurrentItemData('editor',scope.row)">修改</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button @click="obsoleteBtnClick(scope.row)" type="text" size="small" disabled>作废</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="signData.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="signData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      signData: {
        //搜索
        searchKey: "",
        //开始时间
        createTimeBegin: "",
        //结束时间
        createTimeEnd: "",
        //当前页数
        pageIndex: 1,
        //每页要显示的数据条数,默认10条
        pageSize: 10
      },
      //表格数据源
      tableData: [{ orderSn: 1 }],
      //总条数
      totalCount: 1
    };
  },
  filters: {},
  mounted() {
    //得到发货单列表数据
    this.getSendOrderTableData();
  },
  methods: {
    getSendOrderTableData() {},

    //查询
    searchFormData() {
      this.signData.pageIndex = 1;
      this.getSendOrderTableData();
      console.log("searchFormData---");
    },
    //重置
    resetFormData(ruleForm) {
      console.log("resetForm----");
      this.$refs[ruleForm].resetFields();
    },

    //新增Btn的点击事件
    addBtnClickEvent() {
      console.log("addBtnClick---");
      this.$router.push({
        path: "/OS/ditchStore/store_add"
      });
    },

    //查看Btn的点击事件
    checkBtnClick(row) {
      this.$router.push({
        path: "/OS/ditchStore/store_check",
        query: {
          orderSn: row.orderSn
        }
      });
    },
    //修改Btn的点击事件
    editorBtnClick(row) {
      console.log("editorBtnClick---");
      this.$router.push({
        path: "/OS/ditchStore/store_editor",
        query: {
          orderSn: row.orderSn
        }
      });
    },
    handleCommand(data) {
      console.log(data);
      switch (data.editor) {
        case "editor":
          //修改按钮事件
          this.editorBtnClick(data.row);
          break;
      }
    },
    saveCurrentItemData(editor, row) {
      return {
        editor,
        row
      };
    },
    //每页条数改变时
    handleSizeChange(page) {
      this.signData.pageSize = page;
      this.getSendOrderTableData();
    },
    //当前页改变时
    handleCurrentChange(page) {
      this.signData.pageIndex = page;
      this.getSendOrderTableData();
    }
  }
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
.search_div {
  background-color: #fff;
  padding-top: 20px;
  margin: 0 10px;
}
.table_div {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
}
.pagination {
  margin-top: 20px;
  padding-bottom: 10px;
  margin-right: 20px;
  text-align: right;
}
</style>