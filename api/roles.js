import request from "@/utils/request"
/**
 * [fetchList 获取角色列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchRolesList(params){
  return request({
    url: "admin/roles/list",
    method: "get",
    params
  })
}
/**
 * [deleteRoles 删除角色]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteRoles(id){
  return request({
    url: "admin/roles/delete",
    method: "get",
    params: { id }
  })
}
/**
 * [createRoles 创建管理用户]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function createRoles(data) {
  return request({
    url: "admin/roles/create",
    method: "post",
    data
  })
}
/**
 * [updateRoles 修改角色信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function updateRoles(data) {
  return request({
    url: "admin/roles/update",
    method: "post",
    data
  })
}
/**
 * [updateRoles 保存角色权限信息]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function saveRolePermission(data) {
  return request({
    url: "admin/roles/savepermission",
    method: "post",
    data
  })
}
/**
 * [fetchList 获取角色列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function fetchRolePermissions(params){
  return request({
    url: "admin/roles/getpermissions",
    method: "get",
    params
  })
}