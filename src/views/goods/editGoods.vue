<template>
  <el-dialog
    :title="titleText"
    :visible.sync="showDialog"
    width="30%"
    @close="childOperation('cancel')"
  >
    <el-form :model="model" label-width="100px" :rules="rules" ref="ruleForm" v-loading="loading">
      <el-form-item label="分类名称：" prop="className">
        <el-input
          v-model="model.className"
          placeholder="请输入"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="分类编码：" prop="classCode">
        <el-input
          v-model="model.classCode"
          placeholder="请输入"
          maxlength="30"
          show-word-limit
          :disabled="codeEnable"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类描述：" prop="classDesc">
        <el-input
          v-model="model.classDesc"
          placeholder="请输入"
          type="textarea"
          rows="4"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="childOperation('cancel')">取消</el-button>
      <el-button type="primary" @click="childOperation('save')">保存</el-button>
    </span>
  </el-dialog>
</template>
 
<script>
export default {
  name: "confirmDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: true,
    },
    titleText: {
      type: String,
    },
    editType: {
      type: String,
    },
    parentModel: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    //校验编码
    var validateClassCode =  (rule, value, callback)=> {
      if (!value) {
        callback(new Error("请输入分类编码"));
      } else {
        this.findByClassCode(value).then((res) => {
          if (this.type == "add") {
            if (res && res.length > 0) {
              callback(new Error("分类编码已存在！"));
            }
          }
          callback();
        });
      }
    };
    return {
      loading:false,
      showDialog: this.isShowDialog,
      model: {
        className: "",
        classCode: "",
        classDesc: "",
      },
      codeEnable: false,
      parentNode: {},
      type: "",
      rules: {
        className: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        classCode: [{ validator: validateClassCode, trigger: "blur" }],
      }
    };
  },
  created() {
    console.log(this.isShowDialog);
  },
  methods: {
    //提交
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //添加分类
          if (this.type == "add") {
            this.addGoodsClass();
          } else if (this.type == "update") {
            this.updateGoodClass();
          }
        } else {
          this.$message.error("请合法填写表单信息！");
          return false;
        }
      });
    },
    //添加产品分类
    addGoodsClass: function () {
      if(this.parentNode){
        this.model.parentName = this.parentNode.className;
        this.model.parentCode = this.parentNode.classCode;
      }
      this.loading = true;
      this.$post("/miniprogram/goodsClass/add",this.model).then((res) => {
          this.loading = false;
          this.$message.success("保存成功！");
          //刷新上级页面
          this.childOperation('refresh');
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("保存失败！");
        });
    },
    //更新产品分类
    updateGoodClass: function () {
      this.$post("/miniprogram/goodsClass/update",this.model).then((res) => {
          this.loading = false;
          this.$message.success("保存成功！");
           //刷新上级页面
          this.childOperation('refresh');
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("保存失败！");
        });
    },
    //重置
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    childOperation(operation) {
      this.$emit("child-operation", operation);
    },
    findByClassCode: function (classCode) {
      var _this = this
      return new Promise(function (resolve, reject) {
        _this.loading = true;
        _this.$get( "/miniprogram/goodsClass/selectByClassCode?classCode=" + classCode).then((res) => {
            _this.loading = false;
            resolve(res);
          }).catch((err) =>  {
             _this.loading = false;
            reject(err);
          });
      });
    },
  },
  watch: {
    isShowDialog(val) {
      this.showDialog = val; //②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    editType(val) {
      this.type = val;
      if (this.type == "update") {
        this.codeEnable = true;
      } else {
        this.codeEnable = false;
      }
    },
    parentModel: {
      handler(val) {
        this.parentNode = val;
        if(this.type =='update'){
          Object.assign(this.model,this.parentModel);
        }
      },
      deep: true,
    },
  },
};
</script>
 
<style scoped>
</style>