import request from "@/utils/request"
/**
 * [fetchList 获取链接列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchListLinks(params){
  return request({
    url: "admin/links/list",
    method:"get",
    params
  })
}
/**
 * [deleteLinks 删除链接]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteLinks(data){
  return request({
    url: "admin/links/delete",
    method: "post",
    data
  })
}
/**
 * [createLinks 创建链接]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createLinks(data) {
  return request({
    url: "admin/links/create",
    method: "post",
    data
  })
}
/**
 * [updateLinks 修改链接信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateLinks(data) {
  return request({
    url: "admin/links/update",
    method: "post",
    data
  })
}
