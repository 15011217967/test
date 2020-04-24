<template>
  <div class="role_list_wrapper">
    <!--table  -->
    <div class="item-margin">
      <div class="item-table">
        <div class="item-cont">
          <el-button-group>
            <el-button size="small" type="primary" @click="openAddClass()">添加海报</el-button>
          </el-button-group>
        </div>
        <el-table
          :data="tableListData"
          stripe
          empty-text="暂无数据"
          header-align="center"
          header-row-class-name="item-table-header"
          :highlight-current-row="true"
        >
          <!-- <el-table-column type="selection" width="100"></el-table-column> -->
          <el-table-column prop="code" align="left" label="海报ID" min-width="150">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column prop="name" align="left" label="预览图" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.image" class="imageSize" alt />
            </template>
          </el-table-column>
          <el-table-column prop="type" align="left" label="排序" min-width="100">
            <template slot-scope="scope">{{scope.row.sort}}</template>
          </el-table-column>

          <el-table-column prop="createTime" align="left" label="上传时间" min-width="100">
            <template slot-scope="scope">{{scope.row.updateTime|timestampToTime}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label-class-name="text-left"
            class-name="text-left"
            align="left"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button @click="openEditDetails(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteItem(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-10 mb-20">
          <el-pagination
            class="mr-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="filtersData.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="filtersData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import codeSet from "@/components/codeSet";
import treeDept from "@/components/treeDept";
import { filter } from "minimatch";
import { get } from "http";

let token = getToken();
/**
 * 基本管理
 */
export default {
  name:'market_poster_list',
  data() {
    return {
      filtersData: {
        pageIndex: 1, //当前页码
        pageSize: 10 //每页数量
      },
      tableListData: [],
      total: 0,
      cateOptions: [],
      itemStautsParam: {
        type: "add",
        title: "新增",
        id: ""
      }
    };
  },
  created() {
    this.getTableList();
  },
  activated() {
    this.getTableList();
  },
  methods: {
    //获取列表
    getTableList() {
      this.request(this.api.market.market_list, this.filtersData).then(res => {
        // console.log(res);
        let _data = res.data;
        this.tableListData = _data;
        this.total = res.totalCount;
      });
    },
    deleteItem(val) {
      let self = this;
      self
        .$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self
            .request(self.api.market.market_delete, { ids: val.id })
            .then(data => {
              self.getTableList();
              self.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {});
    },

    // //修改基本信息
    openEditDetails(id) {
      this.$router.push({
        path: "/market/poster/market_poster_details",
        query: {
          id: id,
          type: "edit"
        }
      });
    },
    openAddClass() {
      this.$router.push({
        path: "/market/poster/market_poster_details",
        query: {
          type: "add"
        }
      });
    },

    //当前页数修改时发生改变
    handleCurrentChange(val) {
      this.filtersData.pageIndex = val;
      this.getTableList();
    },
    // 每页显示多少条时发生改变
    handleSizeChange(val) {
      this.filtersData.pageSize = val;
      this.getTableList();
    },
    //滑块开关
    switchValid(params) {
      this.request(this.api.user.role_save, params).then(data => {});
    }
  }
};
</script>

<style scoped>
.role_list_wrapper {
  margin-top: 8px;
}
.imageSize {
  width: 40px;
  height: 40px;
}
</style>