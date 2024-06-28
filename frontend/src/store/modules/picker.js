const picker = {
    namespaced: true,
    state: {
        data: [],
    },
    getters: {
        data: state => state.data,
    },
    mutations: {
        setData(state, data) {
            state.data = data.value;
        },
    },
    actions: {
        async fetchData({ commit }) {
            const response = await fetch('https://api.icndb.com/jokes/random/15');
            const data = await response.json();
            commit('setData', data);
        },
    },
};

export default picker

