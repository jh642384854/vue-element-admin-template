const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,
  token: state => state.adminuser.token,
  avatar: state => state.adminuser.avatar,
  username: state => state.adminuser.username,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
}
export default getters
