import request from '@/utils/request'
/**
 * [fetchList 获取栏目列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchList(params){
  return request({
    url:"categories/list",
    method:"get",
    params
  })
}
/**
 * [fetchList 获取单页栏目列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchListSingle(params){
  return request({
    url:"categories/singlelist",
    method:"get",
    params
  })
}
/**
 * [fetchList2 vxe-table实验例子]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchList2(params){
  return request({
    url:"categories/list2",
    method:"get",
    params
  })
}
/**
 * [deletecategories 删除栏目]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteCategories(id){
  return request({
    url: 'categories/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createcategories 创建栏目]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createCategories(data) {
  return request({
    url: 'categories/create',
    method: 'post',
    data
  })
}
/**
 * [updatecategories 修改栏目信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateCategories(data) {
  return request({
    url: 'categories/update',
    method: 'post',
    data
  })
}
