import request from '@/utils/request'
/**
 * [fetchList 获取系统配置]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchSysConfig(params){
  return request({
    url:"settings/sys",
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
    url: 'settings/sys',
    method: 'post',
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
    url:"settings/email",
    method:"get",
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
    url: 'settings/email',
    method: 'post',
    data
  })
}
