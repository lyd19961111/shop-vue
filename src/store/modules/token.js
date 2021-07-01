export default {
  state: {
    token: ''
  },
  mutations: {
    setToken (state, val) {
      state.token = val
      console.log('1234', state.token)
    }
  },
  actions: {}
}
