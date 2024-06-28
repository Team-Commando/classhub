export default {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        data: state => state.data,
    },
    actions: {
        async fetchData({ commit }) {
            const response = await fetch('https://api.icndb.com/jokes/random/15');
            const data = await response.json();
            commit('setData', data);
        },
    },
    mutations: {
        setData(state, data) {
            state.data = data.value;
        },
    },
};
