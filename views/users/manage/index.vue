<template>
  <div class="app-container">
    <div class="user_info_show">
      <el-row :gutter="20" class="user_info_title">
        <el-col :span="1">
          <el-image style="width: 40px; height: 40px" src="http://up.qqjia.com/z/14/tu17250_9.jpg" class="user_avator"></el-image>
        </el-col>
        <el-col :span="1">阮腾</el-col>
        <el-col :span="12">
          积分:0个 优惠券:0张 添加时间:2019-09-18 11:21:57
        </el-col>
      </el-row>
      <el-row :gutter="20" class="user_info_title">
        <el-col :span="4">性别：男</el-col>
        <el-col :span="4">状态：正常</el-col>
        <el-col :span="4">分组：用户分组1</el-col>
        <el-col :span="4">来源：微信小程序</el-col>
      </el-row>
    </div>
    <el-menu :default-active="activeIndex" class="mb10" mode="horizontal">
      <el-menu-item index="1">
        <router-link :to="'/user/usermanage/'+uid+'/order'">订单</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link :to="'/user/usermanage/'+uid+'/coupon'">优惠券</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link :to="'/user/usermanage/'+uid+'/point'">积分</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link :to="'/user/usermanage/'+uid+'/bind'">绑定记录</router-link>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>
<script>
import XEUtils from 'xe-utils'  
  export default {
    data() {
      return {
        uid :'',
        activeIndex: '1',
        menuData:['order','coupon','point','bind']
      }
    },
    created(){
      this.init()
    },
    methods: {
      init(){
        const id = this.$route.params && this.$route.params.id
        this.uid = id
        const path = this.$route.path
        const curMenuLink = path.substring(path.lastIndexOf("/")+1)
        this.activeIndex = (XEUtils.arrayIndexOf(this.menuData,curMenuLink)+1).toString()
      }
    }
  }
</script>

<style scoped>
.user_avator{ border-radius: 100px; }
</style>