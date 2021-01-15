<template>
  <div class="app-container">
    <el-col :span="6">
      <el-col>
        <el-input
          v-model="keywords"
          placeholder="请输入"
          suffix-icon="el-icon-search"
        ></el-input>
      </el-col>
      <el-col>
        <el-tree
          :data="treeList"
          :props="defaultProps"
           highlight-current
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
    </el-col>
    <el-col :span="17" :offset="1">
      <el-col class="el-col-operation-btn">
        <el-button type="primary" plain @click="addClass">添加分类</el-button>
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
          <el-table-column align="center" width="55" type="index" label="序号">
          </el-table-column>
          <el-table-column label="名称" prop="className"> </el-table-column>
          <el-table-column label="编码" prop="classCode"> </el-table-column>
          <el-table-column label="描述" prop="classDesc"> </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
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
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-col>
    <!-- dialog -->
    <edit-class
      :isShowDialog="isShowDialog"
      :title-text="titleText"
      :editType='editType'
      :parent-model='parentModel'
      ref="editClass"
      @child-operation="editClass"
    >
    </edit-class>
  </div>
</template>

<script>
import editClass from "./editClass";
export default {
  components: {
    editClass,
  },
  data() {
    return {
      list: [{ oid: "1", className: "123", classCode: "456" }],
      listLoading: false,
      keywords: "",
      isShowDialog: false,
      titleText: "",
      editType:'',
      parentModel:{},
      treeList: [
        {
          oid: "root",
          label: "全部",
          level: 1,
          children: [
            {
              label: "一级 1",
              children: [
                {
                  label: "二级 1-1",
                  children: [
                    {
                      label: "三级 1-1-1",
                    },
                  ],
                },
              ],
            },
            {
              label: "一级 2",
              children: [
                {
                  label: "二级 2-1",
                  children: [
                    {
                      label: "三级 2-1-1",
                    },
                  ],
                },
                {
                  label: "二级 2-2",
                  children: [
                    {
                      label: "三级 2-2-1",
                    },
                  ],
                },
              ],
            },
            {
              label: "一级 3",
              children: [
                {
                  label: "二级 3-1",
                  children: [
                    {
                      label: "三级 3-1-1",
                    },
                  ],
                },
                {
                  label: "二级 3-2",
                  children: [
                    {
                      label: "三级 3-2-1",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      curNode: null,
    };
  },
  created() {
    //加载分类列表
    this.findGoodsClass();
  },
  methods: {
    //获取分类列表
    findGoodsClass: function () {
      this.listLoading = true;
      let baseUrl = "/miniprogram/goodsClass/selectList";
      this.$get(baseUrl).then((res) => { this.listLoading = false;
          //debugger
          if (res && res.length>0) {
              
          }
        }).catch((err) => {
          this.listLoading = false;
          this.$message.error("商品分类加载失败！");
        });
    },
    //添加分类
    addClass: function () {
      if (!this.curNode) {
        this.$message.error("请先选择节点！");
        return;
      }
      if (this.curNode.level == "1") {
        //一级节点(root)
        this.titleText = "新增分类";
        this.editType = 'add';
        this.parentModel = this.curNode;
        this.isShowDialog = true;
      } else {
        //其他级别的节点
      }
    },
    //编辑分类
    updateClass: function (row) {
        console.log(row);
        this.titleText = "编辑分类";
        this.editType = 'update';
        this.parentModel = row;
        this.isShowDialog = true;
    },
    //删除分类
    deleteClass: function (row) {
      console.log(row);
    },
    //树节点点击事件
    handleNodeClick: function (node) {
      console.log(node);
      this.curNode = node;
    },
    //对话框内的点击事件
    editClass:function(type) {
      if (type == "save") {
        //点击确认要执行的代码
        this.$refs.editClass.submitForm();
      } else if (type == "cancel") {
          //点击取消要执行的代码
        this.$refs.editClass.resetForm();
        this.isShowDialog = false;
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
