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
          :expand-on-click-node="false"
          highlight-current
          default-expand-all
          node-key="oid"
          ref="treeBox"
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
          :data="tableList"
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
      :editType="editType"
      :parent-model="parentModel"
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
      tableList: [{ oid: "1", className: "123", classCode: "456" }],
      listLoading: false,
      keywords: "",
      isShowDialog: false,
      titleText: "",
      editType: "",
      parentModel: {},
      treeList: [
        {
          oid: "root",
          label: "全部",
          level: 1,
          children: [],
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
      this.$get(baseUrl)
        .then((res) => {
          this.listLoading = false;
          this.treeList = [];
          let level = 1;
          //初始化根节点
          let rootNode = {
            oid: "root",
            className: "全部",
            classCode: "root",
            label: "全部",
            level: level,
            children: [],
          };
          if (res && res.length > 0) {
            //组装下级节点
            let length = res.length;
            this.iteratirAssignNode(rootNode, rootNode, res, length, level);
          }
          //设置根节点
          this.treeList.push(rootNode);
          //加载表格默认数据
          this.handleNodeClick(rootNode);
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error("商品分类加载失败！");
        });
    },
    //递归组装下级树节点
    iteratirAssignNode: function (
      parentNode,
      parentModel,
      dataList,
      length,
      level
    ) {
      level++;
      for (let i = 0; i < length; i++) {
        let tmpModel = dataList[i];
        //编码一直
        if (tmpModel.parentCode == parentModel.classCode) {
          let nextNode = {};
          nextNode.label = tmpModel.className;
          nextNode.level = level;
          nextNode.children = [];
          //属性复制
          Object.assign(nextNode, tmpModel);
          //组装下级节点
          this.iteratirAssignNode(nextNode, tmpModel, dataList, length, level);
          //放入root节点下
          parentNode.children.push(nextNode);
        }
      }
    },
    //根据父级编码获取下级
    findNextClassNode: function (parentCode) {
      this.listLoading = true;
      let baseUrl =
        "/miniprogram/goodsClass/selectList?parentCode=" + parentCode;
      this.$get(baseUrl)
        .then((res) => {
          this.listLoading = false;
          this.tableList = res;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error("下级分类加载失败！");
        });
    },
    //添加分类
    addClass: function () {
      if (!this.curNode) {
        this.$message.error("请先选择节点！");
        return;
      }
      //一级节点(root)
      this.titleText = "新增分类";
      this.editType = "add";
      this.parentModel = this.curNode;
      this.isShowDialog = true;
    },
    //编辑分类
    updateClass: function (row) {
      console.log(row);
      this.titleText = "编辑分类";
      this.editType = "update";
      this.parentModel = row;
      this.isShowDialog = true;
    },
    //删除分类
    deleteClass: function (row) {
      console.log(row);
      this.$confirm("此操作将删除当前分类及其下所有子分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          let baseUrl = "/miniprogram/goodsClass/delete";
          this.listLoading = true;
          this.$post(baseUrl,row)
            .then((res) => {
              this.listLoading = false;
              //刷新数据
              this.findGoodsClass();
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error("删除失败！");
            });
        }).catch(() => {
          return;
        });
    },
    //树节点点击事件
    handleNodeClick: function (node) {
      console.log(node);
      this.curNode = node;
      //刷新右侧表格
      this.findNextClassNode(this.curNode.classCode);
    },
    //对话框内的点击事件
    editClass: function (type) {
      if (type == "save") {
        //点击确认要执行的代码
        this.$refs.editClass.submitForm();
      } else if (type == "cancel") {
        //点击取消要执行的代码
        this.$refs.editClass.resetForm();
        this.isShowDialog = false;
      } else if (type == "refresh") {
        //点击取消要执行的代码
        this.$refs.editClass.resetForm();
        this.isShowDialog = false;
        this.findGoodsClass();
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
