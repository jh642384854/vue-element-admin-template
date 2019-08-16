<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" label-width="80px">
      <el-form-item label="所属栏目">
        关于我们
      </el-form-item>
      <el-form-item label="页面标题">
        <el-input v-model="postForm.title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="postForm.imageUrl" :src="postForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="postForm.status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="postForm.sort" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="postForm.description"></el-input>
      </el-form-item>
      <el-form-item label="内容" style="margin-bottom: 30px;">
        <Tinymce ref="editor" v-model="postForm.content" :height="400" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchPages } from '@/api/pages' 

import Tinymce from '@/components/Tinymce'

//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  id: undefined,
  title: '', // 标题
  content: '', // 内容
  description: '', // 摘要
  sort: '', //排序
  imageUrl: '', // 图片
  status: '',
}
export default {
  name: 'Pages',
  components: { Tinymce },
  data(){
    return {
      postForm: Object.assign({}, defaultForm),
    }
  },
  created() {
    //获取vuerouter的动态参数
    const id = this.$route.params && this.$route.params.id
  },
  methods:{
    fetchData(id){
      
    },
    onSubmit() {
      console.log('submit!');
    },
    handleAvatarSuccess(res, file) {
      this.postForm.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
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