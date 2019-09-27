import request from "@/utils/request"
/**
 * [fetchList 获取系统配置]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchSysConfig(params){
  return request({
    url: "admin/settings/sys",
    method:"get",
    params
  })
}
/**
 * [deleteLinks 保存系统配置]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function saveSysConfig(data){
  return request({
    url: "admin/settings/sys",
    method: "post",
    data
  })
}
/**
 * [fetchList 获取邮件配置]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchEmailConfig(params){
  return request({
    url: "admin/settings/email",
    method: "get",
    params
  })
}
/**
 * [deleteLinks 保存邮件配置]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function saveEmailConfig(data){
  return request({
    url: "admin/settings/email",
    method: "post",
    data
  })
}

/**
 * [fetchList 获取邮件配置]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchCustomConfig(params){
  return request({
    url:"settings/customvariables",
    method:"get",
    params
  })
}
/**
 * [saveEmailConfig 保存自定义配置]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function saveCustomConfig(data){
  return request({
    url: "admin/settings/customvariables",
    method: "post",
    data
  })
}
