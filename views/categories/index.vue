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
      <vxe-table-column field="created_time" width="150" title="创建时间"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-header-overflow show-overflow></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success" @click="handleCreate(row)">添加子栏目</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(row.id, row)">编辑</el-button>
          <router-link :to="'/article/add?cid='+row.id" class="el-button el-button el-button--info el-button--mini" v-if="row.mid == 2">
            <span>添加文章</span>
          </router-link>
          <router-link :to="'/article/pageedit/'+row.id" class="el-button el-button el-button--mini" v-else-if="row.mid == 1">
            <span>修改内容</span>
          </router-link>
          <el-button size="mini" type="danger" @click="deleteRow(row)" v-if="typeof(row.children) == 'undefined' || row.children.length == 0 ">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
 
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="100px">

        <el-form-item label="父栏目" prop="pid">
          <treeselect :multiple="false" v-model="ruleForm.pid" :options="categories" :normalizer="normalizer" />
        </el-form-item>
        <el-form-item label="栏目模型" prop="mid">
          <el-select v-model="ruleForm.mid" placeholder="请选择栏目模型">
            <el-option v-for="item in catModelOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="30" :show-word-limit="showWordLimit"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="en_name">
          <el-input v-model="ruleForm.en_name" maxlength="30" :show-word-limit="showWordLimit"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="ruleForm.sort" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="栏目介绍" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.description" maxlength="200" :show-word-limit="showWordLimit">
          </el-input>
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
      ruleForm: {
        id:'',
        pid:0,
        mid:'',
        created_time:'',
        en_name:'',
        name: '',
        description: '',
        sort:1,
        children:[]
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
      this.ruleForm = {
        id:'',
        pid:0,
        mid:'',
        created_time:'',
        en_name:'newcatname',
        name: '新栏目吗名称',
        description: '栏目描述',
        sort:1,
        children:[]
      }
    },
    handleCreate(row=null) {
      this.resetTemp()
      if(row != null){
        this.ruleForm.pid = row.id
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCategories(this.ruleForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.ruleForm.id = response.data.last_id
              this.ruleForm.created_time = response.data.created_time
              //如果添加的是顶级栏目
              if(this.ruleForm.pid === 0){
                this.list.unshift(this.ruleForm)
              }else{
                //如果添加的子栏目
                let xTree = this.$refs.xTable
                xTree.createRow(this.ruleForm).then(newRow => {
                  // 插入到指定pid的栏目下面
                  let rowNode = XEUtils.findTree(this.list, item => item.id === this.ruleForm.pid, this.treeConfig)
                  if (rowNode) {
                    for (const v of rowNode.items) {
                      if(v.id == this.ruleForm.pid){
                        const index = rowNode.items.indexOf(v)
                        if(typeof(rowNode.items[index].children == "undefined")){
                          rowNode.items[index].children = []
                        }
                        rowNode.items[index].children.unshift(this.ruleForm)
                        break
                      }
                    }
                  }
                })
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
        }
      })
    },
    handleEdit(index, row) {
      this.ruleForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.ruleForm)
          //delete tempData.children  //删除children元素，服务端不需要接收该参数
          console.log(tempData)
          updateCategories(tempData).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              let rowNode = XEUtils.findTree(this.list, item => item.id === this.ruleForm.id, this.treeConfig)
              //把顶级栏目变成二级栏目
              if(rowNode.parent == null){
                this.list.forEach(function(item,index,arr){
                  if(item.id == tempData.id){
                    arr.splice(index,1)
                  }
                  if(item.id == tempData.pid){
                    arr[index].children.unshift(tempData)
                  }
                })
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