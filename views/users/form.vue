<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="postForm.username" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="postForm.nickname" />
      </el-form-item>
      <el-form-item label="用户头像" prop="avator">
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
              <img v-if="postForm.avator" :src="postForm.avator" class="thumb">
              <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">{{ GLOBAL.ImageUploadTips }}</div>
          </el-upload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="postForm.sex">
          <el-radio v-for="item in userSex" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户分组" prop="groupid">
        <el-radio-group v-model="postForm.groupid">
          <el-radio v-for="item in userGroups" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户来源" prop="from">
        <el-radio-group v-model="postForm.from">
          <el-radio v-for="item in userFrom" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-radio-group v-model="postForm.status">
          <el-radio v-for="item in userStatus" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户积分">
        <el-input-number v-model="postForm.points" :min="0" :max="10000"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserConfig,getOneUserInfo,saveUserInfo } from '@/api/user'

//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  id: undefined,
  username:'',
  nickname: '',    // 昵称
  avator: '',      // 头像
  sex: '',         // 性别
  groupid: '',     // 用户组
  from:'',         // 用户来源
  points:'',       // 用户积分
  status: '',      // 用户状态
}

export default {
  name: 'userForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      hasSelectFileUpload:false,  //用户是否选择了新上传文件
      newUploadFilePath:'',
      userStatus: [],
      userGroups: [],
      userSex:[],
      userFrom:[],
      postForm: Object.assign({}, defaultForm),
      rules: {
        username: [{ required: true, message: '用户名必须填写', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择用户性别', trigger: 'blur' }],
        groupid: [{ required: true, message: '请选择用户分组', trigger: 'blur' }],
        status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
        from: [{ required: true, message: '请选择用户来源', trigger: 'change' }]
      }
    }
  },
  created(){
    this.init()
  },
  methods:{
    init:function(){
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchUserData(id)
      }
      this.postForm.created_at = Date.parse(new Date())
      //获取用户的其他相关属性
      getUserConfig().then(response => {
        this.userStatus = response.data.attrStatus
        this.userGroups = response.data.attrGroups
        this.userSex = response.data.attrSex
        this.userFrom = response.data.attrFrom
      })
    },
    fetchUserData(id){
      getOneUserInfo({"id":id}).then(response=>{
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    onSubmit:function(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //判断是否选择了新图片上传
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }else{
            this.saveData(this.postForm)
          }
        }
      })
    },
    saveData(data){
      saveUserInfo(this.postForm).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
          this.$router.push({ path: '/user/list' })
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    //处理图片上传成功后的操作
    handleThumbSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        this.postForm.upload_img_url = response.data.attachment.upload_file_path
        console.log(this.postForm)
        this.saveData(this.postForm)
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
      }
    },
    imgCheck(file,fileList){
      let fileName = file.name
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(fileName.toLowerCase())) {
          if(file.size > this.fileSizeLimit){
            this.$message.error('选择的图片大小不能超过500KB')
            return false
          }
      } else {
          this.$message.error('请选择图片文件')
          return false
      }
      return true
    },
    imgPreview(file, fileList) {
      if(this.imgCheck(file, fileList)){
        this.hasSelectFileUpload = true
        this.postForm.avator = file.url
      }
    }
  }
}
</script>