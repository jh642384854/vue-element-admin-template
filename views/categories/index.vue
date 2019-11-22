<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        创建
      </el-button>
    </div>

    <vxe-table
      ref="xTable"
      :data.sync="list"
      stripe
      size="small"
      highlight-hover-row
      highlight-current-row
      class="vxe-table-element"
      :edit-config="{trigger: 'manual', mode: 'row'}"
      :tree-config="{children: 'children', expandAll: true}">
      <vxe-table-column type="index" width="300" title="序号" tree-node></vxe-table-column>
      <vxe-table-column field="id" width="50" title="ID" ></vxe-table-column>
      <vxe-table-column field="mid" width="150" title="栏目模型" >
        <template slot-scope="scope">
          {{ scope.row.mid | modelTypeFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" width="100" title="中文名称" ></vxe-table-column>
      <vxe-table-column field="en_name" width="100" title="英文名称" show-overflow></vxe-table-column>
      <vxe-table-column field="sort" width="50" title="排序" ></vxe-table-column>
      <vxe-table-column field="created_at" width="150" title="创建时间"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-header-overflow show-overflow></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success" @click="handleCreate(row)">添加子栏目</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(row.id, row)">编辑</el-button>
          <router-link :to="'/article/add?cid='+row.id+'&catid_path='+row.catid_path" class="el-button el-button el-button--info el-button--mini" v-if="row.mid == 2  && (typeof(row.children) == 'undefined' || row.children == null)">
            <span>添加文章</span>
          </router-link>
          <router-link :to="'/article/pageedit/'+row.id" class="el-button el-button el-button--mini" v-else-if="row.mid == 1 && (typeof(row.children) == 'undefined' || row.children == null)">
            <span>修改内容</span>
          </router-link>
          <el-button size="mini" type="danger" @click="deleteRow(row)" v-if="typeof(row.children) == 'undefined' || row.children == null ">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
 
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
        <el-form-item label="父栏目" prop="pid">
          <el-cascader ref="categoryCascader" v-model="postForm.catid_path" :options="categories" :props="categoriesProps"  clearable @change="categoryChange" style="width: 450px;"></el-cascader>
        </el-form-item>
        <el-form-item label="栏目模型" prop="mid">
          <el-select v-model="postForm.mid" placeholder="请选择栏目模型">
            <el-option v-for="item in catModelOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="postForm.name" maxlength="30" :show-word-limit="showWordLimit"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="en_name">
          <el-input v-model="postForm.en_name" maxlength="30" :show-word-limit="showWordLimit"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="postForm.sort" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="栏目介绍" prop="description">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="postForm.description" maxlength="200" :show-word-limit="showWordLimit"></el-input>
        </el-form-item>
        <el-form-item label="栏目图片" prop="img_url">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ textMap[dialogStatus] }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList2,fetchList,deleteCategories,createCategories,updateCategories } from '@/api/categories'  
import XEUtils from 'xe-utils'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this
var validateEnName = (rule, value, callback) => {
  var reg = /^[a-zA-Z0-9\s]{1,20}$/g;
  if (value === '') {
    callback(new Error('请输入英文名称'));
  } else if(!reg.test(value)) {
    callback(new Error('请输入正确的英文名称'));
  }else{
    callback();
  }
};
export default {
  name: 'categories',
  components: { Treeselect },
  filters: {
    modelTypeFilter(mid){
      if(mid == 1){
        return '单页模型'
      }else if (mid == 2) {
        return '文章模型'
      }
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      catModelOptions:[
        {
          "name":"单页模型",
          'value':1
        },
        {
          "name":"文章模型",
          'value':2
        }
      ],
      hasSelectFileUpload:false,  //用户是否选择了新上传文件
      categoriesProps:{
        value:'id',
        label:'name',
        children:'children',
        checkStrictly:true    //可以直接选择父栏目(当没有父栏目没有子栏目的时候，这个选项就很有用)
      },
      showWordLimit: true,
      categories:[],
      list: [],
      treeConfig: {
        children: 'children'
      },
      total: 0,
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },
      listLoading: true,
      modifyPass:0,
      adminRoles:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      //上传附件提交的额外数据
      uploadData:{
        filemd5:'',
        module: 'categories',
        cid:'',
      },
      postForm: {
        pid:0,
        mid:'',
        en_name:'',
        name: '',
        description: '',
        catid_path:'',
        img_url:'',
        sort:1,
        children:null
      },
      rules: {
        pid: [{ required: true, message: '父栏目必须选择', trigger: 'blur,change' }],
        mid: [{ required: true, message: '栏目模型必须选择', trigger: 'blur,change' }],
        en_name: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { validator: validateEnName, trigger: 'blur' }
        ],
        name: [{ required: true, message: '栏目名称必须填写', trigger: 'blur' }],
        sort: [{ required: true, message: '排序必须输入', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        //本来是想用两个变量来维护数据，后来发现list新增了数据后，但是categories并没有新增，需要多处来维护数据就会很麻烦，所以就共用了一个
        this.categories = JSON.parse(JSON.stringify(response.data.items))
        this.categoriesAddRoot()
      })
    },
    categoriesAddRoot(){
      const parentNode = {
        id:0,
        name:'顶级栏目'
      }
      this.categories.unshift(parentNode)
    },
    resetTemp() {
      this.postForm = {
        pid:0,
        mid:'',
        en_name:'',
        name: '',
        description: '',
        catid_path:'',
        img_url:'',
        sort:1,
        children:null
      }
    },
    categoryChange(){
      if(this.$refs['categoryCascader'].getCheckedNodes().length){
        this.postForm.pid = this.$refs['categoryCascader'].getCheckedNodes()[0].data.id
      }else{
        this.postForm.pid = 0
      }
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
          this.doUpdateAdv(tempData)
        }else{
          this.doCreateAdv(tempData)
        }
      }else{
        this.GLOBAL.msgNotify('error','失败',response.data.msg)
        return false
      }
    },
    handleCreate(row=null) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if(row != null){
        this.handleCatidPath(row)
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCatidPath(row){
      if(row.pid == 0){
        if(this.dialogStatus == 'update'){
          this.postForm.catid_path = [0]
        }else{
          this.postForm.catid_path = [row.id]
        }
      }else{
        let dataStrArr = row.catid_path.split(',')
        if(this.dialogStatus == 'update'){
          dataStrArr.pop()
        }
        var dataIntArr=[]//保存转换后的整型字符串   
        dataStrArr.forEach(function(data,index,arr){
            if(parseInt(data) != 0){
              dataIntArr.push(parseInt(data))
            }
        })
        this.postForm.catid_path = dataIntArr
      }
      this.postForm.pid = row.id
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.hasSelectFileUpload){
            this.$refs.upload.submit()
          }else{
            const tempData = Object.assign({}, this.postForm)
            tempData.catid_path = tempData.catid_path.join(',')
            this.doCreateCateogires(tempData)
          }
        }
      })
    },
    doCreateCateogires(data){
      createCategories(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm.id = response.data.last_id
          this.postForm.created_at = response.data.created_at
          this.postForm.catid_path = response.data.others
          //如果添加的是顶级栏目
          if(this.postForm.pid === 0){
            this.list.unshift(this.postForm)
            //将categories数据同步更新
            this.categories = JSON.parse(JSON.stringify(this.list))
          }else{
            //如果添加的子栏目
            let xTree = this.$refs.xTable
            xTree.createRow(this.postForm).then(newRow => {
              // 插入到指定pid的栏目下面
              let rowNode = XEUtils.findTree(this.list, item => item.id === this.postForm.pid, this.treeConfig)
              if (rowNode) {
                for (const v of rowNode.items) {
                  if(v.id == this.postForm.pid){
                    const index = rowNode.items.indexOf(v)
                    if(typeof(rowNode.items[index].children) == "undefined" || rowNode.items[index].children == null){
                      rowNode.items[index].children = []
                    }
                    rowNode.items[index].children.unshift(this.postForm)
                    break
                  }
                }
              }
            })
            //将categories数据同步更新
            this.categories = xTree.getData()
          }
          this.categoriesAddRoot()
          this.dialogFormVisible = false
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    handleEdit(index, row) {
      this.resetTemp()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.postForm = Object.assign({}, row)
      this.handleCatidPath(this.postForm)
/*
      // TODO 防止修改栏目时候将父栏目选择为当前栏目或当前栏目的子栏目
      const xTree = this.$refs.xTable
      const catetoriesData = xTree.getData()
      let newData = []
      const parentNode = XEUtils.findTree(catetoriesData, item => item.id === this.postForm.pid, this.treeConfig)
      const id = this.postForm.id
      parentNode.items.forEach(function(item,index,arr){
        if(item.id == id){
          arr.splice(index,1)
          console.log(arr)
        }
      })
      this.categories = parentNode.items
*/    
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.hasSelectFileUpload){
              this.$refs.upload.submit()
          }else{
            const tempData = Object.assign({}, this.postForm)
            //这里要重新组合catid_path
            if(tempData.catid_path.join(',') == '0'){
              tempData.catid_path = tempData.catid_path.join(',')
            }else{
              tempData.catid_path = tempData.catid_path.join(',')+','+tempData.id
            }
            //delete tempData.children  //删除children元素，服务端不需要接收该参数
            this.doUpdateCategories(tempData)
          }
        }
      })
    },
    doUpdateCategories(tempData){
      updateCategories(tempData).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          let xTree = this.$refs.xTable
          let rowNode = XEUtils.findTree(this.list, item => item.id === tempData.id, this.treeConfig)
          //把顶级栏目变成二级栏目
          if(rowNode.parent == null){
            let parentNode = XEUtils.findTree(this.list, item => item.id === tempData.pid, this.treeConfig)
            parentNode.items.forEach(function(item,index,arr){
              if(item.id == tempData.id){
                arr.splice(index,1)
              }
            })
            parentNode.item.children.unshift(tempData)
          }else{
            //如果更换了栏目的层级关系，没有更改层级关系，就不需要做以下处理
            if(tempData.pid != rowNode.parent.id){
              //如果更换了栏目的层级关系，就需要把原来的关系给删掉，并把新的关系进行更新
              rowNode.parent.children.forEach(function(item,index,arr){
                if(item.id == tempData.id){
                  arr.splice(index,1)
                }
              })
              //如果是把栏目直接提成顶级栏目
              if(tempData.pid == 0){
                this.list.unshift(tempData)
              }else{
                //删除关系后，还需要更新关系
                let parentNode = XEUtils.findTree(this.list, item => item.id === tempData.pid, this.treeConfig)
                //这个地方估计还会有问题
                if(parentNode.parent == null){
                  parentNode.items.forEach(function(item,index,arr){
                    if(item.id == tempData.pid){
                      arr[index].children.unshift(tempData)
                    }
                  })
                }else{
                  parentNode.parent.children.forEach(function(item,index,arr){
                    if(item.id == tempData.pid){
                      arr[index].children.unshift(tempData)
                    }
                  })
                }
                //将categories数据同步更新
                this.list = xTree.getData()
              }
            }else{
              //没有层级关系的调整，就只需要更新渲染列表的源数据就好了
              rowNode.parent.children.forEach(function(item,index,arr){
                if(item.id == tempData.id){
                  arr.splice(index,1,tempData)
                }
              })
            }
          }
          //将categories数据同步更新
          this.categories = JSON.parse(JSON.stringify(this.list))
          this.categoriesAddRoot()
          this.dialogFormVisible = false
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    deleteRow(row){
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deleteCategories(row.id).then(response=>{
          if(response.data.status == this.GLOBAL.SuccessText){
            let rowNode = XEUtils.findTree(this.list, item => item.id === row.id, this.treeConfig)
            if(rowNode.parent == null){
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            }else{
              this.$refs.xTable.remove(row)
            }
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
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