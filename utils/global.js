import { Notification,Message } from 'element-ui';

//import SparkMD5 from 'spark-md5'
import SparkMD5 from 'spark-md5'

const SuccessText = "success"
const ErrorText = "error"
const VxeTableSize = "mini"  //有以下几种选择：medium / small / mini
const ImageUploadTips = "只能上传jpg/png文件，且不超过500kb"
const AllowImageSuffix  = "image/jpeg,image/gif,image/png,image/bmp"
const UploadAttachmentUrl =  "http://localhost:9528/dev-api/admin/upload"   //http://localhost:9528/dev-api/admin/upload   ///admin/upload
//微信公众号类型
const WxGzhType = [{value:1,label:'普通订阅号'},{value:2,label:'微信认证订阅号'},{value:3,label:'普通服务号'},{value:4,label:'微信认证服务号'}]
//问下公众号加密方式
const WxGzhEncodeType = [{value:1,label:'明文模式'},{value:2,label:'兼容模式'},{value:3,label:'安全模式（推荐）'}]
//当前操作的微信公众号Token
const WxCurrentIDToken = 'wx_current_id_token'

/**
 * [successNotify 全局操作成功提示]
 * @param  {[type]} $msg [description]
 * @return {[type]}      [description]
 */
function msgNotify($type="success",$title="成功",$msg,$duration=2000){
  let options = {
    title: $title,
    message: $msg,
    type: $type,
    duration: $duration
  }
  if($type == "success"){
    return Notification.success(options)
  }else if ($type == "error") {
    return Notification.error(options)
  }
}
/**
 * [uploadImageCheck 校验上传图片的合法性]
 * @param  {[type]} file     [description]
 * @param  {[type]} filelist [description]
 * @return {[type]}          [description]
 */
function uploadImageCheck(file,fileSizeLimit=512000){
  let fileName = file.name
  let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
  let sizeLimit = fileSizeLimit/1024
  if (regex.test(fileName.toLowerCase())) {
      if(file.size > fileSizeLimit){
        Message.error('选择的图片大小不能超过'+sizeLimit+'KB')
        return false
      }
  } else {
      Message.error('请选择图片文件')
      return false
  }
  return true
}

/**
 * [splitStringToInterArrray 拆分字符串数字并转换为整数数组]
 * @param  {[type]} stringids [description]
 * @return {[type]}           [description]
 */
function splitStringToInterArrray(stringids){
  var dataIntArr=[]//保存转换后的整型字符串   
  let stringidArrays = stringids.split(',')
  stringidArrays.forEach(function(data,index,arr){
    dataIntArr.push(parseInt(data))
  })
  return dataIntArr
}
/**
 * [getFileMd5 获取上传文件的MD5值]
 * @param  {[type]} file [上传的文件对象]
 * @return {[type]}      [上传文件的md5值]
 * 参考https://www.liangzl.com/get-article-detail-8982.html
 * https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
 */
function getFileMd5(file,callback) {
    let fileReader = new FileReader()
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    let currentChunk = 0
    const chunkSize = 10 * 1024 * 1000
    let chunks = Math.ceil(file.size / chunkSize)
    let spark = new SparkMD5.ArrayBuffer()
    loadNext()
    fileReader.onload = (e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
            currentChunk++
            loadNext()
        } else {
            let md5 = spark.end()
            callback(md5)
        }
    })
    fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
    }
    function loadNext() {
        let start = currentChunk * chunkSize
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.raw, start, end))
    }
}

export default {
  VxeTableSize,
  SuccessText,
  AllowImageSuffix,
  UploadAttachmentUrl,
  ImageUploadTips,
  WxGzhType,
  WxGzhEncodeType,
  WxCurrentIDToken,
  msgNotify,
  uploadImageCheck,
  getFileMd5,
  splitStringToInterArrray,
}