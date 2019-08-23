import request from '@/utils/request'
/**
 * [fetchList 获取文章列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchListArticles(params){
  return request({
    url:"articles/list",
    method:"get",
    params
  })
}
/**
 * [fetchList 获取单个文章]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchArticlesGetOne(params){
  return request({
    url:"articles/getone",
    method:"get",
    params
  })
}
/**
 * [fetchList 获取文章标签]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchArticlesAttributes(params){
  return request({
    url:"articles/attributes",
    method:"get",
    params
  })
}
/**
 * [deleteArticles 删除文章]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteArticles(id){
  return request({
    url: 'articles/delete',
    method: 'get',
    params: { id }
  })
}
/**
 * [createArticles 创建文章]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createArticles(data) {
  return request({
    url: 'articles/create',
    method: 'post',
    data
  })
}
/**
 * [updateArticles 修改文章信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateArticles(data) {
  return request({
    url: 'articles/update',
    method: 'post',
    data
  })
}