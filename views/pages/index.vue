<template>
  <div class="app-container">
    <vxe-table
      border
      ref="xTable1"
      :data.sync="tableData">
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="catename" width="150" title="所属栏目"></vxe-table-column>
      <vxe-table-column field="title" width="200" title="标题"></vxe-table-column>
      <vxe-table-column field="sort" sortable width="75" title="排序"></vxe-table-column>
      <vxe-table-column field="created_time" sortable  width="200" title="创建时间"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column title="操作" width="120" >
        <template v-slot="{ row }">
          <router-link :to="'/article/pageedit/'+row.id" class="el-button el-button--success el-button--mini">
            <span>修改内容</span>
          </router-link>
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