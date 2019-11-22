<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="80px">
      <el-tabs >
        <el-tab-pane label="基本设置">
          <el-form-item label="所属栏目" prop="cid">
            <el-cascader ref="categoryCascader" v-model="catid_path" :options="categories" :props="categoriesProps"  clearable @change="categoryChange" style="width: 450px;"></el-cascader>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="页面标题" prop="title">
                <el-input v-model="postForm.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="是否外链">
                <el-switch v-model="postForm.is_outside_chain" active-text="是" inactive-text="否" @change="linkSwitch"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="postForm.is_outside_chain == true">
              <el-form-item label="外链地址" prop="outside_chain_url" >
                <el-input v-model="postForm.outside_chain_url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="状态">
                <el-radio-group v-model="postForm.status">
                  <el-radio v-for="item in articleStatus" :key="item.id" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="排序">
                <el-input-number v-model="postForm.sort" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="浏览数">
                <el-input-number v-model="postForm.views" :min="1" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发布日期" prop="created_time">
                <el-date-picker v-model="postForm.created_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" value-format="timestamp"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="文章属性" prop="attributes">
            <el-checkbox-group v-model="postForm.attributes">
              <el-checkbox name="attribute" v-for="item in articleAttributes" :key="item.id" :label="item.id" :value="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="postForm.tags" multiple filterable allow-create default-first-option placeholder="请选择文章标签" style="width: 50%">
              <el-option v-for="item in articleTags" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input type="textarea" v-model="postForm.description"></el-input>
          </el-form-item>
          <el-form-item label="缩略图">
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
              <img v-if="postForm.thumb" :src="postForm.thumb" class="thumb">
              <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传<font color="red"> {{ imgFileSuffix }} </font>文件，且不超过<font color="red"> {{ Math.ceil(fileSizeLimit/1024) }}kb </font> </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章组图">
            <el-upload
              class="upload-demo"
              ref="BatchUpload"
              :accept="GLOBAL.AllowImageSuffix"
              :action="GLOBAL.UploadAttachmentUrl"
              :data="batchUploadData"
              :file-list="batchUploadFile"
              :auto-upload="false"
              :limit="batchFileSize"
              multiple
              :on-change="batchUploadListShow"
              :on-success="batchUploadSuccess"
              :on-exceed="batchUploadExceed"
              list-type="picture">
              <el-button slot="trigger">选择图片</el-button>
              <el-button style="margin-left: 10px;"  type="success" @click="submitBatchUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传<font color="red"> {{ imgFileSuffix }} </font>文件，且不超过<font color="red"> {{ Math.ceil(fileSizeLimit/1024) }}kb </font> 允许批量上传<font color="red"> {{ batchFileSize }} </font>个文件</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SEO设置">
          <el-form-item label="SEO标题">
            <el-input v-model="postForm.seotitle"></el-input>
          </el-form-item>
          <el-form-item label="SEO关键字">
            <el-input type="textarea" v-model="postForm.seokeywords"></el-input>
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input type="textarea" v-model="postForm.seodescription"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="内容设置">
          <el-form-item label="内容" prop="content" style="margin-bottom: 30px;">
            <Tinymce ref="editor" v-model="postForm.content" :height="400" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList } from '@/api/categories'
import { fetchArticlesAttributes,fetchArticlesGetOne,createArticles,updateArticles } from '@/api/articles'
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
import XEUtils from 'xe-utils'
import Tinymce from '@/components/Tinymce'

//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  cid:'',
  title: '', // 标题
  content: '', // 内容
  description: '', // 摘要
  sort: '', //排序
  views:'',
  thumb: '', // 图片
  group_pictures:[],
  status: 1,
  seotitle:'',
  seokeywords:'',
  seodescription:'',
  tags:[],
  attributes:[],
  created_time:'',
  is_outside_chain:false,  //是否是外链
  outside_chain_url:'',//外链地址
}

export default {
  name: 'ArticleForm',
  components: { Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      catid_path:[],
      imgFileSuffix:'',
      fileSizeLimit:512000,       //允许文件上传的大小
      batchFileSize:1,            //允许批量上传的文件格式
      hasSelectFileUpload:false,  //用户是否选择了新上传文件
      hasSelectMultiFileUpload:false, //是否选择了批量上传文件
      articleStatus: [],      //文章状态
      articleTags: [],        //文章标签
      articleAttributes:[],   //文章属性
      categories: [],         //栏目信息
      batchUploadFile: [],    //批量上传已经上传的文件列表
      //el-cascader组件的属性设置
      categoriesProps:{
        value:'id',
        label:'name',
        children:'children',
        //checkStrictly:true    //可以直接选择父栏目(当没有父栏目没有子栏目的时候，这个选项就很有用)
      },
      //上传附件提交的额外数据
      uploadData:{
        filemd5:'',
        module: 'articles',
        cid:'',
      },
      //批量上传的文件额外数据
      batchUploadData:{
        filemd5:'',
        module: 'articles',
        cid:'',
      },
      //form表单数据
      postForm: Object.assign({}, defaultForm),
      //表单元素的验证规则
      rules: {
        cid: [{ required: true, message: '必须选择文章栏目', trigger: 'blur' }],
        title: [{ required: true, message: '文章标题必须填写', trigger: 'blur' }],
        created_time: [{ required: true, message: '文章发布时间必须选择', trigger: 'blur' }],
        outside_chain_url: [{ type: 'url',required: true, message: '外链地址必须填写', trigger: 'blur' }],
        //content: [{ required: true, message: '文章内容必须填写', trigger: 'blur' }],
        attributes: [{ type: 'array', required: true, message: '请至少选择一个文章属性', trigger: 'change' }]
      }
    }
  },
  created(){
    this.init()
  },
  methods:{
    init:function(){
      this.handerQuery()
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchArticleData(id)
      }else{
        if(this.postForm.created_time == ''){
          //默认日期格式化处理(这个也是必要的)，这个是当el-date-picker组件的value-format属性不是timestamp，而是具体的日期字符串，如yyyy-MM-dd HH:mm:ss这种格式的时候有用
          //this.postForm.created_time = this.GMTToStr(new Date())
          this.postForm.created_time = Date.parse(new Date())
        }
      }
      //获取栏目列表
      fetchList().then(response => {
        this.categories = response.data.items
      })
      //获取文章的其他相关属性
      fetchArticlesAttributes().then(response => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.articleTags = response.data.results.tags
          this.articleAttributes = response.data.results.attributes
          this.articleStatus = response.data.results.status
          this.fileSizeLimit = response.data.results.attachment.img_file_size_limit
          this.batchFileSize = response.data.results.attachment.batch_file_size
          this.imgFileSuffix = response.data.results.attachment.img_file_suffix
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    //格式化日期
    GMTToStr : function(time){
      let date = new Date(time)
      let Str=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      return Str
    },
    //处理请求参数
    handerQuery(){
      if( Object.keys(this.$route.query).length >0 ){
        if(typeof(this.$route.query.cid) != 'undefined' && parseInt(this.$route.query.cid) > 0){
          let catid_path = this.$route.query.catid_path
          var dataIntArr=[]//保存转换后的整型字符串   
          if(catid_path != 0){
            let catid_path_new = catid_path.split(',')
            catid_path_new.forEach(function(data,index,arr){
              dataIntArr.push(parseInt(data))
            })
          }
          this.catid_path = dataIntArr
          this.postForm.cid = parseInt(this.$route.query.cid)
          //处理图片上传的附加额外信息
          this.uploadData.cid = this.postForm.cid
          this.batchUploadData.cid = this.postForm.cid
        }
      }
    },
    //切换栏目
    categoryChange(val){
      if(this.$refs['categoryCascader'].getCheckedNodes().length){
        this.postForm.cid = this.$refs['categoryCascader'].getCheckedNodes()[0].data.id
        //处理图片上传的附加额外信息
        this.uploadData.cid = this.postForm.cid
        this.batchUploadData.cid = this.postForm.cid
      }else{
        this.postForm.cid = 0
      }
    },
    //获取单个文章内容
    fetchArticleData(id){
      fetchArticlesGetOne(id).then(response=>{
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results
          this.postForm.tags = this.GLOBAL.splitStringToInterArrray(response.data.results.tags)
          this.postForm.attributes = this.GLOBAL.splitStringToInterArrray(response.data.results.attributes)
          this.catid_path = this.GLOBAL.splitStringToInterArrray(response.data.results.catid_path)
          if(response.data.results.group_pictures != ""){
            this.batchUploadFile = XEUtils.toStringJSON(response.data.results.group_pictures) //JSON.parse(response.data.results.group_pictures)  
          }
          //这里要给时间戳
          this.postForm.created_time = response.data.results.created_time*1000
        }else{
          const m = this.$message({
            message: response.data.msg,
            showClose: true,
            type: 'error',
            onClose:function(){
              _this.$router.push({ path: '/article/list',params:{ cid:0 } })
            }
          });
          setTimeout(()=>m.close(),2000)
        }
      })
    },
    //组图上传
    submitBatchUpload(){
      if(this.batchUploadData.filemd5 != ""){
        //清空原来保留的数据
        //this.postForm.group_pictures = []
        this.$refs.BatchUpload.submit()
      }else{
        this.$message.error('请先选择文件后在上传')
      }
    },
    //组图上传成功后回调
    batchUploadSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        let fileInfo = { 'name':file.name,'url':response.data.upload_file_path}
        this.postForm.group_pictures.push(fileInfo)
      }
    },
    //组图选择
    batchUploadListShow(file,fileList){
      if(!this.GLOBAL.uploadImageCheck(file, this.fileSizeLimit)){
        fileList.pop()
      }else{
        this.GLOBAL.getFileMd5(file,filemd5=>{
          this.batchUploadData.filemd5 += filemd5 +','
        })
        this.hasSelectMultiFileUpload = true
      }
    },
    //超出限制图片上传个数
    batchUploadExceed(files, fileList){
      this.$message.error('超出限制图片上传个数，限制上传图片个数为'+this.batchFileSize+'个')
    },
    //缩略图预览
    imgPreview(file, fileList) {
      if(this.GLOBAL.uploadImageCheck(file, this.fileSizeLimit)){
        this.hasSelectFileUpload = true
        this.postForm.thumb = file.url
        this.GLOBAL.getFileMd5(file,filemd5=>{
          this.uploadData.filemd5 = filemd5
        })
      }
    },
    //处理图片上传成功后的操作
    handleThumbSuccess(response, file, fileList){
      if(response.data.status == this.GLOBAL.SuccessText){
        const tempData = Object.assign({}, this.postForm)
        tempData.thumb = response.data.upload_file_path
        tempData.attributes = tempData.attributes.join(',')
        tempData.tags = tempData.tags.join(',')
        if(tempData.group_pictures.length > 0){
          tempData.group_pictures = XEUtils.toJSONString(tempData.group_pictures)
        }else{
          tempData.group_pictures = ''
        }
        tempData.created_time = Math.ceil(tempData.created_time/1000)
        if(typeof(this.postForm.id) != 'undefined'){
          this.doUpdateArticles(tempData)
        }else{
          this.doCreateArticles(tempData)
        }
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
    //提交表单
    onSubmit:function(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.hasSelectMultiFileUpload && (this.postForm.group_pictures.length == 0)){
            this.$message.error('您选择的组图文件还没有上传，请上传组图后在进行提交')
          }else{
            if(this.hasSelectFileUpload){
              this.$refs.upload.submit()
            }else{
              const tempData = Object.assign({}, this.postForm)
              tempData.attributes = tempData.attributes.join(',')
              tempData.tags = tempData.tags.join(',')
              if(tempData.group_pictures.length > 0){
                tempData.group_pictures = XEUtils.toJSONString(tempData.group_pictures)
              }else{
                tempData.group_pictures = ''
              }
              tempData.created_time = Math.ceil(tempData.created_time/1000)
              if(this.isEdit){
                this.doUpdateArticles(tempData)
              }else{
                this.doCreateArticles(tempData)
              }
            }
          }
        }
      })
    },
    //更新文章
    doUpdateArticles(data){
      updateArticles(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.$notify({title: '成功',message: response.data.msg, type: 'success',duration: 2000})
          this.$router.push({ path: '/article/list',params:{ cid:response.data.cid } })
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    //创建文章
    doCreateArticles(data){
      createArticles(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.$notify({ title: '成功',message: '创建成功',type: 'success',duration: 2000})
          this.$router.push({ path: '/article/list',query:{ cid:response.data.cid } })
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    //是否是外链
    linkSwitch:function(val){
      if(val){
        if(this.postForm.content == ''){
          //这个地方做的一个简单的处理，当是外链的时候，给内容字段设定一个默认的内容
          this.postForm.content = 'default content'
        }
      }
    }
  }
}
</script>

<style>
.thumb-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.thumb-uploader .el-upload:hover {
  border-color: #409EFF;
}
.thumb-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.thumb {
  width: 178px;
  height: 178px;
  display: block;
} 
.el-upload-list--picture .el-upload-list__item{ width: 200px; float: left; margin-right: 15px; }
</style>