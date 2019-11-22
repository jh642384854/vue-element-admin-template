<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="postForm" :rules="rules" label-width="100px">
      <el-form-item label="邮件服务器" prop="mail_server">
        <el-input v-model="postForm.mail_server"></el-input>
      </el-form-item>
      <el-form-item label="发送端口" prop="mail_port">
        <el-input v-model.number="postForm.mail_port"></el-input>
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
            <el-input v-model="postForm.receive_email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="testSendEmail()">{{ testSendEmailButtonText }}</el-button>
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
import cryptoJs from 'crypto-js'
import { fetchEmailConfig,saveEmailConfig,testSendEmail } from '@/api/settings' 
let encodekey = 'IiKo8bmJV8PTA8kR'
let _this
export default {
  name:"emailSettings",
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true,
      testSendEmailButtonText:'测试发送',
      postForm: {
        mail_server:'',
        mail_port:'',
        send_user:'',
        send_pwd:'',
        receive_email: ''
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
        if(response.data.results != ''){
          this.postForm = JSON.parse(response.data.results)
          this.postForm.send_pwd = this.decodePass(this.postForm.send_pwd)
        }
        this.listLoading = false
      })
    },
    testSendEmail(){
      let emailReg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
      if(this.postForm.receive_email != ""){
        if(emailReg.test(this.postForm.receive_email)){
          const tempData = Object.assign({}, this.postForm)
          //将端口转换为数字类型
          tempData.mail_port = parseInt(tempData.mail_port)
          //加密邮件发送的密码
          tempData.send_pwd = this.encodePass(this.postForm.send_pwd)
          this.testSendEmailButtonText = '正在发送邮件，请稍后...'
          testSendEmail(tempData).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
            this.testSendEmailButtonText = '测试发送'
          })
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
          const tempData = Object.assign({}, this.postForm)
          //删除测试发送邮件的地址
          delete tempData.receive_email
          //加密邮件发送的密码
          tempData.send_pwd = this.encodePass(this.postForm.send_pwd)
          //将json对象转换为字符串
          let data = {config_value : JSON.stringify(tempData)}
          saveEmailConfig(data).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        }
      })
    },
    encodePass(beEncryptedString){
      let key = cryptoJs.enc.Utf8.parse(encodekey)
      let enc = ''
      if (typeof beEncryptedString === 'string') {
        enc = cryptoJs.AES.encrypt(beEncryptedString, key, {
          iv: cryptoJs.enc.Utf8.parse(encodekey.substr(0,16)),
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7
        })
      } else if (typeof beEncryptedString === 'object') {
        let data = JSON.stringify(beEncryptedString)
        enc = cryptoJs.AES.encrypt(data, key, {
          iv: cryptoJs.enc.Utf8.parse(encodekey.substr(0,16)),
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7
        })
      }
      let encResult = enc.toString()
      return encResult
    },
    decodePass(encodeStr){
      let key = cryptoJs.enc.Utf8.parse(encodekey)
      let dec = cryptoJs.AES.decrypt(encodeStr, key, {
          iv: cryptoJs.enc.Utf8.parse(encodekey.substr(0,16)),
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7
      })
      let decData = cryptoJs.enc.Utf8.stringify(dec)
      return decData
    }
  }
}
</script>