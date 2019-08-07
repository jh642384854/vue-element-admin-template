import request from '@/utils/request'
/**
 * [fetchList 获取管理员列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchList(params){
  return request({
    url:"adminuser/list",
    method:"get",
    params
  })
}
/**
 * [deleteAdminUser 删除管理员]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteAdminUser(id){
  return request({
    url: 'adminuser/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createAdminUser 创建管理用户]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createAdminUser(data) {
  return request({
    url: 'adminuser/create',
    method: 'post',
    data
  })
}
/**
 * [updateAdminUser 修改管理员信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateAdminUser(data) {
  return request({
    url: 'adminuser/update',
    method: 'post',
    data
  })
}
/**
 * 获取用户的所有角色
 * [fetchAllRoels description]
 * @return {[type]} [description]
 */
export function fetchAllRoels(){
  return request({
    url: '/roles/list',
    method: 'get'
  })
}
