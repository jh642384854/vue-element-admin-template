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
 * [fetchAdvcategories 获取广告类型]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchAdvcateTypes(params){
  return request({
    url:"advs/catetypes",
    method:"get",
    params
  })
}

/**
 * [fetchAdvsGetOne 获取单个广告类别]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchAdvCatesGetOne(params){
  return request({
    url:"advs/getonecate",
    method:"get",
    params
  })
}

/**
 * [deleteAdvs 删除广告类别]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteAdvCates(id){
  return request({
    url: 'advs/deletecate',
    method: 'get',
    params: { id }
  })
}
/**
 * [createAdvs 创建广告类别]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createAdvCates(data) {
  return request({
    url: 'advs/createcate',
    method: 'post',
    data
  })
}
/**
 * [updateAdvs 修改广告类别信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateAdvCates(data) {
  return request({
    url: 'advs/updatecate',
    method: 'post',
    data
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
 * [deleteAdvs 删除广告，可以单个删除，也可以批量删除]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteAdvs(data){
  return request({
    url: 'advs/delete',
    method: 'post',
    data
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
