<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="postForm" :rules="rules" label-width="100px">
      <el-form-item label="邮件服务器" prop="mail_server">
        <el-input v-model="postForm.mail_server"></el-input>
      </el-form-item>
      <el-form-item label="发送端口" prop="mail_port">
        <el-input v-model="postForm.mail_port"></el-input>
      </el-form-item>
      <el-form-item label="发件人地址" prop="send_user">
        <el-input v-model="postForm.send_user" width="150px"></el-input>
      </el-form-item>
      <el-form-item label="验证密码" prop="send_pwd">
        <el-input v-model="postForm.send_pwd" show-password></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="测试放送">
            <el-input v-model="test_email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="testSendEmail()">测试发送</el-button>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary" @click="saveData()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
// import XEUtils from 'xe-utils'

import { fetchEmailConfig,saveEmailConfig } from '@/api/settings'

import Pagination from '@/components/Pagination'  

let _this
export default {
  name:"links",
  components: { Pagination },
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true,
      test_email:'',
      postForm: {
        mail_server:'',
        mail_port:'',
        send_user:'',
        send_pwd:''
      },
      rules:{
        mail_server: [{ required: true, message: '邮件服务器必须填写', trigger: 'blur' }],
        mail_port: [{ required: true, message: '发送端口必须填写', trigger: 'blur' }],
        send_user: [{ required: true, type:'email', message: '发件人地址必须填写', trigger: 'blur' }],
        send_pwd: [{ required: true, message: '验证密码必须填写', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchEmailConfig().then(response => {
        this.postForm = response.data.results
        this.listLoading = false
      })
    },
    testSendEmail(){
      let emailReg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
      if(this.test_email != ""){
        if(emailReg.test(this.test_email)){
          console.log('test send email')
        }else{
          this.$message.error('请输入合法的邮件地址')
        }
      }else{
        this.$message.error('请输入要测试发送的邮件地址')
      }
    },
    saveData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveEmailConfig(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>