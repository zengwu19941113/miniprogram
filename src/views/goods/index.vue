<template>
  <div class="app-container">
    <el-card class="box-card">
        <el-col>
      <el-form :model="search" label-width="100px">
        <el-col :span="8">
          <el-form-item label="品牌：">
            <el-input v-model="search.brandName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品名称：">
            <el-input
              v-model="search.goodsName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="el-col-search-btn">
          <el-button type="primary" plain>查询</el-button>
          <el-button type="danger" plain>重置</el-button>
        </el-col>
      </el-form>
    </el-col>
      <el-col>
        <el-col class="el-col-operation-btn">
          <el-button type="primary" plain @click="addClass">添加商品</el-button>
        </el-col>
        <el-col>
          <el-table
            v-loading="listLoading"
            :data="tableList"
            element-loading-text="Loading"
            border
            fit
            stripe
            highlight-current-row
          >
            <el-table-column
              align="center"
              width="55"
              type="index"
              label="序号"
            >
            </el-table-column>
            <el-table-column label="品牌名称" prop="brandName">
            </el-table-column>
            <el-table-column label="商品名称" prop="goodsName">
            </el-table-column>
             <el-table-column label="商品库存" prop="goodsStock">
            </el-table-column>
            <el-table-column label="商品售价" prop="goodsPrice">
            </el-table-column>
            <el-table-column label="状态" prop="status">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="createTime"
              label="创建时间"
            >
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="240">
              <template slot-scope="scope">
                <el-button
                  @click="updateClass(scope.row)"
                  type="primary"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  @click="deleteClass(scope.row)"
                  type="danger"
                  size="mini"
                  >删除</el-button
                >
                <el-button
                  @click="deleteClass(scope.row)"
                  type="success"
                  size="mini"
                  v-if="scope.row.status == '0'"
                  >上架</el-button
                >
                <el-button
                  @click="deleteClass(scope.row)"
                  type="warning"
                  size="mini"
                  v-if="scope.row.status == '1'"
                  >下架</el-button
                >
              </template>
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
      </el-col>
    </el-card>
    <!-- dialog -->
    <edit-goods
      :isShowDialog="isShowDialog"
      :title-text="titleText"
      :editType="editType"
      :parent-model="parentModel"
      ref="editGoods"
      @child-operation="editGoods"
    >
    </edit-goods>
  </div>
</template>

<script>
import editGoods from "./editGoods";
export default {
  components: {
    editGoods,
  },
  data() {
    return {
      currentPage: 1,
      page: 1,
      rows: 10,
      total: 0,
      tableList: [{ oid: "1", goodsName: "123", goodsDesc: "456" ,status:'1'}],
      listLoading: false,
      isShowDialog: false,
      titleText: "",
      editType: "",
      parentModel: {},
      search:{}
    };
  },
  created() {
    //加载分类列表
    this.findGoodsList();
  },
  methods: {
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.rows = val;
      this.findGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = 1;
      this.findGoodsList();
    },
    //获取商品列表
    findGoodsList: function () {
      this.listLoading = true;
      let baseUrl = "/miniprogram/goods/selectList?page="+this.page+"&rows="+this.rows;
      this.$get(baseUrl)
        .then((res) => {
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error("商品加载失败！");
        });
    },
    //添加商品
    addGoods: function () {
      //一级节点(root)
      this.titleText = "新增商品";
      this.editType = "add";
      this.isShowDialog = true;
    },
    //编辑分类
    updateGoods: function (row) {
      console.log(row);
      this.titleText = "编辑商品";
      this.editType = "update";
      this.parentModel = row;
      this.isShowDialog = true;
    },
    //删除分类
    deleteGoods: function (row) {
      console.log(row);
      this.$confirm("此操作将删除对应商品并下架, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let baseUrl = "/miniprogram/goods/delete";
          this.listLoading = true;
          this.$post(baseUrl, row)
            .then((res) => {
              this.listLoading = false;
              //刷新数据
              this.findGoodsList();
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {
          return;
        });
    },
    //对话框内的点击事件
    editGoods: function (type) {
      if (type == "save") {
        //点击确认要执行的代码
        this.$refs.editGoods.submitForm();
      } else if (type == "cancel") {
        //点击取消要执行的代码
        this.$refs.editGoods.resetForm();
        this.isShowDialog = false;
      } else if (type == "refresh") {
        //点击取消要执行的代码
        this.$refs.editGoods.resetForm();
        this.isShowDialog = false;
        this.findGoodsList();
      }
    },
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
