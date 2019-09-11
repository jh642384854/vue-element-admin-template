<template>
  <div>
      <div class="current_wxgzh_title">
        当前操作的公众号是：<span class="title">{{ gzhTitle }}</span>
        切换公众号：
        <el-select v-model="changewid" placeholder="请选择">
          <el-option v-for="item in tableData" :key="item.id" :label="item.name"  :value="item.id"></el-option>
        </el-select>
        <el-button type="success" @click="changeGzh" v-if="changewid != wid">确定</el-button>
      </div>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" v-if="hasSelectWx">
        <el-menu-item index="1">
          <router-link to="/wxgzh/basesetting/welcome">欢迎语设置</router-link>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">自定义回复</template>
          <el-menu-item index="2-1">
            <router-link to="/wxgzh/basesetting/diyreply/list">自定义回复</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/wxgzh/basesetting/diyreply/create">创建自定义回复</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="3">
          <router-link to="/wxgzh/basesetting/unknowreply">未识别回复</router-link>
        </el-menu-item>
        <el-submenu index="4">
          <template slot="title">素材管理</template>
          <el-menu-item index="4-1">
            <router-link to="/wxgzh/basesetting/material/text">文本素材</router-link>
          </el-menu-item>
          <el-menu-item index="4-2">
            <router-link to="/wxgzh/basesetting/material/picture">图片素材</router-link>
          </el-menu-item>
          <el-menu-item index="4-3">
            <router-link to="/wxgzh/basesetting/material/picture_text">图文素材</router-link>
          </el-menu-item>
          <el-menu-item index="4-4">
            <router-link to="/wxgzh/basesetting/material/voice">语音素材</router-link>
          </el-menu-item>
          <el-menu-item index="4-5">
            <router-link to="/wxgzh/basesetting/material/video">视频素材</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="5">
          <router-link to="/wxgzh/basesetting/user">用户分组</router-link>
        </el-menu-item>
        <el-menu-item index="6">
          <router-link to="/wxgzh/basesetting/diymenu">自定义菜单</router-link>
        </el-menu-item>
        <el-menu-item index="7">
          <router-link to="/wxgzh/basesetting/group_message">群发消息</router-link>
        </el-menu-item>
        <el-menu-item index="8">
          <router-link to="/wxgzh/basesetting/tpl_message">模版消息</router-link>
        </el-menu-item>
      </el-menu>
      <router-view></router-view>
  </div>
</template>

<script>
import Cookies from 'js-cookie' 
import XEUtils from 'xe-utils'
import { fetchListWxgzh } from '@/api/weixin' 

//主要导航
const menulink = ['welcome','diyreply','unknowreply','material','user','diymenu','group_message','tpl_message'];
//自动回复子导航
const diyreplyMaterial = ['list','create','edit']
//素材管理子导航
const material = ['text','picture','picture_text','voice','video']
let _this

export default {
    data() {
      return {
        gzhTitle:'我的公众号',
        hasSelectWx: false,
        activeIndex: '1',
        wid:'',
        changewid:'',
        tableData:[]
      };
    },
    created() {
      this.init()
      this.getGzhList()
    },
    beforeCreate: function () {
      _this = this
    },
    methods: {
      //初始化方法，获取查找的公众号和当前导航样式高亮处理
      init(){
        let currentWxID = Cookies.get(this.GLOBAL.WxCurrentIDToken)
        if(currentWxID != 'undefined' && currentWxID >0){
          this.hasSelectWx = true
          this.wid = this.changewid = parseInt(currentWxID)
        }else{
          this.$router.push('/wxgzh/noselectwx')
        }
        const path = this.$route.path
        const curMenuLink = path.substring(path.lastIndexOf("/")+1)
        if(XEUtils.includes(diyreplyMaterial,curMenuLink)){
          this.activeIndex = '2-'+(XEUtils.arrayIndexOf(diyreplyMaterial,curMenuLink)+1)
        }else if(XEUtils.includes(material,curMenuLink)){
          this.activeIndex = '4-'+(XEUtils.arrayIndexOf(material,curMenuLink)+1)
        }else{
          this.activeIndex = (XEUtils.arrayIndexOf(menulink,curMenuLink)+1).toString()
        }
      },
      //获取所有可操作的公众号
      getGzhList(){
        fetchListWxgzh().then(response => {
          this.tableData = response.data.items
          if(this.tableData.length > 0){
            this.tableData.forEach(function(item,index,arr){
              if(item.id == _this.wid){
                _this.gzhTitle = item.name
              }
            })
          }
        })
      },
      //切换公众号
      changeGzh(){
        Cookies.set(this.GLOBAL.WxCurrentIDToken,this.changewid)
        window.location.reload()
      }
    }
  }
</script>

<style scoped>
.current_wxgzh_title{ line-height: 35px;height: 35px;padding-left: 15px; font-size: 14px; margin-top: 10px; }
.current_wxgzh_title span.title{ color: #F00; }
.el-menu-item a{ display: block; }
</style>