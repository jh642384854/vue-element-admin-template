<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="关键字" prop="title">
            <el-input v-model="postForm.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <select-material ref="selectMaterial" @func="getMsgFormSon" />
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveDiyreplyMsg,getoneDiyreplyMsg } from '@/api/weixin'

import selectMaterial from '@/views/wxgzh/basesetting/select_material' 
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  id: undefined,
  title: '', // 标题
  msgTypeID:'',
  materialID:'',
}

export default {
  name: 'KeywordsReplyForm',
  components: { selectMaterial },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      postForm: Object.assign({}, defaultForm),
      rules: {
        title: [{ required: true, message: '关键字必须填写', trigger: 'blur' }],
        msgTypeID: [{ required: true, message: '消息类型必须要选择', trigger: 'blur' }],
        materialID: [{ required: true, message: '素材必须选择', trigger: 'blur' }],
      }
    }
  },
  created(){
    if(this.isEdit){
      this.getDiyreplyMsg(this.$route.params.id)
    }
  },
  methods:{
    getDiyreplyMsg(id){
      let param = { id : id }
      getoneDiyreplyMsg(param).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          let msgTypeID = response.data.results.msgTypeID
          this.postForm = response.data.results
          this.$refs.selectMaterial.postForm.msgTypeID = msgTypeID
          this.$refs.selectMaterial.postForm.materialID = response.data.results.materialID
          switch (msgTypeID) {
            case 'text':
            case 'voice':
            case 'video':
              if(msgTypeID == "text"){
                this.$refs.selectMaterial.selectMaterialContent = response.data.results.materialText
              }else if(msgTypeID == "voice"){
                this.$refs.selectMaterial.selectMaterialVoice = response.data.results.materialText
              }else if(msgTypeID == "video"){
                this.$refs.selectMaterial.selectMaterialVideo = response.data.results.materialText
              }
              break;
            case 'image':
            case 'news':
              this.$refs.selectMaterial.selectMaterialTitle = response.data.results.materialText
              this.$refs.selectMaterial.selectMaterialImage = response.data.results.materialPic
              break;
            default:
              this.$refs.selectMaterial.selectMaterialContent = response.data.results.materialText
              break;
          }
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    getMsgFormSon(data){
      this.postForm.msgTypeID = data.msgTypeID
      this.postForm.materialID = data.materialID
    },
    submitForm:function(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDiyreplyMsg(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
              this.$router.push({ path: '/wxgzh/basesetting/diyreply/list'})
            }else{
              this.$message.error(response.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>