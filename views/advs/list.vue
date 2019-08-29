<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item mr10" type="primary" icon="el-icon-edit" @click="handleCreate()">
        创建
      </el-button>
      <el-button class="filter-item mr10" type="success" icon="el-icon-d-caret" @click="handleCreate()">
        排序
      </el-button>
      <el-button class="filter-item mr10" type="danger"  icon="el-icon-delete" @click="batchDelete()">
        删除
      </el-button>
    </div>
    
    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="广告名称"></vxe-table-column>
      <vxe-table-column field="type" title="广告类别">
        <template slot-scope="scope">
          {{ scope.row.cid | advCateFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="list_order" title="排序" width="100"></vxe-table-column>
      <vxe-table-column field="img_url" title="图片地址" width="120">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.img_url" @click="popImg(scope.row)" fit="contain"></el-image>
        </template>
      </vxe-table-column>
      <vxe-table-column field="link_url" title="链接地址" show-overflow>
        <template slot-scope="scope">
          <el-link :href="scope.row.link_url" target="_blank" type="primary">{{ scope.row.link_url }}</el-link>
        </template>
      </vxe-table-column>
      <vxe-table-column field="created_time" title="创建时间"></vxe-table-column>
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
    
    <!-- 创建或修改广告图片 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
        <el-form-item label="广告标题" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
        <el-form-item label="广告类别" prop="cid">
          <el-select v-model="postForm.cid" placeholder="请选择">
            <el-option v-for="item in advcategories"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="排序" prop="list_order" >
                <el-input-number v-model="postForm.list_order" :min="1" :max="100"></el-input-number>
              </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="链接地址" prop="link_url" >
                 <el-input v-model.number="postForm.link_url" />
              </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="广告图片" prop="img_url">
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
              <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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

    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogImgVisible" style="text-align: center;">
      <img class="dialogImg" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
import XEUtils from 'xe-utils'

import { fetchAdvcategories,createAdvs,updateAdvs,deleteAdvs,fetchAdvs } from '@/api/advs'

import Pagination from '@/components/Pagination'  

let _this
export default {
  name:"advcategories",
  components: { Pagination },
  filters: {
    advCateFilter(type){
      let advCateName = ''
      for (var i in _this.advcategories) {
        if(_this.advcategories[i].id == type){
           advCateName = _this.advcategories[i].name
           break
        }
      }
      return advCateName
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      dialogImageUrl: '',
      dialogImgVisible: false,
      hasSelectFileUpload:false,  //用户是否选择了新上传文件
      listLoading:true,
      total: 0,
      tableData:[],
      advcategories:[],//广告类别
      listQuery: {
        page: 1,
        limit: 20,
        cid: '',
      },

      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '创建'
      },
      postForm: {
        name:'',
        cid: '',
        img_url: '',
        upload_img_url:'',
        list_order: '',
        link_url: '',
        created_time:''
      },
      rules:{
        name: [{ required: true, message: '广告名称必须填写', trigger: 'blur' }],
        cid: [{ required: true, message: '广告类别必须选择', trigger: 'blur' }],
        link_url: [{ required: true, message: '广告链接必须填写', trigger: 'blur' }],
        img_url: [{ required: true,  message: '广告图片必须上传', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.handerQuery()
    this.getList()
    this.getAdvCategories()
    console.log(XEUtils.pick(this.advcategories,"id"))
  },
  methods: {
    handerQuery(){
      if( Object.keys(this.$route.query).length >0 ){
        if(typeof(this.$route.query.cid) != 'undefined' && parseInt(this.$route.query.cid) > 0){
          this.listQuery.cid = this.$route.query.cid
        }
      }
    },
    getList() {
      this.listLoading = true
      fetchAdvs(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getAdvCategories(){
      fetchAdvcategories().then(response => {
        this.advcategories = response.data.items
      })
    },
    formatterImgurl({cellValue, row, rowIndex, column, columnIndex}){
      return row.width + "*" +row.height +"px"
    },
    popImg(row){
      if(row.img_url != ""){
        this.dialogImgVisible = true
        this.dialogImageUrl = row.img_url
      }else{
        this.GLOBAL.msgNotify('error','失败',"没有上传图片，无法预览")
      }
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
        //this.postForm.img_url = response.data.attachment.upload_file_path  //这个设置好像没有效果
        this.postForm.upload_img_url = response.data.attachment.upload_file_path
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
    resetTemp() {
      this.postForm = {
        name:'',
        cid: '',
        img_url: '',
        upload_img_url:'',
        list_order: '',
        link_url: '',
        created_time:''
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
          }
          createAdvs(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              if(this.postForm.upload_img_url != ""){
                this.postForm.img_url = this.postForm.upload_img_url
              }
              this.postForm.id = response.data.last_id
              this.postForm.created_time = response.data.created_time
              this.tableData.unshift(this.postForm)
              this.dialogFormVisible = false
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        }
      })
    },
    handleEdit(index, row) {
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
          }
          const tempData = Object.assign({}, this.postForm)
          updateAdvs(tempData).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              if(typeof(this.postForm.upload_img_url) != 'undefined'){
                this.postForm.img_url = this.postForm.upload_img_url
              }
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
        }
      })
    },
    batchDelete(){
      let selectRecords = this.$refs.xTable.getSelectRecords()
      if (selectRecords.length) {
        console.log(selectRecords)
        this.$refs.xTable.removeSelecteds()
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
        deleteAdvs(row.id).then(response=>{
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
<!--  type="scoped" -->
<style>
.dialogImg{ max-width: 75%; }
</style>