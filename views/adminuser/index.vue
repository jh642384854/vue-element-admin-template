<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="用户状态" clearable style="width:120px" class="filter-item"  @change="handleFilter">
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
            @click="handleDelete(scope.row.id,scope.$index, list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="ruleForm" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">
        <el-form-item label="账户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input  type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="ruleForm.roles">
            <!-- <el-checkbox v-for="role in adminRoles" :label="role.id" :key="role.id" name="uroles">{{role.role_name}}</el-checkbox> -->
            <el-checkbox label="1" name="uroles">超管</el-checkbox>
            <el-checkbox label="2" name="uroles">编辑</el-checkbox>
            <el-checkbox label="3" name="uroles">客服</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          创建
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,deleteAdminUser,createAdminUser,updateAdminUser,fetchAllRoels } from '@/api/adminuser'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 

const adminUserStatus = [
  { key:'1',display_name:"正常"},
  { key:'0',display_name:"禁用"},
]

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
      for(var index in roles){
        roleName += roles[index]['role_name']+','
      }
      return roleName.substring(0, roleName.length-1);
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        status: undefined,
      },
      adminUserStatus,
      adminRoles:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
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
      fetchAllRoels().then(response => {
        this.adminRoles = response.data
      })
    },
    filterStatus(value, row) {
      return row.status === value
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
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
            console.log(response)
            this.ruleForm.id = response.id
            this.ruleForm.created_at = '2019-08-07 15:59:39'
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
      this.ruleForm.timestamp = new Date(this.ruleForm.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
    handleDelete(id,index, rows) {
      deleteAdminUser(id).then(response=>{
        this.getList()
      })
    }
  }
}
</script>
