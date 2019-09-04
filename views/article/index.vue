<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="请输入标题" style="width: 200px;" class="filter-item" @keyup.enter.native="searchArticle" />
      <el-cascader v-model="listQuery.pid" :options="categories" :props="categoriesProps" clearable filterable></el-cascader>
      <el-select v-model="listQuery.importance" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in articleStatus" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchArticle">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
        <router-link :to="'/article/add'" class="link-type">
          <span>创建</span>
        </router-link>
      </el-button>
      <el-button class="filter-item mr10" type="danger"  icon="el-icon-delete" @click="batchDelete()">删除</el-button>
    </div>

    <vxe-table border
      ref="xTable"
      :size="GLOBAL.VxeTableSize"
      :loading="listLoading"
      :data.sync="tableData"
      :row-class-name="tableRowClassName"
      >
      <vxe-table-column type="selection" width="60"></vxe-table-column>
      <vxe-table-column field="catename" width="150" title="所属栏目"></vxe-table-column>
      <vxe-table-column field="title" width="200" title="标题"></vxe-table-column>
      <vxe-table-column field="sort" sortable width="75" title="排序"></vxe-table-column>
      <vxe-table-column field="status"  width="75" title="状态">
        <template slot-scope="scope">
          {{ scope.row.status | statusFilter }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="created_time" sortable  width="200" title="创建时间" :formatter="formatTime">
      </vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="success">
          <router-link :to="'/article/articleedit/'+row.id" class="link-type">
            <span>编辑</span>
          </router-link>
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
  
    <pagination v-show="total>0" :total="total"  @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/categories'
import { fetchListArticles,deleteArticles,fetchArticlesAttributes } from '@/api/articles'  

// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
import XEUtils from 'xe-utils'

import Pagination from '@/components/Pagination'   
//声明一个全局变量，这个变量在vue beforeCreate()生命周期被指向vue实例
let _this;
export default {
  name: 'Pages',
  components: { Pagination },
  filters: {
    statusFilter(status){
      let statusName = '';
      for (var i in _this.articleStatus) {
        if(_this.articleStatus[i]['value'] == status){
          statusName = _this.articleStatus[i]['name']
          break
        }
      }
      return statusName
    }
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      listLoading:true,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        pid: '',
        sort: '',
        dateRange:'',
      },
      categories: [],
      categoriesProps:{
        value:'id',
        label:'name',
        children:'children',
        checkStrictly:true    //可以直接选择父栏目(当没有父栏目没有子栏目的时候，这个选项就很有用)
      },
      articleTags: [],
      articleAttributes:[],
      articleStatus:[],
      tableData: [],
      total: 0,
      singleCategories:[],
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
    this.getList()
    this.getArticleAttribute()
  },
  methods: {
    getList() {
      this.listLoading = true
      //获取栏目列表
      fetchList(this.listQuery).then(response => {
        this.categories = response.data.items
      })
      fetchListArticles().then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getArticleAttribute(){
      //获取文章的其他相关属性
      fetchArticlesAttributes().then(response => {
        this.articleTags = response.data.tags
        this.articleAttributes = response.data.attributes
        this.articleStatus = response.data.status
      })
    },
    searchArticle() {
      this.listQuery.page = 1
      this.getList()
    },
    formatTime({ cellValue, row, column }){
      //XEUtils参考https://xuliangzhan.github.io/xe-utils/
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
    },
    tableRowClassName({row, rowIndex}) {
      if(!row.status){
        return 'warning-row';
      }
      return '';
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
        deleteArticles(data).then(response=>{
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
    handleDelete(row) {
      this.$confirm('确定要删除该记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃'
      }).then(() => {
        const data = {
          "ids":row.id
        }
        deleteArticles(data).then(response=>{
          this.GLOBAL.msgNotify('success','成功',response.data.msg)
          const index = this.tableData.indexOf(row)
          this.tableData.splice(index, 1)
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

<style type="scoped">
.filter-container .filter-item{
  vertical-align:top
}
//表格数据高亮显示样式
.vxe-table--body .warning-row {
  background: oldlace;
}

.vxe-table--body .success-row {
  background: #f0f9eb;
}
</style>