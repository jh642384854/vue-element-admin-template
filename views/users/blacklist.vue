<template>
  <div class="app-container">
    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="username" title="用户名" width="150"></vxe-table-column>
      <vxe-table-column field="nickname" title="昵称" width="150" show-overflow></vxe-table-column>
      <vxe-table-column field="avatar" title="头像" width="120">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.avatar" fit="contain"></el-image>
        </template>
      </vxe-table-column>
      <vxe-table-column field="sex" title="性别"  width="100">
        <template slot-scope="scope">
          {{ scope.row.sex | sexFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="groupid" title="分组">
        <template slot-scope="scope">
          {{ scope.row.groupid | userGroupFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="points" title="积分"></vxe-table-column>
      <vxe-table-column field="from" title="来源">
        <template slot-scope="scope">
          {{ scope.row.from | fromFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="状态" >
        <template slot-scope="scope">
          {{ scope.row.status | statusFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="created_at" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success">
            <span @click="handleEdit(row.id, row)">编辑</span>
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
    <!-- 分页插件 -->
    <pagination v-show=" total>0 " :total="total"  @pagination="getList" />
    
  </div>
</template>

<script>
import { fetchUserList,getUserConfig,deleteOneUser } from '@/api/user'

import Pagination from '@/components/Pagination'  

let _this
export default {
  name:"userList",
  components: { Pagination },
  filters: {
    sexFilter(sex){
      let sexName = '';
      for (var i in _this.userSex) {
        if(_this.userSex[i]['label'] == sex){
          sexName = _this.userSex[i]['value']
          break
        }
      }
      return sexName
    },
    userGroupFilter(gid){
      let groupName = '';
      for (var i in _this.userGroups) {
        if(_this.userGroups[i]['label'] == gid){
          groupName = _this.userGroups[i]['value']
          break
        }
      }
      return groupName
    },
    statusFilter(status){
      let statusName = '';
      for (var i in _this.userStatus) {
        if(_this.userStatus[i]['label'] == status){
          statusName = _this.userStatus[i]['value']
          break
        }
      }
      return statusName
    },
    fromFilter(status){
      let fromName = '';
      for (var i in _this.userFrom) {
        if(_this.userFrom[i]['label'] == status){
          fromName = _this.userFrom[i]['value']
          break
        }
      }
      return fromName
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true,
      total: 0,
      tableData:[],
      userStatus:[],
      userGroups:[],
      userSex:[],
      userFrom:[],
      listQuery: {
        username:'',
        page: 1,
        limit: 20,
        gid: '',
        status:'',
        sex:'',
        fromid:'',
        dateRange:'',
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    this.init()
    this.getList()
  },
  methods: {
    init(){
      getUserConfig().then(response => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.userStatus = response.data.attrStatus
          this.userGroups = response.data.attrGroups
          this.userSex = response.data.attrSex
          this.userFrom = response.data.attrFrom
        }else{
          this.$message.error(response.data.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    searchUser() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/user/create'})
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/user/edit/'+row.id})
    },
    handleDelete(row){
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        const data = {
          "id":row.id
        }
        deleteOneUser(data).then(response=>{
          if(response.data.status == this.GLOBAL.SuccessText){
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
          }else{
            this.$message.error(response.data.msg)
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