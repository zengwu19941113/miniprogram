<template>
  <div class="app-container">
    <el-col>
      <el-form :model="search" label-width="120px">
        <el-col :span="8">
          <el-form-item label="角色名称：">
            <el-input v-model="search.userName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色编码：">
            <el-input v-model="search.userAccount" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="el-col-search-btn">
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
        highlight-current-row
      >
        <el-table-column align="center" width="55" type="selection"></el-table-column>
        <el-table-column label="角色名称" prop="userName"> </el-table-column>
        <el-table-column label="角色编码" align="center" prop="userAccount"></el-table-column>
        <el-table-column label="角色描述" align="center" prop="email"> </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
export default {
  filters: {},
  data() {
    return {
      list: [
        {
          oid: "1",
          userName: "管理员",
          userAccount: "admin",
          email: "123@qq.com",
          phone: "15655555888",
          createTime: "2020-01-12 20:21:25",
        },
      ],
      listLoading: true,
      search: {},
    };
  },
  created() {
    this.listLoading = false;
  },
  methods: {},
};
</script>
<style scoped>
.el-col-search-btn{
  text-align: right;
}
.el-col-operation-btn{
   margin-bottom: 1%;
}
</style>
