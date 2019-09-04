<!-- 微信公众号配置 -->
<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="公众号类型" prop="gzhtype">
            <el-select v-model="postForm.gzhtype" placeholder="请选择">
              <el-option
                v-for="item in GLOBAL.WxGzhType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
          请正确选择，公众号类型对应的接口如果没有权限，相关的功能将不显示
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="公众号名称" prop="name">
            <el-input v-model="postForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="公众号原始ID" prop="originalID">
            <el-input v-model="postForm.originalID" :disabled="disableEditoriginalID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         请正确填写，保存后不能再修改，且无法接收到微信的信息
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="AppID" prop="appid">
            <el-input v-model="postForm.appid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         开发者ID是公众号开发识别码，配合开发者密码可调用公众号的接口能力。
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="AppSecret" prop="appsecret">
            <el-input type="password" v-model="postForm.appsecret"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         开发者密码是校验公众号开发者身份的密码，具有极高的安全性。切记勿把密码直接交给第三方开发者或直接存储在代码中。如需第三方代开发公众号，请使用授权方式接入。
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="Url" prop="url">
            <el-input v-model="postForm.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         必须以http://或https://开头，分别支持80端口和443端口。
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="Token" prop="token">
            <el-input v-model="postForm.token"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         必须为英文或数字，长度为3-32字符。
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="EncodingAESKey" prop="aeskey">
            <el-input v-model="postForm.aeskey"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="tips">
         消息加密密钥由43位字符组成，可随机修改，字符范围为A-Z，a-z，0-9。
        </el-col>
      </el-row>
      <el-form-item label="消息加密方式" prop="encodeType">
        <el-radio-group v-model="postForm.encodeType">
          <el-radio v-for="item in GLOBAL.WxGzhEncodeType" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="postForm.description"></el-input>
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
  gzhtype:'',
  name:'',
  originalID: '', 
  appid: '', 
  appsecret: '', 
  url: '', 
  token: '',
  aeskey: '',
  encodeType: '',
  description: '',
}
export default {
  name:"WxSettingForm",
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      disableEditoriginalID:false,
      postForm: Object.assign({}, defaultForm),
      rules:{
        gzhtype: [{ required: true, message: '公众号类型必须选择', trigger: 'blur' }],
        name: [{ required: true, message: '公众号名称必须填写', trigger: 'blur' }],
        originalID: [{ required: true, message: '公众号原始ID必须填写', trigger: 'blur' }],
        appid: [{ required: true, message: '公众号APPID必须填写', trigger: 'blur' }],
        appsecret: [{ required: true, message: '公众号APPSecret必须填写', trigger: 'blur' }],
        url: [{ required: true, type:'url', message: '开发URL必须填写', trigger: 'blur' }],
        token: [{ required: true, message: 'Token必须填写', trigger: 'blur' }],
        aeskey: [{ required: true, message: 'EncodingAESKey必须填写', trigger: 'blur' }],
        encodeType: [{ required: true, message: '加密类型必须选择', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.isEdit) {
        this.disableEditoriginalID = true
        const id = this.$route.params && this.$route.params.id
        this.getSignleWxgzhData(id)
      }
    },
    getSignleWxgzhData(id){
      getOneWxgzhSetting({"id":id}).then(response=>{
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            updateWxgzhSetting(this.postForm).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.GLOBAL.msgNotify('success','成功',response.data.msg)
                this.$router.push({ path: '/wxgzh/list' })
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

<style>
.tips{ font-size: 12px; color: #666 }
</style>