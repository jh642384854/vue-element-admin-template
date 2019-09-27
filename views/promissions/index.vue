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
      <vxe-table-column field="name" width="150" title="名称" ></vxe-table-column>
      <vxe-table-column field="path" width="150" title="路由"  show-overflow></vxe-table-column>
      <vxe-table-column field="method" width="100" title="请求方式"></vxe-table-column>
      <vxe-table-column field="sort" width="50" title="排序" ></vxe-table-column>
      <vxe-table-column field="remark" width="200" title="备注" ></vxe-table-column>
      <vxe-table-column field="created_at" width="150" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="success" @click="handleCreate(row)">添加子节点</el-button>
          <el-button type="primary" @click="handleEdit(row.id, row)">编辑</el-button>
          <el-button type="danger" @click="deleteRow(row)" v-if="typeof(row.children) == 'undefined' || row.children.length == 0 ">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <pagination v-show="total>0" :total="total"  @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px">
        <el-form-item label="类别" prop="pid">
          <SelectTree
            v-model.number="ruleForm.pid"
            type="number"
            :props="propsSelectTree"
            :options="menuDataSelectTree"
            :value="valueIdSelectTree2"
            :clearable="true"
            :accordion="true"
            @getValue="getSelectTreeValue($event, 2)"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="ruleForm.path" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-radio-group v-model="ruleForm.method">
            <el-radio v-for="role in methodTypes" :label="role.key" :key="role.key">{{ role.display_name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="ruleForm.sort" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" />
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
import { fetchPromissionsTreeList,deletePromissions,createPromissions,updatePromissions } from '@/api/promissions'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' 
import SelectTree from '@/components/TreeSelect'
import XEUtils from 'xe-utils'

let _this

const methodTypes = [
  { key:'GET',display_name:"GET"},
  { key:'POST',display_name:"POST"},
  { key:'PUT',display_name:"PUT"},
  { key:'DELETE',display_name:"DELETE"},
]

export default {
  name: 'Promissions',
  components: { Pagination,SelectTree },
  directives: { waves },
  filters: {
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      valueIdSelectTree2: 0,
      total: 0,
      list: [],
      methodTypes,
      menuDataSelectTree:'',
      promissionParents: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      treeConfig: {
        children: 'children'
      },
      propsSelectTree: {
        value: 'id',
        label: 'name',
        children: 'children',
        placeholder: '父级'
      },
      ruleForm: {
        id:0,
        pid:0,
        created_at:'',
        name:'',
        remark: '',
        path: '',
        method:'',
        sort:1,
        children:[]
      },
      rules: {
        pid: [{ required: true, message: '类别必须选择', trigger: 'blur' }],
        name: [{ required: true, message: '权限名必须填写', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法必须选择', trigger: 'blur' }],
        path: [{ required: true, message: '权限路径必须填写', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPromissionsTreeList().then(response => {
        this.menuDataSelectTree = response.data.items
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    resetTemp() {
      this.ruleForm = {
        id:0,
        pid:0,
        name:'',
        remark: '',
        path: '',
        method:'',
        sort:1,
        children:[]
      }
    },
    getSelectTreeValue(value, type) {
      if(value === null){
        this.ruleForm.pid = 0
        this.valueIdSelectTree2 = 0
      }else{
        this.ruleForm.pid = value
        this.valueIdSelectTree2 = value
      }
    },
    handleCreate(row) {
      this.resetTemp()
      if(typeof(row) != 'undefined'){
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
          const tempData = Object.assign({}, this.ruleForm)
          delete tempData.id
          delete tempData.children
          createPromissions(tempData).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.ruleForm.id = response.data.last_id
              this.ruleForm.created_at = response.data.created_at
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
                        if(typeof(rowNode.items[index].children) == "undefined"){
                          rowNode.items[index].children = []
                        }
                        rowNode.items[index].children.unshift(this.ruleForm)
                        break
                      }
                    }
                  }
                })
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
    handleEdit(index, row) {
      this.ruleForm = Object.assign({}, row)
      if(row.pid >0){
        this.ruleForm.pid = row.pid
        this.valueIdSelectTree2 = row.pid
      }else{
        this.ruleForm.pid = 0
        this.valueIdSelectTree2 = 0
      }
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
          delete tempData.children
          updatePromissions(tempData).then((response) => {
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
              this.dialogFormVisible = false
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        }
      })
    },
    deleteRow(row) {
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deletePromissions(row.id).then(response=>{
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