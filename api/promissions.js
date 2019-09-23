import request from '@/utils/request'
/**
 * [fetchList 获取权限列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchPromissionsList(params){
  return request({
    url:"promissions/list",
    method:"get",
    params
  })
}
/**
 * [fetchList 获取权限列表，树形结构]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchPromissionsTreeList(params){
  return request({
    url:"promissions/treelist",
    method:"get",
    params
  })
}
/**
 * [deletePromissions 删除权限]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deletePromissions(id){
  return request({
    url: 'promissions/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createPromissions 创建权限]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createPromissions(data) {
  return request({
    url: 'promissions/create',
    method: 'post',
    data
  })
}
/**
 * [updatePromissions 修改权限信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updatePromissions(data) {
  return request({
    url: 'promissions/update',
    method: 'post',
    data
  })
}