<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
    </div>

    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="role_name" label="名称" sortable width="180">
      </el-table-column>
      </el-table-column>
      <el-table-column prop="listorder" label="排序" sortable width="100">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" sortable width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" @click="assignPermissions(scope.row)">权限分配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total"  @pagination="getList" />
    
    <!-- 添加角色 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px">
        <el-form-item label="名称" prop="role_name">
          <el-input v-model="ruleForm.role_name" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" />
        </el-form-item>
        <el-form-item label="排序" prop="listorder">
          <el-input-number v-model="ruleForm.listorder" :min="1" :max="100"></el-input-number>
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

    <!-- 为角色分配权限 -->
    <el-dialog title="权限分配" :visible.sync="dialogPermissionsFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px">
        <el-tree
          :data="allPermissions"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="permissions"
          highlight-current
          :default-checked-keys="checkedPermissions"
          :props="defaultProps">
        </el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionsFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="savePermissions">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPromissionsTreeList } from '@/api/promissions'  
import { fetchRolesList,deleteRoles,createRoles,updateRoles,saveRolePermission,fetchRolePermissions } from '@/api/roles'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination' 


let _this;

export default {
  name: 'roles',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogPermissionsFormVisible: false,
      selectRoleid:'',
      allPermissions:[],
      checkedPermissions:[12, 14, 21, 24, 28, 3],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      ruleForm: {
        id:'',
        created_at:'',
        role_name:'',
        remark: '',
        listorder: ''
      },
      rules: {
        username: [{ required: true, message: '账户名必须填写', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchRolesList().then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    filterStatus(value, row) {
      return row.status === value
    },
    resetTemp() {
      this.ruleForm = {
        role_id:'',
        created_at:'',
        name:'',
        remark: '',
        listorder: ''
      }
    },
    assignPermissions(row){
      this.selectRoleid = row.role_id
      this.dialogPermissionsFormVisible = true
      let params = {
        role_id : this.selectRoleid
      }
      fetchRolePermissions(params).then(response => {
        this.checkedPermissions = response.data.items
      })
      fetchPromissionsTreeList().then(response => {
        this.allPermissions = response.data.items
      })
    },
    savePermissions(row){
      //this.$refs.permissions.getCheckedNodes() //这个获取的是一组对象
      let data = {
        role_id:this.selectRoleid,
        permissions:this.$refs.permissions.getCheckedKeys() //这个方法单纯的只是获取权限ID
      }
      saveRolePermission(data).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.dialogPermissionsFormVisible = false
          this.checkedPermissions = []
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
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
          createRoles(this.ruleForm).then((response) => {
            this.ruleForm.role_id = response.data.last_id
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
          updateRoles(tempData).then(() => {
            for (const v of this.list) {
              if (v.role_id === this.ruleForm.role_id) {
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
    //删除用户
    handleDelete(row) {
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deleteRoles(row.id).then(response=>{
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
