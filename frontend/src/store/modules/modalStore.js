const modalStore = {
    namespaced: true,
    state: {
        // widget 정의: 위젯별 고유 ID, 위젯명, 활성화 유무 설정
        widget: [
            { wId: 0, title: "칠교놀이", isOpen: false },
            { wId: 1, title: "주사위", isOpen: false },
            { wId: 2, title: "고르기", isOpen: false }
        ],
        activeWidget: {},       // 현재 활성화된 위젯을 관리하는 Object
        activeWidgetKey: 0,     // activeWidget(Object)의 key를 동적으로 생성하기 위해 선언

        modalData: { modalTitle: "", modalBody: ""},
        canLeaveSite: false,
        pickerType: null,
        isStudentListOpen: false,
    },
    getters: {
        // data: state => state.data,
    },
    mutations: {
        // openWidgetModal(): 선택한 위젯의 정보를 activeWidget에 추가
        openWidgetModal(state, wId) {
            console.log("===== START OPEN WIDGET MODAL =====");

            console.log("state.widget", state.widget);
            console.log("state.activeWidgetkey", state.activeWidgetKey);
            console.log("state.activeWidget", state.activeWidget);

            state.widget[wId].isOpen = true;    // 선택한 위젯의 isOpen 속성을 true로 변경

            // activeWidget(Object) 데이터 추가: key 값을 동적으로 생성
            // activeWidget key: activeWidget(Object)의 key 값을 선택한 위젯의 고유 ID와 동일하게 설정
            // activeWidget value: key에 해당하는 위젯 정보(wId, title, isOpen)를 설정
            state.activeWidgetKey = wId;
            state.activeWidget[state.activeWidgetKey] = state.widget[wId];

            console.log("state.widget", state.widget);
            console.log("state.activeWidgetkey", state.activeWidgetKey);
            console.log("state.activeWidget", state.activeWidget);

            console.log("===== END OPEN WIDGET MODAL =====");
        },

        // closeWidgetModal(): 선택한 위젯의 정보를 activeWidget에서 삭제
        closeWidgetModal(state, wId) {
            console.log("===== START CLOSE WIDGET MODAL =====");

            console.log("state.widget", state.widget);
            console.log("state.activeWidgetkey", state.activeWidgetKey);
            console.log("state.activeWidget", state.activeWidget);

            state.widget[wId].isOpen = false;   // 선택한 위젯의 isOpen 속성을 false로 설정
            delete state.activeWidget[wId];     // activeWidget(Object)에서 선택한 위젯에 해당하는 데이터를 삭제

            console.log("state.widget", state.widget);
            console.log("state.activeWidgetkey", state.activeWidgetKey);
            console.log("state.activeWidget", state.activeWidget);

            console.log("===== END CLOSE WIDGET MODAL =====");
        },

        // async startWidgetModal(state, wId) {
        //     alert(state.widget[wId].title + " 활동을 시작합니다.");
        //
        //     const message = JSON.stringify({
        //         type: "WIDGET/START",
        //         data: {
        //             wId: wId,
        //         },
        //     });
        //
        //     const socket = rootState.websocket.socket;
        //     const classCode = rootState.websocket.classCode;
        //
        //     if (socket && socket.connected) {
        //         socket.publish({
        //             destination: `/pub/widget/start/${classCode}`,
        //             body: message,
        //         });
        //     }
        //
        //     commit('openWidgetModal', { wId });
        // },
        //
        // async endWidgetModal(state, wId) {
        //     alert(state.widget[wId].title + " 활동을 시작합니다.");
        //
        //     const message = JSON.stringify({
        //         type: "WIDGET/START",
        //         data: {
        //             wId: wId,
        //         },
        //     });
        //
        //     const socket = rootState.websocket.socket;
        //     const classCode = rootState.websocket.classCode;
        //
        //     if (socket && socket.connected) {
        //         socket.publish({
        //             destination: `/pub/widget/start/${classCode}`,
        //             body: message,
        //         });
        //     }
        //
        //     commit('openWidgetModal', { wId });
        // }
    },
};

export default modalStore;