import {doLogin} from "../../api/login"
const login = {
  state: {
    isLogin: false,
    token: undefined
  },
  actions: {
    login({commit}, payload) {
      return new Promise((resolve) => {
        doLogin(payload).then(res =>{
          commit("SET_TOKEN", res.data);
          if (res.data) {
            commit("SET_IS_LOGIN", true);
          }
          resolve(res.data);
        });
      })
    },
    testLoginStatus({commit}, payload){
      return new Promise(resolve => {
        commit("SET_IS_LOGIN", payload);
        resolve(payload);
      });
    }
  },
  mutations: {
    SET_IS_LOGIN: (state, flag) => {
      state.isLogin = flag
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  }
}

export default login
