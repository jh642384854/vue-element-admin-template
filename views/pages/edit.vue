<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="80px">
      <el-form-item label="所属栏目">
        {{ postForm.cat_name }}
      </el-form-item>
      <el-form-item label="页面标题" prop="title">
        <el-input v-model="postForm.title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
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
          <img v-if="postForm.img_url" :src="postForm.img_url" class="thumb">
          <i v-else class="el-icon-plus img_url-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">{{ GLOBAL.ImageUploadTips }}</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="postForm.status">
          <!-- 注意这里的label必须要写成":label=1"，不能直接写成label=1，不然数据无法作用上去 -->
          <el-radio :label=1>正常</el-radio>
          <el-radio :label=0>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="postForm.description"></el-input>
      </el-form-item>
      <el-form-item label="内容" style="margin-bottom: 30px;" prop="content">
        <Tinymce ref="editor" v-model="postForm.content" :height="400" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchPages,savePages } from '@/api/pages' 

import Tinymce from '@/components/Tinymce'

//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  id: undefined,
  cid:'',
  cat_name:'',
  title: '', 
  content: '', 
  description: '', 
  img_url: '', 
  status: '',
}
export default {
  name: 'Pages',
  components: { Tinymce },
  data(){
    return {
      hasSelectFileUpload:false,
      postForm: Object.assign({}, defaultForm),
      rules:{
        title: [{ required: true, message: '标题必须填写', trigger: 'blur' }],
        content: [{ required: true, message: '内容必须填写', trigger: 'blur' }],
        status: [{ required: true, message: '状态必须选择', trigger: 'blur' }],
      }
    }
  },
  beforeCreate: function () {
      _this = this
  },
  created() {
    //获取vuerouter的动态参数
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods:{
    fetchData(id){
      const data = {
        "cid":id
      }
      fetchPages(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    onSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //判断是否选择了新图片上传
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }else{
            const tempData = Object.assign({}, this.postForm)
            savePages(tempData).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.GLOBAL.msgNotify('success','成功',response.data.msg)
                this.$router.push({ path: '/article/page' })
              }else{
                this.GLOBAL.msgNotify('error','失败',response.data.msg)
              }
            })
          }
        }
      })
    },
    imgPreview(file, fileList) {
      if(this.GLOBAL.uploadImageCheck(file, fileList)){
        this.hasSelectFileUpload = true
        this.postForm.img_url = file.url
      }
    },
    //处理图片上传成功后的操作
    handleThumbSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        //这里有一个问题，就是通过上传文件成功后，修改this.postForm.img_url值后，在回到onSubmit()方法里面执行的时候，这个值无法正常获取，这是为什么呢？
        this.postForm.img_url = response.data.attachment.upload_file_path
        const tempData = Object.assign({}, this.postForm)
        savePages(tempData).then((response) => {
          if(response.data.status == this.GLOBAL.SuccessText){
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
            this.$router.push({ path: '/article/page' })
          }else{
            this.GLOBAL.msgNotify('error','失败',response.data.msg)
          }
        })
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>