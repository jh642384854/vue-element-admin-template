<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        创建
      </el-button>
    </div>

    <vxe-table :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="类别名称"></vxe-table-column>
      <vxe-table-column field="type" title="广告类型">
        <template slot-scope="scope">
          {{ scope.row.type | advTypeFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="size" title="广告尺寸" :formatter="formatterSize" width="120"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column field="created_at" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success">
            <span @click="handleEdit(row.id, row)">编辑</span>
          </el-button>
          <router-link :to="'/operation/advs/list?cid='+row.type" class="el-button el-button el-button--mini">
            <span>广告列表</span>
          </router-link>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="postForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model.number="postForm.type" placeholder="请选择">
            <el-option v-for="item in advCatesType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="版位尺寸 宽:" prop="width" >
                <el-input v-model.number="postForm.width" />
              </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="高:" prop="height" label-width="50px" >
                 <el-input v-model.number="postForm.height" />
              </el-form-item>
            </el-col>
        </el-row>
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
import { fetchAdvcategories,fetchAdvcateTypes,createAdvCates,updateAdvCates,deleteAdvCates } from '@/api/advs'

let _this
export default {
  name:"advcategories",
  filters: {
    advTypeFilter(type){
      let advTypeName = ''
      for (var i in _this.advCatesType) {
        if(_this.advCatesType[i].id == type){
           advTypeName = _this.advCatesType[i].name
           break
        }
      }
      return advTypeName
    }
  },
  beforeCreate: function () {
      _this = this
  },
  computed:{
    
  },
  data(){
    return {
      listLoading:true,
      tableData:[],
      advCatesType:[],//广告类型

      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '创建'
      },
      postForm: {
        name:'',
        type: '',
        width: '',
        height: '',
        description: '',
        advs:0
      },
      rules:{
        name: [{ required: true, message: '类型名称必须填写', trigger: 'blur' }],
        type: [{ required: true, message: '类别必须选择', trigger: 'blur' }],
        width: [{ required: true, type: "integer", message: '广告宽度尺寸必须填写', trigger: 'blur' }],
        height: [{ required: true, type: "integer", message: '广告高度尺寸必须填写', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
    this.getAdvTypes()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAdvcategories().then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    getAdvTypes(){
      fetchAdvcateTypes().then(response => {
        this.advCatesType = response.data.items
      })
    },
    formatterSize({cellValue, row, rowIndex, column, columnIndex}){
      return row.width + "*" +row.height +"px"
    },
    resetTemp() {
      this.postForm = {
        name:'',
        type: '',
        description: '',
        width: '',
        height: '',
        advs:0
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
          createAdvCates(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.postForm.id = response.data.last_id
              this.postForm.created_at = response.data.created_at
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
          const tempData = Object.assign({}, this.postForm)
          updateAdvCates(tempData).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
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
    handleDelete(row){
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deleteAdvCates(row.id).then(response=>{
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