<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="用户状态" clearable style="width:120px" class="filter-item">
        <el-option v-for="item in adminUserStatus" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
    </div>

    <el-table :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180">
      </el-table-column>
      <el-table-column prop="roles" label="角色" width="180">
        <template slot-scope="scope">
          {{ scope.row.roles | rolesFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
        :filters="[{ text: '正常', value: 1}, { text: '禁用', value: 0 }]"
        :filter-method="filterStatus"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'primary'" close-transition>
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" sortable width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px">
        <el-form-item label="账户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio v-for="status in adminUserStatus" :label="status.key" :key="status.key">{{status.display_name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="textMap[dialogStatus] == '创建'">
          <el-input  type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="密码" v-if="textMap[dialogStatus] == '修改'">
          <el-radio-group v-model.number="modifyPass">
            <el-radio-button label=0>不修改</el-radio-button>
            <el-radio-button label=1>修改</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="modifyPass">
          <el-input  type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="ruleForm.roles">
            <el-checkbox v-for="role in adminRoles" :label="role.role_id" :key="role.role_id">{{role.role_name}}</el-checkbox>
          </el-checkbox-group>
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
import { fetchList,deleteAdminUser,createAdminUser,updateAdminUser } from '@/api/adminuser'
import { fetchRolesList } from '@/api/roles'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 

const adminUserStatus = [
  { key:1,display_name:"正常"},
  { key:0,display_name:"禁用"},
]

//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;

export default {
  name: 'adminUser',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      if(status){
        return '正常'
      }else{
        return '禁用'
      }
    },
    rolesFilter(roles){
      var roleName = ''
      for(var index in _this.adminRoles){
        for(var n in roles){
          if(roles[n] == _this.adminRoles[index]['role_id']){
              roleName += _this.adminRoles[index]['role_name']+','
          }
        }
      }
      return roleName.substring(0, roleName.length-1);
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: '',
        status: '',
      },
      modifyPass:0,
      adminUserStatus,
      adminRoles:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      ruleForm: {
        id:'',
        created_at:'',
        email:'',
        username: '',
        password: '',
        status: '',
        roles: []
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        username: [{ required: true, message: '账户名必须填写', trigger: 'blur' }],
        password: [{ required: true, message: '密码必须填写', trigger: 'blur' }],
        status: [{ required: true, message: '用户状态必须选择', trigger: 'change' }],
        roles: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]
      },
      multipleSelection: []
    }
  },
  created() {
    this.getAllRoles()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getAllRoles(){
      if(this.adminRoles.length <= 0){
        fetchRolesList().then(response => {
          this.adminRoles = response.data.items
        })
      }
    },
    filterStatus(value, row) {
      return row.status === value
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.ruleForm = {
        id:'',
        created_at:'',
        email:'',
        username: '',
        password: '',
        status: '',
        roles: []
      }
    },
    handleCreate() {
      this.getAllRoles()
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
          createAdminUser(this.ruleForm).then((response) => {
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
      this.getAllRoles()
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
          updateAdminUser(tempData).then(() => {
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
    //删除用户
    handleDelete(row) {
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        deleteAdminUser(row.id).then(response=>{
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
