<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        创建
      </el-button>
    </div>

  </div>
</template>

<script>
import { fetchAdvcategories } from '@/api/advs'

let _this
export default {
  name:"advcategories"
  beforeCreate: function () {
      _this = this
  },
  data(){
    return {
      listLoading:true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
  }
}
</script>