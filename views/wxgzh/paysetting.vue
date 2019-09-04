<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="微信支付商户号" prop="wxmid">
            <el-input v-model="postForm.wxmid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="tips"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="APPID" prop="wxpayappid">
            <el-input v-model="postForm.wxpayappid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="tips"></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="API密钥" prop="apikey">
            <el-input v-model="postForm.apikey"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="tips"></el-col>
      </el-row>
      <el-form-item label="cert_pem证书" prop="certpemfile">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          :auto-upload="false"
          :action="GLOBAL.UploadAttachmentUrl">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">(apiclient_cert.pem 现金红包，订单退款和企业付款必须)</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="key_pem证书" prop="keypemfile">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          :auto-upload="false"
          :action="GLOBAL.UploadAttachmentUrl">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">(apiclient_key.pem 现金红包，订单退款和企业付款必须)</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
// import XEUtils from 'xe-utils'
import { createWxgzhSetting,updateWxgzhSetting,getOneWxgzhSetting } from '@/api/weixin'

let _this
const defaultForm = {
  id: undefined,
  wxgzhid:'',
  wxmid:'',
  wxpayappid:'',
  apikey: '', 
  certpemfile: '', 
  keypemfile: ''
}
export default {
  name:"WxPaySetting",
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      disableEditoriginalID:false,
      postForm: Object.assign({}, defaultForm),
      rules:{
        wxmid: [{ required: true, message: '微信支付商户号必须选择', trigger: 'blur' }],
        wxpayappid: [{ required: true, message: 'APPID必须填写', trigger: 'blur' }],
        apikey: [{ required: true, message: 'API密钥必须填写', trigger: 'blur' }],
        certpemfile: [{ required: true, type:'url', message: 'cert_pem证书必须上传', trigger: 'blur' }],
        keypemfile: [{ required: true, message: 'key_pem证书必须上传', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {

    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            updateWxgzhSetting(this.postForm).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.GLOBAL.msgNotify('success','成功',response.data.msg)
              }else{
                this.GLOBAL.msgNotify('error','失败',response.data.msg)
              }
            })
          }else{
            createWxgzhSetting(this.postForm).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.GLOBAL.msgNotify('success','成功',response.data.msg)
                this.$router.push({ path: '/wxgzh/list' })
              }else{
                this.GLOBAL.msgNotify('error','失败',response.data.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>