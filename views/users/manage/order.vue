<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.bill_no" placeholder="请输入订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="searchOrder" />
      <el-select v-model="listQuery.importance" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in orderStatus" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
      <el-button class="filter-item mr10" type="danger"  icon="el-icon-delete" @click="batchDelete()">删除</el-button>
    </div>
    
    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="orderid" title="订单号"></vxe-table-column>
      <vxe-table-column field="money" title="支付金额"></vxe-table-column>
      <vxe-table-column field="discount" title="折扣" width="100"></vxe-table-column>
      <vxe-table-column field="coupon_id" title="优惠券" width="120"></vxe-table-column>
      <vxe-table-column field="pay_method" title="支付方式" show-overflow></vxe-table-column>
      <vxe-table-column field="status" title="状态" show-overflow></vxe-table-column>
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
import { fetchsorts,deleteOrders } from '@/api/user_order'
import Pagination from '@/components/Pagination'  

const orderStatusData = [{id:1,name:"待付款"},{id:2,name:"待发货"},{id:3,name:"已发货"},{id:4,name:"已收货"},{id:5,name:"已完成"},{id:6,name:"已关闭"},{id:7,name:"已退款"}]
export default {
  name: "userOrders",
  components: { Pagination },
  data() {
    return {
      listLoading:true,
      listQuery: {
        page: 1,
        limit: 20,
        bill_no: '',
        dateRange:'',
      },
      orderStatus:orderStatusData,
      tableData: [],
      total: 0,
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
  created(){
    this.init()
  },
  methods:{
    init:function(){
      const id = this.$route.params && this.$route.params.id
      this.getList()
    },
    getList(){
      this.listLoading = true
      fetchsorts(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    searchOrder() {
      this.listQuery.page = 1
      this.getList()
    },
    batchDelete(){
      let selectRecords = this.$refs.xTable.getSelectRecords()
      if (selectRecords.length) {
        //要删除的链接ID
        let ids = []
        for (var i in selectRecords) {
          ids.push(selectRecords[i].id)
        }
        const data = {
          "ids":ids
        }
        deleteOrders(data).then(response=>{
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
  }
}
</script>