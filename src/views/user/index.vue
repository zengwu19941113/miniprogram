<template>
  <div class="app-container">
    <el-col>
      <el-form :model="search" label-width="80px">
        <el-col :span="8">
          <el-form-item label="用户名：">
            <el-input v-model="search.userName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账号：">
            <el-input
              v-model="search.userAccount"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱：">
            <el-input v-model="search.email" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：">
            <el-input v-model="search.userName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="8" class="el-col-search-btn">
          <el-button type="primary" plain>查询</el-button>
          <el-button type="danger" plain>重置</el-button>
        </el-col>
      </el-form>
    </el-col>
    <el-col class="el-col-operation-btn">
      <el-button type="primary" plain>添加用戶</el-button>
      <el-button type="danger" plain>批量删除</el-button>
    </el-col>
    <el-col>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
      >
        <el-table-column align="center" width="55" type="selection">
        </el-table-column>
        <el-table-column label="用户名" prop="userName"> </el-table-column>
        <el-table-column label="账号" prop="userAccount"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column class-name="status-col" label="手机号" prop="phone">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="注册时间"
          width="200"
        >
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="el-col-pag">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
import func from "vue-temp/vue-editor-bridge";
export default {
  filters: {},
  data() {
    return {
      currentPage: 1,
      page: 1,
      rows: 10,
      total: 0,
      list: [],
      listLoading: false,
      search: {},
    };
  },
  created() {
    //加载用户列表
    this.findUserList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //获取用户列表
    findUserList: function () {
      this.listLoading = true;
      let baseUrl = "/miniprogram/user/selectPage?page=" + this.page + "&rows=" + this.rows;
      if(search.userName){
        baseUrl = baseUrl.concat('&userName=',search.userName);
      }
      if(search.userAccount){
        baseUrl = baseUrl.concat('&userAccount=',search.userAccount);
      }
      if(search.email){
        baseUrl = baseUrl.concat('&email=',search.email);
      }
      if(search.phone){
        baseUrl = baseUrl.concat('&phone=',search.phone);
      }
      this.$get(baseUrl).then((res) => {
          this.listLoading = false;
          if (res) {
            this.list = res.list;
            this.total = res.total;
          }
        }).catch((err) => {
          this.listLoading = false;
          this.$message.error("用户信息加载失败！");
        });
    }
  },
};
</script>
<style scoped>
.el-col-search-btn {
  text-align: right;
}
.el-col-operation-btn {
  margin-bottom: 1%;
}
.el-col-pag {
  text-align: right;
  margin-top: 1%;
}
</style>
