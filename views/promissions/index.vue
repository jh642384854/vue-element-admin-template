<template>
  <div class="app-container">
    <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">
        <el-form-item label="账户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="状态" prop="ustatus">
          <el-radio-group v-model="ruleForm.ustatus">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input  type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="活动性质">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="ruleForm.roles">
            <el-checkbox label="1" name="roles">超管</el-checkbox>
            <el-checkbox label="2" name="roles">编辑</el-checkbox>
            <el-checkbox label="3" name="roles">客服</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm:{
        email: '',
        username: '',
        password: '',
        ustatus: '',
        roles: [],
        type: []
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        username: [{ required: true, message: '账户名必须填写', trigger: 'blur' }],
        password: [{ required: true, message: '密码必须填写', trigger: 'blur' }],
        ustatus: [{ required: true, message: '用户状态必须选择', trigger: 'change' }],
        roles: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }],
        type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ]
      },
    }
  },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}  
</script>