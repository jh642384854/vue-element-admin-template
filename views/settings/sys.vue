<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="postForm" :rules="rules" label-width="100px">
      <el-form-item label="网站名称" prop="sitename">
        <el-input v-model="postForm.sitename"></el-input>
      </el-form-item>
      <el-form-item label="网站地址" prop="siteurl">
        <el-input v-model="postForm.siteurl"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系电话" prop="telphone">
            <el-input v-model="postForm.telphone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="postForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系QQ" prop="qq">
            <el-input v-model="postForm.qq"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="微信号" prop="wx_number">
            <el-input v-model="postForm.wx_number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客服电话" prop="custom_tel">
            <el-input v-model="postForm.custom_tel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备案号" prop="icp_number">
            <el-input v-model="postForm.icp_number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="SEO标题" prop="site_seo_title">
        <el-input v-model="postForm.site_seo_title"></el-input>
      </el-form-item>
      <el-form-item label="SEO关键字" prop="site_seo_keywords">
        <el-input v-model="postForm.site_seo_keywords"></el-input>
      </el-form-item>
      <el-form-item label="SEO描述" prop="site_seo_description">
        <el-input type="textarea" v-model="postForm.site_seo_description"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="附件上传大小" prop="upload_file_limit_size" >
            <el-input-number v-model="postForm.upload_file_limit_size" :min="1" :max="20"></el-input-number>
            <span>单位M</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="附件上传类型" prop="upload_file_suffix" >
            <el-input v-model="postForm.upload_file_suffix"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="网站LOGO" prop="site_logo">
        <el-upload
          class="thumb-uploader"
          ref="upload"
          :accept="GLOBAL.AllowImageSuffix"
          :action="GLOBAL.UploadAttachmentUrl"
          list-type="picture"
          :auto-upload="false"
          :show-file-list="false"
          :on-success="handleThumbSuccess"
          :on-change="imgPreview">
          <img v-if="postForm.site_logo" :src="postForm.site_logo" class="thumb">
          <i v-else class="el-icon-plus thumb-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">{{ GLOBAL.ImageUploadTips }}</div>
        </el-upload>
      </el-form-item>
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

import { fetchSysConfig,saveSysConfig } from '@/api/settings'

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
      hasSelectFileUpload:false,  //用户是否选择了新上传文件
      listLoading:true,
      postForm: {
        sitename:'',
        siteurl:'',
        site_logo:'',
        telphone:'',
        email:'',
        qq:'',
        wx_number:'',
        custom_tel:'',
        icp_number:'',
        site_seo_title:'',
        site_seo_keywords:'',
        site_seo_description:'',
        upload_file_limit_size:'',
        upload_file_suffix:'',
      },
      rules:{
        sitename: [{ required: true, message: '站点名称必须填写', trigger: 'blur' }],
        siteurl: [{ required: true, message: '站点URL必须填写', trigger: 'blur' }],
        telphone: [{ required: true, message: '联系电话必须填写', trigger: 'blur' }],
        email: [{ required: true, type:'email',  message: 'email必须填写', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchSysConfig().then(response => {
        this.postForm = response.data.results
        this.listLoading = false
      })
    },
    imgPreview(file, fileList) {
      if(this.GLOBAL.uploadImageCheck(file, fileList)){
        this.hasSelectFileUpload = true
        this.postForm.site_logo = file.url
      }
    },
    //处理图片上传成功后的操作
    handleThumbSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        this.postForm.upload_img_url = response.data.attachment.upload_file_path
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
    saveData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //判断是否选择了新图片上传
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }
          saveSysConfig(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              if(typeof(this.postForm.upload_img_url) != 'undefined'){
                this.postForm.site_logo = this.postForm.upload_img_url
              }
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