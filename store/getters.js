const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.adminuser.token,
  avatar: state => state.adminuser.avatar,
  name: state => state.adminuser.name
}
export default getters
