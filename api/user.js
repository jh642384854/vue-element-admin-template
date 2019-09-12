import request from '@/utils/request'
/**
 * [fetchUserList 获取用户列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchUserList(params){
  return request({
    url:"user/list",
    method:"get",
    params
  })
}

/**
 * [getOneUserInfo 获取单个用户信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function getOneUserInfo(params){
  return request({
    url:"user/getone",
    method:"get",
    params
  })
}

/**
 * [getUserConfig 获取用户配置相关信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function getUserConfig(params){
  return request({
    url:"user/config",
    method:"get",
    params
  })
}
/**
 * [saveUserInfo 创建或更新用户基本信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function saveUserInfo(data) {
  return request({
    url: 'user/save',
    method: 'post',
    data
  })
}
/**
 * [deleteOneUser 删除单个用户信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function deleteOneUser(params){
  return request({
    url:"user/delete",
    method:"get",
    params
  })
}



