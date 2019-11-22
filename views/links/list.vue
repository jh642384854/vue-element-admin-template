<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item mr10" type="primary" icon="el-icon-edit" @click="handleCreate()">创建</el-button>
      <el-button class="filter-item mr10" type="danger"  icon="el-icon-delete" @click="batchDelete()">删除</el-button>
    </div>
    
    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading" :row-class-name="tableRowClassName">
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="链接名称"></vxe-table-column>
      <vxe-table-column field="type" title="链接类型" :formatter="formatterType"></vxe-table-column>
      <vxe-table-column field="status" title="状态" :formatter="formatterStatus" width="80"></vxe-table-column>
      <vxe-table-column field="list_order" title="排序" width="80"></vxe-table-column>
      <vxe-table-column field="link_url" title="链接地址" show-overflow>
        <template slot-scope="scope">
          <el-link :href="scope.row.link_url" target="_blank" type="primary">{{ scope.row.link_url }}</el-link>
        </template>
      </vxe-table-column>
      <vxe-table-column field="contact_user" title="站点联系人"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column field="created_at" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success">
            <span @click="handleEdit(row.id, row)">编辑</span>
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
    <!-- 分页插件 -->
    <pagination v-show=" total>0 " :total="total"  @pagination="getList" />
    
    <!-- 创建或修改链接图片 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
        <el-form-item label="链接名称" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
        <el-form-item label="链接类型" prop="type">
          <el-radio-group v-model="postForm.type">
            <el-radio :label="2">图片链接</el-radio>
            <el-radio :label="1">文字链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接LOGO" prop="img_url" v-if="postForm.type == 2">
          <el-upload
              class="thumb-uploader"
              ref="upload"
              :accept="GLOBAL.AllowImageSuffix"
              :action="GLOBAL.UploadAttachmentUrl"
              list-type="picture"
              :data="uploadData"
              :auto-upload="false"
              :show-file-list="false"
              :on-success="handleThumbSuccess"
              :on-change="imgPreview">
              <img v-if="postForm.img_url" :src="postForm.img_url" class="thumb">
              <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">{{ GLOBAL.ImageUploadTips }}</div>
            </el-upload>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="排序" prop="list_order" >
                <el-input-number v-model="postForm.list_order" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="status" >
                <el-radio-group v-model="postForm.status">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="链接地址" prop="link_url" >
                 <el-input v-model.number="postForm.link_url" />
              </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="站点联系人" prop="contact_user">
          <el-input v-model="postForm.contact_user" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="postForm.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ textMap[dialogStatus] }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
// import XEUtils from 'xe-utils'

import { createLinks,updateLinks,deleteLinks,fetchListLinks } from '@/api/links'

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
      total: 0,
      tableData:[],
      sorts:[],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '创建'
      },
      //上传附件提交的额外数据
      uploadData:{
        filemd5:'',
        module: 'links',
        cid:'',
      },
      postForm: {
        name:'',
        type: 1,
        img_url: '',
        contact_user:'',
        list_order: '',
        link_url: '',
        description:'',
        status:1
      },
      rules:{
        name: [{ required: true, message: '链接名称必须填写', trigger: 'blur' }],
        type: [{ required: true, message: '链接类型必须选择', trigger: 'blur' }],
        link_url: [{ required: true, type:'url', message: '链接链接必须填写', trigger: 'blur' }],
        img_url: [{ required: true,  message: '链接图片必须上传', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListLinks().then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    imgPreview(file, fileList) {
      if(this.GLOBAL.uploadImageCheck(file, fileList)){
        this.hasSelectFileUpload = true
        this.postForm.img_url = file.url
        this.GLOBAL.getFileMd5(file,filemd5=>{
          this.uploadData.filemd5 = filemd5
        })
      }
    },
    //处理图片上传成功后的操作
    handleThumbSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        const tempData = Object.assign({}, this.postForm)
        tempData.img_url = response.data.upload_file_path
        if(typeof(this.postForm.id) != 'undefined'){
          this.doUpdatedLinks(tempData)
        }else{
          this.doCreateLinks(tempData)
        }
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
    formatterType({cellValue, row, rowIndex, column, columnIndex}){
      return cellValue === 1 ? '文字链接' : cellValue === 2 ? '图片链接' : ''
    },
    formatterStatus({cellValue, row, rowIndex, column, columnIndex}){
      return cellValue === 1 ? '正常' : cellValue === 0 ? '禁用' : ''
    },
    tableRowClassName({row, rowIndex}) {
      if(!row.status){
        return 'warning-row'
      }
      return ''
    },
    resetTemp() {
      this.hasSelectFileUpload = false
      this.postForm = {
        name:'',
        type: 1,
        img_url: '',
        contact_user:'',
        list_order: '',
        link_url: '',
        description:'',
        status:1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //判断是否选择了新图片上传
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }else{
            this.doCreateLinks(this.postForm)
          }
        }
      })
    },
    doCreateLinks(data){
      createLinks(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          //将blod开头的文件地址替换为项目上传的图片地址
          this.postForm.img_url = data.img_url
          this.postForm.id = response.data.last_id
          this.postForm.created_at = response.data.created_at
          this.tableData.unshift(this.postForm)
          this.dialogFormVisible = false
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    handleEdit(index, row) {
      this.resetTemp()
      this.postForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //判断是否选择了新图片上传
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }else{
            this.doUpdatedLinks(this.postForm)
          }
        }
      })
    },
    doUpdatedLinks(data){
      updateLinks(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          //将blod开头的文件地址替换为项目上传的图片地址
          this.postForm.img_url = data.img_url
          for (const v of this.tableData) {
            if (v.id === this.postForm.id) {
              const index = this.tableData.indexOf(v)
              this.tableData.splice(index, 1, this.postForm)
              break
            }
          }
          this.dialogFormVisible = false 
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    batchDelete(){
      let selectRecords = this.$refs.xTable.getSelectRecords()
      if (selectRecords.length) {
        //要删除的链接ID
        let ids = []
        for (var i in selectRecords) {
          ids.push(selectRecords[i].id)
        }
        const data = {
          "ids":ids
        }
        deleteLinks(data).then(response=>{
          if(response.data.status == this.GLOBAL.SuccessText){
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
            this.$refs.xTable.removeSelecteds()
          }else{
            this.GLOBAL.msgNotify('error','失败',response.data.msg)
          }
        })
      } else {
        this.$alert('请至少选择一条数据！')
      }
    },
    handleDelete(row){
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        const data = {
          "ids":ids
        }
        deleteLinks(data).then(response=>{
          if(response.data.status == this.GLOBAL.SuccessText){
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
          }else{
            this.GLOBAL.msgNotify('error','失败',response.data.msg)
          }
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '放弃操作并离开页面'
            : '停留在当前页面'
        })
      })
    }
  }
}
</script>

<style>
.vxe-table--body .warning-row {
  background: oldlace;
}

.vxe-table--body .success-row {
  background: #f0f9eb;
}
</style>