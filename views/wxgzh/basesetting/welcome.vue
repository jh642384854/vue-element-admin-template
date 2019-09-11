<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
      <select-material ref="selectMaterial" @func="getMsgFormSon" @changeMaterialType="doChangeMaterialType" />
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'  
import { setWelcomeMsg,getWelcomeMsg } from '@/api/weixin' 
import selectMaterial from '@/views/wxgzh/basesetting/select_material'  

let _this
export default {
  name:"wx",
  filters: {
  },
  components: { selectMaterial },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      postForm:{
        wid:undefined,
        msgTypeID:'',
        materialID:''
      },
      rules:{
        msgTypeID: [{ required: true, message: '消息类型必须要选择', trigger: 'blur' }],
        materialID: [{ required: true, message: '素材必须选择', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      let currentWxID = Cookies.get(this.GLOBAL.WxCurrentIDToken)
      let params = {
        "wid":currentWxID
      }
      getWelcomeMsg(params).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results[0]

          this.$refs.selectMaterial.postForm.msgTypeID = response.data.results[0].msgTypeID
          this.$refs.selectMaterial.postForm.materialID = response.data.results[0].materialID
          this.$refs.selectMaterial.radioConfig.checkRowKey = response.data.results[0].materialID

          let msgTypeID = response.data.results[0].msgTypeID
          switch (msgTypeID) {
            case 'text':
              this.$refs.selectMaterial.selectMaterialContent = response.data.results[0].materialText
              break;
            case 'image':
            case 'news':
              this.$refs.selectMaterial.selectMaterialTitle = response.data.results[0].materialText
              this.$refs.selectMaterial.selectMaterialImage = response.data.results[0].materialPic
              break;
            case 'voice':
              this.$refs.selectMaterial.selectMaterialVoice = response.data.results[0].materialText
              break;  
            case 'video':
              this.$refs.selectMaterial.selectMaterialVideo = response.data.results[0].materialText
              break;   
            default:
              this.$refs.selectMaterial.selectMaterialContent = response.data.results[0].materialText
              break;
          }
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    doChangeMaterialType(msgTypeID){
      this.postForm.msgTypeID = msgTypeID
      this.postForm.materialID = ''
    },
    getMsgFormSon(data){
      this.postForm.msgTypeID = data.msgTypeID
      this.postForm.materialID = data.materialID
    },
    submitForm(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.postForm['wid'] = Cookies.get(this.GLOBAL.WxCurrentIDToken)
          setWelcomeMsg(this.postForm).then((response) => {
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