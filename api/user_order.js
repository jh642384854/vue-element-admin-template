import request from '@/utils/request'
/**
 * [fetchListOrders 获取订单列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchListOrders(params){
  return request({
    url:"user/orders/list",
    method:"get",
    params
  })
}

/**
 * [deleteOrders 删除订单]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function deleteOrders(data){
  return request({
    url: 'user/orders/delete',
    method: 'post',
    data
  })
}