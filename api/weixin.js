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
/**
 * [getOneWxgzhSetting 获取某个公众号的设置信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function getOneWxgzhSetting(params){
  return request({
    url:"wx/getonegzh",
    method:"get",
    params
  })
}


/**
 * 公众号素材相关接口
 */

/**
 * [getMaterials 获取指定类型的永久素材列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function getMaterials(params){
  return request({
    url:"wx/getmaterial",
    method:"get",
    params
  })
}


/**
 * 消息管理
 */
/**
 * [saveWelcomeMsg 配置关注后的欢迎语]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function setWelcomeMsg(data){
  return request({
    url:"wx/configWelcomeMsg",
    method:"post",
    data
  })
}
/**
 * [saveWelcomeMsg 获取关注后的欢迎语配置信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function getWelcomeMsg(params){
  return request({
    url:"wx/configWelcomeMsg",
    method:"get",
    params
  })
}