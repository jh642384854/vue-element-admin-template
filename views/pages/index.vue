<template>
  <div class="app-container">
    <vxe-table
      border
      ref="xTable1"
      :data.sync="tableData"
      :row-class-name="tableRowClassName"
      >
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column field="catename" width="150" title="所属栏目"></vxe-table-column>
      <vxe-table-column field="title" width="200" title="标题"></vxe-table-column>
      <vxe-table-column field="sort" sortable width="75" title="排序"></vxe-table-column>
      <vxe-table-column field="status" :filters="statusData" :formatter="formatterStatus" width="75" title="状态"></vxe-table-column>
      <vxe-table-column field="created_time" sortable  width="200" title="创建时间"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success">
          <router-link :to="'/article/pageedit/'+row.id" class="link-type">
            <span>编辑</span>
          </router-link>
          </el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  
    <pagination v-show="total>0" :total="total"  @pagination="getList" />

  </div>
</template>

<script>
import { fetchList,deletePages,createPages,updatePages } from '@/api/pages'  
import { fetchListSingle } from '@/api/categories' 

import Pagination from '@/components/Pagination'   
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
export default {
  name: 'Pages',
  components: { Pagination },
  filters: {

  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      statusData:[{label: '正常', value: 1}, {label: '禁用', value: 0}],
      tableData: [],
      total: 0,
      singleCategories:[],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
      })
    },
    formatterStatus({ cellValue }) {
      return cellValue === 1 ? '正常' : cellValue === 0 ? '禁用' : ''
    },
    tableRowClassName({row, rowIndex}) {
      if(!row.status){
        return 'warning-row';
      }
      return '';
    }
  }
}
</script>

<style>
.vxe-table--body .warning-row {
  background: oldlace;
}

.vxe-table--body .success-row {
  background: #f0f9eb;
}
</style>