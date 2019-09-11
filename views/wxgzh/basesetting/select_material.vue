<template>
  <div>
    <el-form-item label="消息类型" prop="msgTypeID">
      <el-radio-group v-model="postForm.msgTypeID" @change="clearSelectMaterial">
        <el-radio :label="item.value" v-for="item in msgType" :key="item.value">{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择素材" prop="materialID">
      <div class="el-upload el-upload--picture-card" @click="selectMaterial" v-if="postForm.materialID == ''"><i class="el-icon-plus"></i></div>
      <div class="selectMaterial" v-else>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="materialShow" v-if="postForm.msgTypeID == 'text'">{{ selectMaterialContent }}</div>
            <div class="materialShow" v-else-if="postForm.msgTypeID == 'image'">
              <div class="block" v-if="selectMaterialImage != ''">
                <el-image :src="selectMaterialImage"></el-image>
              </div>
            </div>
            <div class="materialShow" v-else-if="postForm.msgTypeID == 'news'">
              <div class="block" v-if="selectMaterialImage != ''">
                <span class="demonstration">{{ selectMaterialTitle }}</span><br />
                <el-image :src="selectMaterialImage"></el-image>
              </div>
            </div>
            <div class="materialShow" v-else-if="postForm.msgTypeID == 'voice'">
              <div class="block" v-if="selectMaterialVoice != ''">
                <span class="iconfont icon-MP"></span> {{ selectMaterialVoice }}
              </div>
            </div>
            <div class="materialShow" v-else-if="postForm.msgTypeID == 'video'">
              <div class="block" v-if="selectMaterialVideo != ''">
                <span class="iconfont icon-video"></span> {{ selectMaterialVideo }}
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="selectMaterial">重新选择</el-button>
          </el-col>
        </el-row>
      </div>
      <el-input type="hidden" v-model="postForm.materialID" />
    </el-form-item>

    <!-- 文本素材、音频素材、视频素材 -->
    <el-dialog :title="materialTitle" :visible.sync="dialogTextVisible">
      <vxe-table
        border
        ref="xTable"
        class="radio-table"
        height="300"
        :data="gridData"
        row-id="media_id"
        :radio-config="radioConfig"
        :row-class-name="rowClassName"
        @radio-change="radioChangeEvent">
        <vxe-table-column type="radio" width="60">
          <template v-slot:header>
            <vxe-button type="text" @click="clearRadioRowEevnt" :disabled="!selectTextRow">取消</vxe-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="id" width="100" title="编号"></vxe-table-column>
        <vxe-table-column field="content" title="内容"></vxe-table-column>
      </vxe-table>
      <pagination v-show=" total>0 " :total="total"  @pagination="getMaterialList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTextVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmSelectMaterial">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 图片素材(包括图文) -->
    <el-dialog :title="materialTitle" :visible.sync="dialogImageVisible">
      <el-row class="mb10">
        <el-radio-group v-model="selectMaterialRow" @change="getImageMaterial">
          <el-col :span="5" v-for="(item, index) in gridData" :key="item.id" class="mb10" style="margin-right: 20px;"> 
            <el-card :body-style="{ padding: '5px' }" shadow="hover">
              <div class="block" style="text-align: center;">
                <el-image :src="item.url" style="width: 180px; height: 180px" fit="fill"></el-image>
              </div>
              <div style="padding: 14px;">
                <span><el-radio v-model="postForm.materialID" :label="item.media_id">{{ item.name }}</el-radio></span>
              </div>
            </el-card>
          </el-col>
        </el-radio-group>
      </el-row>
      <pagination v-show=" total>0 " :total="total"  @pagination="getMaterialList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImageVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmSelectMaterial">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'  
// 参考手册：https://xuliangzhan.com/xe-utils/index.html#/
import XEUtils from 'xe-utils' 
import { getMaterials } from '@/api/weixin' 
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
      total: 0,
      gridData: [],
      listQuery: {
        page: 1,
        limit: 20,
        type: '',
      },
      radioConfig:{
        trigger: 'row',checkRowKey: ''
      },
      selectMaterialContent:'',
      selectMaterialTitle:'',
      selectMaterialImage:'',
      selectMaterialVoice:'',
      selectMaterialVideo:'',
      dialogTextVisible: false,
      dialogImageVisible:false,
      materialTitle:'选择素材',
      msgType:[{ "name":"文本","value":"text" },{ "name":"图片","value":"image" },{ "name":"图文","value":"news" },{ "name":"音频","value":"voice" },{ "name":"视频","value":"video" }],
      selectTextRow:null,
      selectMaterialRow:'',
      postForm:{
        msgTypeID:'',  //消息类型
        materialID:''  //素材ID
      }
    }
  },
  created() {

  },
  methods: {
    selectMaterial(){
      if(this.postForm.msgTypeID == ''){
        this.$message.error('请先选择消息类型在选择素材')
      }else{
        this.getMaterialList()
        switch (this.postForm.msgTypeID) {
          case 'text':
          case 'voice':
          case 'video':
            this.dialogTextVisible = true
            break;
          case 'image':
          case 'news':
            this.dialogImageVisible = true
            break;    
          default:
            this.dialogTextVisible = true
            break;
        }
      }
    },
    getMaterialList(){
      this.listQuery.type = this.postForm.msgTypeID
      getMaterials(this.listQuery).then(response => {
        this.gridData = response.data.items
        this.total = response.data.total
      })
    },
    radioChangeEvent ({ row }) {
      this.selectTextRow = row
    },
    rowClassName ({ row }) {
      return {
        'row-checked': this.selectTextRow === row
      }
    },
    clearRadioRowEevnt () {
      this.selectTextRow = null
      this.$refs.xTable.clearRadioRow()
    },
    getImageMaterial(row){
      this.selectMaterialRow = row
    },
    clearSelectMaterial(){
      this.selectMaterialContent = ''
      this.selectMaterialTitle = ''
      this.selectMaterialImage = ''
      this.selectMaterialVoice = ''
      this.selectMaterialVideo = ''
      this.$emit('changeMaterialType',this.postForm.msgTypeID)
    },
    //确定素材选择
    confirmSelectMaterial(){
      let msgTypeID = this.postForm.msgTypeID
      switch (msgTypeID) {
        case 'text':
        case 'voice':
        case 'video':
          if(this.selectTextRow != null){
            this.postForm.materialID = this.selectTextRow.id
            if(msgTypeID == "text"){
              this.selectMaterialContent = this.selectTextRow.content
            }else if(msgTypeID == "voice"){
              this.selectMaterialVoice = this.selectTextRow.content
            }else if(msgTypeID == "video"){
              this.selectMaterialVideo = this.selectTextRow.content
            }
            this.dialogTextVisible = false
          }else{
            this.$message.error('请先选择好素材')
          }
          break;
        case 'image':
        case 'news':
          if(this.selectMaterialRow != ''){
            this.gridData.forEach(function(item,index,arr){
              if(item.media_id == _this.selectMaterialRow){
                _this.postForm.materialID = item.media_id
                _this.selectMaterialTitle = item.name
                _this.selectMaterialImage = item.url
              }
            })
            this.dialogImageVisible = false
          }else{
            this.$message.error('请先选择好素材')
          }
          break;
        default:
          this.selectMaterialContent = this.selectTextRow.content
          this.dialogTextVisible = false
          break;
      }
      this.$emit('func',this.postForm)
    }
  }
}
</script>