const picker = {
    namespaced: true,
    state: {
        pickerType: 0,
        message: {},
        currentComponent: "",
        question: "",
        choices: [],
        questionId: 0,
    },
    getters: {
        pickerType: state => state.pickerType,
    },
    mutations: {
        setPickerType(state, pickerType) {
            state.pickerType = pickerType;
        },
        setCurrentComponent(state, componentName) {
            state.currentComponent = componentName;
        },
        setQuestionAndChoices(state, { question, choices }) {
            state.question = question;
            state.choices = choices;
        },
        setQuestionId(state, questionId){
            state.questionId = questionId;
        }

    },
    actions: {
        async fetchData({ commit }) {
            const response = await fetch('https://api.icndb.com/jokes/random/15');
            const data = await response.json();
            commit('setData', data);
        },
        async teacherStartPicker({ commit , state, rootState }, { question, choices }){
            alert('Selection started!');
            const message = JSON.stringify({
                type: "PICKER/START",
                data: {
                    question: question,
                    choices: choices,
                    pickerType: state.pickerType,
                },
            });

            const socket = rootState.websocket.socket;
            const classCode = rootState.websocket.classCode;

            if (socket && socket.connected) {
                socket.publish({
                    destination: `/pub/picker/start/${classCode}`,
                    body: message,
                });
            }
            if(question===''){
                question = (this.pickerType===1) ? 'OX를 골라주세요':'보기를 선택해 주세요';
            }
            commit('setQuestionAndChoices', { question, choices } );
            commit('setCurrentComponent', 'PickerResult');
        },
        async teacherEndPicker( { commit , rootState } ) {
            // Implement the logic for starting selection for teacher
            alert('Selection end!');
            // 메시지 전송
            const socket = rootState.websocket.socket;
            const classCode = rootState.websocket.classCode;

            const message = JSON.stringify({
                type: "PICKER/END",
                data: {
                },
            });
            if (socket && socket.connected) {
                socket.publish({
                    destination: `/pub/picker/end/${classCode}`,
                    body: message,
                });
            }
        },

    },
};

export default picker

