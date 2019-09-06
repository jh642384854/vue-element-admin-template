<template>
  <div class="app-container">
    <div class="wxgzh_title mb10">
      <span class="iconfont icon-yooxi"></span> 我的公众号
      <div class="create_gzh">
        <router-link to="/wxgzh/create" class="el-button el-button--success el-button--mini">
            <span>创建公众号</span>
          </router-link>
      </div>
    </div>

    <vxe-table ref="xTable" :size="GLOBAL.VxeTableSize" :data.sync="tableData" :loading="listLoading">
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="gzhtype" title="公众号类型" width="120" :formatter="formatterGzhtype"></vxe-table-column>
      <vxe-table-column field="name" title="公众号名称"  width="150"></vxe-table-column>
      <vxe-table-column field="originalID" title="公众号原始ID"  width="100"></vxe-table-column>
      <vxe-table-column field="appid" title="AppID" width="80"></vxe-table-column>
      <vxe-table-column field="url" title="Url"  width="150" show-overflow></vxe-table-column>
      <vxe-table-column field="encodeType" title="消息加密方式" width="120" :formatter="formatterEncodeType"></vxe-table-column>
      <vxe-table-column field="description" title="描述" show-overflow></vxe-table-column>
      <vxe-table-column field="created_time" title="创建时间"  width="150"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <el-button type="primary" @click="wxBaseSetting(row)">
            <span>基础功能配置</span>
          </el-button>
          <el-button type="warning">
          <router-link :to="'/wxgzh/paysetting/'+row.id" class="link-type">
            <span>支付配置</span>
          </router-link>
          </el-button>
          <el-button type="success">
          <router-link :to="'/wxgzh/edit/'+row.id" class="link-type">
            <span>编辑</span>
          </router-link>
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
import Cookies from 'js-cookie'

import { fetchListWxgzh,deleteWxgzhSetting } from '@/api/weixin'  

import Pagination from '@/components/Pagination' 

let _this;
export default {
  name: 'wxgzhList',
  components: { Pagination },
  filters: {
  },
  beforeCreate: function () {
      _this = this
  },
  data() {
    return {
      listLoading:true,
      tableData: [],
      total: 0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListWxgzh().then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    formatterGzhtype({ cellValue, row, column }){
      let typeText = ''
      for (var i in this.GLOBAL.WxGzhType) {
        if(this.GLOBAL.WxGzhType[i].value == cellValue){
          typeText = this.GLOBAL.WxGzhType[i].label
          break
        }
      }
      return typeText
    },
    formatterEncodeType({ cellValue, row, column }){
      let typeText = ''
      for (var i in this.GLOBAL.WxGzhEncodeType) {
        if(this.GLOBAL.WxGzhEncodeType[i].value == cellValue){
          typeText = this.GLOBAL.WxGzhEncodeType[i].label
          break
        }
      }
      return typeText
    },
    wxBaseSetting(row){
      Cookies.set(this.GLOBAL.WxCurrentIDToken,row.id)
      this.$router.push('/wxgzh/basesetting/welcome')
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
        deleteWxgzhSetting(data).then(response=>{
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

<style>
.wxgzh_title{ height: 30px;line-height: 30px; }
.create_gzh{ float: right; }
</style>