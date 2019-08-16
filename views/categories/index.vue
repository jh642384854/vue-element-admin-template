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
      <vxe-table-column type="index" width="120" title="序号" tree-node></vxe-table-column>
      <vxe-table-column field="id" width="100" title="ID" ></vxe-table-column>
      <vxe-table-column field="name" width="200" title="中文名称" ></vxe-table-column>
      <vxe-table-column field="en_name" width="200" title="英文名称" ></vxe-table-column>
      <vxe-table-column field="sort" width="100" title="排序" ></vxe-table-column>
      <vxe-table-column field="created_time" width="200" title="创建时间"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-header-overflow show-overflow></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success" @click="handleCreate(row)">添加子栏目</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(row.id, row)">编辑</el-button>
          <el-button size="mini" type="info" @click="addArticle(row)" v-if="typeof(row.children) == 'undefined' || row.children.length == 0 ">添加文章</el-button>
          <el-button size="mini" type="danger" @click="deleteRow(row)" v-if="typeof(row.children) == 'undefined' || row.children.length == 0 ">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
 
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="100px">

        <el-form-item label="父栏目" prop="pid">
          <treeselect :multiple="false" v-model="ruleForm.pid" :options="categories" :normalizer="normalizer" />
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
import { fetchList2,fetchList,deleteCategories,createCategories,updateCategories } from '@/api/categories.js'  
import XEUtils from 'xe-utils'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
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

  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
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
        created_time:'',
        en_name:'',
        name: '',
        description: '',
        sort:1,
        children:[]
      },
      rules: {
        pid: [{ required: true, message: '父栏目必须选择', trigger: 'blur,change' }],
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
        created_time:'',
        en_name:'',
        name: '',
        description: '',
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
                //console.log(this.ruleForm)
                //console.log(rowNode)
                if (rowNode) {
                  for (const v of rowNode.items) {
                    if(v.id == this.ruleForm.pid){
                      const index = rowNode.items.indexOf(v)
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
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
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
          delete tempData.children  //删除children元素，服务端不需要接收该参数
          updateCategories(tempData).then(() => {
            let rowNode = XEUtils.findTree(this.list, item => item.id === this.ruleForm.id, this.treeConfig)
            if (rowNode) {
              //判断是否是顶级栏目
              if(rowNode.parent == null){
                for (const v of this.list) {
                  if (v.id === this.ruleForm.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.ruleForm)
                    break
                  }
                }
              }else{
                //如果有子栏目
                for (const v of rowNode.parent.children) {
                  if (v.id === this.ruleForm.id) {
                    const index = rowNode.parent.children.indexOf(v)
                    rowNode.parent.children.splice(index, 1, this.ruleForm)
                    break
                  }
                }
              }
            }
            //将categories数据同步更新
            this.categories = JSON.parse(JSON.stringify(this.list))
            this.categoriesAddRoot()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
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
          let rowNode = XEUtils.findTree(this.list, item => item.id === row.id, this.treeConfig)
          if(rowNode.parent == null){
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }else{
            this.$refs.xTable.remove(row)
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