<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-width="80px">
      <el-tabs >
        <el-tab-pane label="基本设置">
          <el-form-item label="所属栏目" prop="pid">
            <el-cascader v-model="postForm.pid" :options="categories" :props="categoriesProps" clearable></el-cascader>
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
              <el-form-item label="发布日期">
                <el-date-picker v-model="postForm.created_at" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" value-format="timestamp"></el-date-picker>
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
              :accept="limtFileType"
              action=""
              list-type="picture"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="imgPreview">
              <img v-if="postForm.thumb" :src="postForm.thumb" class="thumb">
              <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章组图">
            <el-upload
              class="upload-demo"
              :accept="limtFileType"
              action="#"
              :file-list="postForm.pictures"
              :auto-upload="false"
              multiple
              :on-change="imgListShow"
              list-type="picture">
              <el-button size="small" type=this.GLOBAL.SuccessText>选择图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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

import Tinymce from '@/components/Tinymce'
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
const defaultForm = {
  id: undefined,
  pid:[],
  title: '', // 标题
  content: '', // 内容
  description: '', // 摘要
  sort: '', //排序
  views:'',
  thumb: '', // 图片
  pictures:[],
  status: 1,
  seotitle:'',
  seokeywords:'',
  seodescription:'',
  tags:[],
  attributes:[],
  is_outside_chain:false,  //是否是外链
  outside_chain_url:'',//外链地址
  created_at:''  //这里的单位是毫秒
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
  data(){
    return {
      limtFileType:"image/jpeg,image/gif,image/png,image/bmp",
      articleStatus: [],
      articleTags: [],
      articleAttributes:[],
      fileSizeLimit:1024*500,//500KB以内的图片
      categories: [],
      categoriesProps:{
        value:'id',
        label:'name',
        children:'children',
        checkStrictly:true    //可以直接选择父栏目(当没有父栏目没有子栏目的时候，这个选项就很有用)
      },
      postForm: Object.assign({}, defaultForm),
      rules: {
        pid: [{ required: true, message: '必须选择文章栏目', trigger: 'blur' }],
        title: [{ required: true, message: '文章标题必须填写', trigger: 'blur' }],
        outside_chain_url: [{ type: 'url',required: true, message: '外链地址必须填写', trigger: 'blur' }],
        content: [{ required: true, message: '文章内容必须填写', trigger: 'blur' }],
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
      }
      this.postForm.created_at = Date.parse(new Date())
      //获取栏目列表
      fetchList().then(response => {
        this.categories = response.data.items
      })
      //获取文章的其他相关属性
      fetchArticlesAttributes().then(response => {
        this.articleTags = response.data.tags
        this.articleAttributes = response.data.attributes
        this.articleStatus = response.data.status
      })
    },
    handerQuery(){
      this.postForm.pid = []
      if( Object.keys(this.$route.query).length >0 ){
        if(typeof(this.$route.query.cid) != 'undefined' && parseInt(this.$route.query.cid) > 0){
          this.postForm.pid.push(parseInt(this.$route.query.cid))
        }
      }
    },
    fetchArticleData(id){
      fetchArticlesGetOne({"id":id}).then(response=>{
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.data
        }else{
          console.log('get article error')
        }
      })
    },
    onSubmit:function(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            updateArticles(this.postForm).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.$notify({
                  title: '成功',
                  message: response.data.msg,
                  type: 'success',
                  duration: 2000
                })
                this.$router.push({ path: '/article/list',params:{ pid:response.data.pid } })
              }else{
                this.$message.error(response.data.msg)
              }
            })
          }else{
            createArticles(this.postForm).then((response) => {
              if(response.data.status == this.GLOBAL.SuccessText){
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.$router.push({ path: '/article/list',query:{ pid:response.data.pid } })
              }else{
                this.$message.error(response.data.msg)
              }
            })
          }
        }
      })
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
    imgListShow(file,fileList){
      if(!this.imgCheck(file, fileList)){
        fileList.pop()
      }
    },
    imgPreview(file, fileList) {
      if(this.imgCheck(file, fileList)){
        this.postForm.thumb = file.url
      }
    },
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
</style>