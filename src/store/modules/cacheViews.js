
const cacheViews = {
  namespaced: true,
  state: {
    cachedViews: [],
    cachedTags: []
  },
  mutations: {
    'ADD_CACHED_VIEW': (state, view) => {
      if (!state.cachedViews.some(value => value.name === view.name)) {
        state.cachedViews.push(view);
      }
    }
    ,
    'ADD_CACHED_TAGS': (state, view) => {
      if (!state.cachedTags.includes(view.name)) {
        state.cachedTags.push(view.name);
      }
    },
    'DEL_CACHED_TAGS': (state, view) => {
      let index = state.cachedTags.indexOf(view.name);
      index > -1 && state.cachedTags.splice(index, 1);
    },
    'DEL_CACHED_VIEW': (state, view) => {
      for (const [i, v] of state.cachedViews.entries()) {
        if (v.path === view.path) {
          state.cachedViews.splice(i, 1);
          break;
        }
      }
    }
  },
  actions: {
    addView({dispatch}, view){
      dispatch('addCachedTag', view);
      dispatch('addCachedView', view);
    },
    delView({dispatch, state}, view){
      return new Promise(resolve => {
        dispatch('delCachedTag', view);
        dispatch('delCachedView', view);
        resolve({
          cachedViews: [...state.cachedViews],
          cachedTags: [...state.cachedTags]
        })
      })
    },
    addCachedView({commit}, view){
      commit('ADD_CACHED_VIEW', view);
    },
    addCachedTag({commit}, view){
      commit('ADD_CACHED_TAGS', view);
    },
    delCachedView({commit}, view){
      commit('DEL_CACHED_VIEW', view);
    },
    delCachedTag({commit}, view){
      commit('DEL_CACHED_TAGS', view);
    }
  }
}

export default cacheViews
