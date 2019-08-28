import { Notification } from 'element-ui';

const SuccessText = "success"
const ErrorText = "error"

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


export default {
  SuccessText,
  msgNotify
}