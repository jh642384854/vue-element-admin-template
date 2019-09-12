import { login, logout, getInfo } from '@/api/adminuser'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if(response.data.status == "success"){
          const data  = response.data.results
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }else{
          reject(response.data.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if(response.data.status == "success"){
          const data  = response.data.results
          if (!data) {
            reject('用户名密码验证失败，请重试')
          }
          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }else{
          reject(response.data.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

