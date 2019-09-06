<template>
  <div class="app-container" :loading="listLoading">
    <el-row class="mb10">
      <!-- :offset="index > 0 ? 2 : 0" -->
      <el-col :span="3" v-for="(item, index) in tableData" :key="item.id" class="mb10" style="margin-right: 10px;"> 
        <el-card :body-style="{ padding: '5px' }" shadow="hover">
          <div class="block" style="text-align: center;">
            <el-image :src="item.logo" style="width: 180px; height: 180px" fit="fill"></el-image>
          </div>
          <div style="padding: 14px;">
            <span><el-radio v-model="radio" :label="item.id">{{ item.name }}</el-radio></span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: center;">
        <el-button type="primary" @click="selectWx">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

import { fetchListWxgzh } from '@/api/weixin'   
export default {
  name: 'NoSelectWxgzh',
  data() {
    return {
      listLoading:true,
      tableData:[],
      radio:1
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList() {
      this.listLoading = true
      fetchListWxgzh().then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    selectWx(){
      Cookies.set(this.GLOBAL.WxCurrentIDToken,this.radio)
      this.$router.push('/wxgzh/basesetting')
    }
  }
}
</script>
<style>
.el-card{ border:none; }
</style>