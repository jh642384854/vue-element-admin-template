<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item mr10" type="primary" icon="el-icon-edit">
        创建
      </el-button>
      <el-button class="filter-item mr10" type="danger"  icon="el-icon-delete" @click="batchDelete()">
        删除
      </el-button>
    </div>
    
    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="title" title="关键字" show-overflow></vxe-table-column>
      <vxe-table-column field="msgTypeID" width="100" title="素材类型"></vxe-table-column>
      <vxe-table-column field="materialText" title="素材内容" show-overflow>
      </vxe-table-column>
      <vxe-table-column field="created_at" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="success">
            <span @click="handleEdit(row.id, row)">编辑</span>
          </el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    
    <!-- 分页插件 -->
    <pagination v-show=" total>0 " :total="total"  @pagination="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'  
import { getlistDiyreplyMsg,deleteDiyreplyMsg } from '@/api/weixin' 
import Pagination from '@/components/Pagination'  

let _this
export default {
  name:"wx",
  filters: {
  },
  components: { Pagination },
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true,
      total: 0,
      tableData:[],
      listQuery: {
        page: 1,
        limit: 20
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      this.listLoading = true
      getlistDiyreplyMsg(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: '/wxgzh/basesetting/diyreply/edit/'+index})
    },
    batchDelete(){
      let selectRecords = this.$refs.xTable.getSelectRecords()
      if (selectRecords.length) {
        let ids = []
        for (var i in selectRecords) {
          ids.push(selectRecords[i].id)
        }
        const data = {
          "ids":ids
        }
        deleteDiyreplyMsg(data).then(response=>{
          if(response.data.status == this.GLOBAL.SuccessText){
            this.GLOBAL.msgNotify('success','成功',response.data.msg)
            this.$refs.xTable.removeSelecteds()
          }else{
            this.GLOBAL.msgNotify('error','失败',response.data.msg)
          }
        })
      } else {
        this.$alert('请至少选择一条数据！')
      }
    },
    handleDelete(row){
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        const data = {
          "ids":row.id
        }
        deleteDiyreplyMsg(data).then(response=>{
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