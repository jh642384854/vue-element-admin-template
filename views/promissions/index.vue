<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路由" width="180"></el-table-column>
      <el-table-column prop="method" label="请求方式" width="180"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)" v-if="!scope.row.hasChildren">删除</el-button> 
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total"  @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px">
        <el-form-item label="类别" prop="pid">
          <el-select v-model.number="ruleForm.pid" placeholder="请选择类别">
            <el-option v-for="item in promissionParents" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
import { fetchPromissionsList,deletePromissions,createPromissions,updatePromissions } from '@/api/promissions'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' 

let _this;

const methodTypes = [
  { key:'GET',display_name:"GET"},
  { key:'POST',display_name:"POST"},
  { key:'PUT',display_name:"PUT"},
  { key:'DELETE',display_name:"DELETE"},
]

export default {
  name: 'Promissions',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      total: 0,
      list: [],
      methodTypes,
      promissionParents: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      ruleForm: {
        id:'',
        pid:'',
        created_at:'',
        name:'',
        remark: '',
        path: '',
        method:''
      },
      rules: {
        pid: [{ required: true, message: '类别必须选择', trigger: 'blur' }],
        name: [{ required: true, message: '权限名必须填写', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法必须选择', trigger: 'blur' }],
        path: [{ required: true, message: '权限路径必须填写', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPromissionsList().then(response => {
        this.list = response.data.items
        this.total = response.data.total
        //提取主栏目类别
        for (var i in this.list) {
            if(this.list[i]['pid'] == 0){
              let tpm = {}
              tpm.value = parseInt(this.list[i]['id'])
              tpm.label = this.list[i]['name']
              this.promissionParents.push(tpm)
            }
        }
        const zeroNode = {
          value:0,
          label:'一级栏目'
        }
        this.promissionParents.unshift(zeroNode)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.ruleForm = {
        id:'',
        pid:'',
        created_at:'',
        name:'',
        remark: '',
        path: '',
        method:''
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPromissions(this.ruleForm).then((response) => {
            this.ruleForm.id = response.data.last_id
            this.ruleForm.created_at = response.data.created_at
            this.list.unshift(this.ruleForm)
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
          updatePromissions(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.ruleForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.ruleForm)
                break
              }
            }
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
    handleDelete(row) {
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deletePromissions(row.id).then(response=>{
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
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