<template>
  <div class="app-container">
    <el-alert title="注意：变量名以英文字母数字下划线命名,且只能以英文字母开头" type="success" :closable="false" style="margin-bottom: 10px;"></el-alert>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
      <el-row :gutter="20" v-for="(item, index) in dynamicValidateForm.customVariables" :key="item.key">
        <el-col :span="4">
          <el-form-item :label="'变量名' + (index+1)" :prop="'customVariables.' + index + '.name'" :rules="{ required: true, minlength:1, maxlength:20, pattern:'^[a-zA-Z][a-zA-Z0-9_]*$', message: '变量名不能为空或不合法', trigger: 'blur'}">
            <el-input v-model="item.name" width="150"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="值" :prop="'customVariables.' + index + '.value'" :rules="{ required: true, message: '值不能为空', trigger: 'blur'}">
            <el-input v-model="item.value" width="150"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述" :key="item.key" :prop="'customVariables.' + index + '.value'">
            <el-input v-model="item.remark" width="150"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click.prevent="removeItem(item)">删除</el-button>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="addItem">新增变量</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
// import XEUtils from 'xe-utils'
import { fetchCustomConfig,saveCustomConfig } from '@/api/settings'
let _this
export default {
  name:"customVariables",
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true,
      dynamicValidateForm:{
        customVariables: [{
          name:'',
          value: '',
          remark:''
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchCustomConfig().then(response => {
        if(response.data.results != ''){
           this.dynamicValidateForm.customVariables = JSON.parse(response.data.results)
        }
        this.listLoading = false
      })
    },
    submitForm() {
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
          //将json对象转换为字符串
          let data = {config_value : JSON.stringify(this.dynamicValidateForm.customVariables)}
          saveCustomConfig(data).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    removeItem(item) {
      var index = this.dynamicValidateForm.customVariables.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.customVariables.splice(index, 1)
      }
    },
    addItem() {
      this.dynamicValidateForm.customVariables.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>