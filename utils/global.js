import { Notification,Message } from 'element-ui';

const SuccessText = "success"
const ErrorText = "error"
const VxeTableSize = "mini"  //有以下几种选择：medium / small / mini
const ImageUploadTips = "只能上传jpg/png文件，且不超过500kb"
const AllowImageSuffix  = "image/jpeg,image/gif,image/png,image/bmp"
const UploadAttachmentUrl =  "http://localhost:9528/dev-api/upload"
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
function uploadImageCheck(file,filelist){
  let fileName = file.name
  let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
  if (regex.test(fileName.toLowerCase())) {
      if(file.size > this.fileSizeLimit){
        Message.error('选择的图片大小不能超过500KB')
        return false
      }
  } else {
      Message.error('请选择图片文件')
      return false
  }
  return true
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
  uploadImageCheck
}