import request from '@/utils/request'

/**
 * [fetchListWxgzh 公众号列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchListWxgzh(params){
  return request({
    url:"wx/list",
    method:"get",
    params
  })
}
/**
 * [createWxgzhSetting 创建微信公众号配置]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createWxgzhSetting(data) {
  return request({
    url: 'wx/creategzh',
    method: 'post',
    data
  })
}

/**
 * [updateWxgzhSetting 更新微信公众号配置]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateWxgzhSetting(data) {
  return request({
    url: 'wx/updategzh',
    method: 'post',
    data
  })
}
/**
 * [deleteArticles 删除微信公众号]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteWxgzhSetting(data){
  return request({
    url: 'wx/deletegzh',
    method: 'post',
    data
  })
}

export function getOneWxgzhSetting(params){
  return request({
    url:"wx/getonegzh",
    method:"get",
    params
  })
}