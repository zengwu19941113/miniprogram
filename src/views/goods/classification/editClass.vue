<template>
  <el-dialog
    :title="titleText"
    :visible.sync="showDialog"
    width="30%"
    @close="childOperation('cancel')"
  >
    <el-form :model="model" label-width="100px" :rules="rules" ref="ruleForm">
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
      <el-form-item label="分类描述：">
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
      type: String
    },
    editType:{
      type:String
    },
    parentModel:{
      type:Object,
      default:function(){
        return {};
      }
    }
  },
  data() {
    return {
      showDialog: this.isShowDialog,
      model: {
        className: "",
        classCode: "",
        classDesc: "",
      },
      codeEnable:false,
      parentNode:{},
      type:'',
      rules: {
        className: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        classCode: [
          { required: true, message: "请输入分类编码", trigger: "blur" },
        ],
      },
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
          alert(this.type+"表单提交!");
        } else {
          this.$message.error("请合法填写表单信息！");
          return false;
        }
      });
    },
    //重置
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.codeEnable = false
    },
    childOperation(operation) {
      this.$emit("child-operation", operation);
    },
  },
  watch: {
    isShowDialog(val) {
      this.showDialog = val; //②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    editType(val){
      this.type = val;
      if(this.type == 'update'){
        this.codeEnable = true;
      }
    },
    parentModel: {
　　　　handler(val) {
　　　　　　this.parentNode = val;
　　　　},
　　　　deep: true
　　}
  },
};
</script>
 
<style scoped>
</style>