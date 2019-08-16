import request from '@/utils/request'
/**
 * [fetchList 获取单页列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchList(params){
  return request({
    url:"pages/list",
    method:"get",
    params
  })
}
/**
 * [fetchList 获取单页列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchPages(params){
  return request({
    url:"pages/getone",
    method:"get",
    params
  })
}

/**
 * [deletepages 删除单页]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deletePages(id){
  return request({
    url: 'pages/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createpages 创建单页]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createPages(data) {
  return request({
    url: 'pages/create',
    method: 'post',
    data
  })
}
/**
 * [updatepages 修改单页信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updatePages(data) {
  return request({
    url: 'pages/update',
    method: 'post',
    data
  })
}
