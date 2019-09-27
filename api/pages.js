import request from "@/utils/request"
/**
 * [fetchList 获取单页列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchList(params){
  return request({
    url: "admin/pages/list",
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
    url: "admin/pages/getone",
    method:"get",
    params
  })
}

/**
 * [createpages 创建或保存单页]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function savePages(data) {
  return request({
    url: "admin/pages/save",
    method: "post",
    data
  })
}

