import request from '@/utils/request'
/**
 * [fetchAdvcategories 获取广告类别列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchAdvcategories(params){
  return request({
    url:"advs/categories",
    method:"get",
    params
  })
}
/**
 * [fetchAdvcategories 获取广告列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchAdvs(params){
  return request({
    url:"advs/list",
    method:"get",
    params
  })
}
/**
 * [fetchAdvsGetOne 获取单个广告]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchAdvsGetOne(params){
  return request({
    url:"advs/getone",
    method:"get",
    params
  })
}

/**
 * [deleteAdvs 删除广告]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteAdvs(id){
  return request({
    url: 'advs/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createAdvs 创建广告]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createAdvs(data) {
  return request({
    url: 'advs/create',
    method: 'post',
    data
  })
}
/**
 * [updateAdvs 修改广告信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateAdvs(data) {
  return request({
    url: 'advs/update',
    method: 'post',
    data
  })
}
