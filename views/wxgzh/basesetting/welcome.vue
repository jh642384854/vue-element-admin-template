<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="postForm" label-position="left" label-width="100px">
      <el-form-item label="消息类型" prop="msgTypeID">
        <el-radio-group v-model="postForm.msgTypeID">
          <el-radio :label="item.value" v-for="item in msgType">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择素材" prop="materialID">
        <div class="el-upload el-upload--picture-card" @click="selectMaterial" v-if="postForm.materialID == ''"><i class="el-icon-plus"></i></div>
        <div class="selectMaterial" v-else>
          <el-row :gutter="20">
            <el-col :span="8">
              {{ materialContent }}
            </el-col>
            <el-col :span="4">
              <el-button type="success" @click="selectMaterial">重新选择</el-button>
            </el-col>
          </el-row>
          
        </div>
        <el-input type="hidden" v-model="postForm.materialID" />

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择素材" :visible.sync="dialogTableVisible">
      <vxe-table
        border
        ref="xTable1"
        class="radio-table"
        height="300"
        :data="gridData"
        :radio-config="{ trigger: 'row'}"
        :row-class-name="rowClassName"
        @radio-change="radioChangeEvent">
        <vxe-table-column type="radio" width="60">
          <template v-slot:header>
            <vxe-button type="text" @click="clearRadioRowEevnt" :disabled="!selectRow">取消</vxe-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="id" title="编号"></vxe-table-column>
        <vxe-table-column field="content" title="内容"></vxe-table-column>
      </vxe-table>
      <pagination v-show=" total>0 " :total="total"  @pagination="getMaterialList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
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
import { getMaterials,setWelcomeMsg,getWelcomeMsg } from '@/api/weixin' 
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
      materialContent:'',
      dialogTableVisible: false,
      msgType:[{ "name":"文本","value":"text" },{ "name":"图片","value":"image" },{ "name":"图文","value":"news" },{ "name":"音频","value":"voice" },{ "name":"视频","value":"video" }],
      selectRow:null,
      postForm:{
        msgTypeID:'',  //消息类型
        materialID:''  //素材ID
      },
      rules:{
        msgTypeID: [{ required: true, message: '消息类型必须要选择', trigger: 'blur' }],
        materialID: [{ required: true, message: '素材必须选择', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      let currentWxID = Cookies.get(this.GLOBAL.WxCurrentIDToken)
      let params = {
        "wid":currentWxID
      }
      getWelcomeMsg(params).then((response) => {
        if(response.data.status == this.GLOBAL.SuccessText){
          this.postForm = response.data.results[0]
          //TODO 这个地方还需要修改，根据获取的素材ID来渲染materialContent。目前这样是有问题的
          this.materialContent = response.data.results[0].materialID
        }else{
          this.GLOBAL.msgNotify('error','失败',response.data.msg)
        }
      })
    },
    submitForm(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setWelcomeMsg(this.postForm).then((response) => {
            if(response.data.status == this.GLOBAL.SuccessText){
              this.GLOBAL.msgNotify('success','成功',response.data.msg)
            }else{
              this.GLOBAL.msgNotify('error','失败',response.data.msg)
            }
          })
        }
      })
    },
    selectMaterial(){
      if(this.postForm.msgTypeID == ''){
        this.$message.error('请先选择消息类型在选择素材')
      }else{
        this.getMaterialList()
        this.dialogTableVisible = true
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
      this.selectRow = row
    },
    rowClassName ({ row }) {
      return {
        'row-checked': this.selectRow === row
      }
    },
    clearRadioRowEevnt () {
      this.selectRow = null
      this.$refs.xTable1.clearRadioRow()
    },
    //确定素材选择
    confirmSelectMaterial(){
      if(this.selectRow != null){
        this.postForm.materialID = this.selectRow.id
        this.materialContent = this.selectRow.content
        this.dialogTableVisible = false
      }else{
        this.$message.error('请先选择好素材')
      }
    }
  }
}
</script>