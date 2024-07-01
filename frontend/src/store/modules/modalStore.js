const modalStore = {
    namespaced: true,
    state: {
        // widget 정의: 위젯별 고유 ID, 위젯명, 활성화 유무 설정
        widget: [
            { wId: 0, title: "칠교놀이", isOpen: false },
            { wId: 1, title: "주사위", isOpen: false },
            // { wId: 2, title: "고르기", isOpen: false },
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
            if (state.widget[wId]) {
                state.widget[wId].isOpen = true;    // 선택한 위젯의 isOpen 속성을 true로 변경
                console.log("open 이후의 widget 상태 보기", state.widget);

                // activeWidget(Object) 데이터 추가: key 값을 동적으로 생성
                // activeWidget key: activeWidget(Object)의 key 값을 선택한 위젯의 고유 ID와 동일하게 설정
                // activeWidget value: key에 해당하는 위젯 정보(wId, title, isOpen)를 설정
                state.activeWidgetKey = wId;
                state.activeWidget[state.activeWidgetKey] = state.widget[wId];

                console.log("open 이후의 actionWidget 상태 보기", state.activeWidget);
            }
        },

        // closeWidgetModal(): 선택한 위젯의 정보를 activeWidget에서 삭제
        closeWidgetModal(state, wId) {
            if (state.widget[wId]) {
                console.log("wId", wId);
                console.log("아!!!!!!!!", state.widget[wId]);

                console.log("key 값 변한다 이제 ??", state.activeWidgetKey);
                state.activeWidgetKey = wId;
                console.log("key 값 변했을 걸", state.activeWidgetKey);
                state.widget[wId].isOpen = false;   // 선택한 위젯의 isOpen 속성을 false로 설정

                console.log("close 이후의 widget 상태 보기", state.widget);
                delete state.activeWidget[wId];     // activeWidget(Object)에서 선택한 위젯에 해당하는 데이터를 삭제

                console.log("close 이후의 actionWidget 상태 보기", state.activeWidget);
                console.log("지금 activeWidgetKey 값이 뭐야?", state.activeWidgetKey);
            }
        }
    },
    // actions: {
    //     openWidgetModal({ state, commit }, wId) {
    //         // console.log("???", this.state.widget[wId]);
    //         console.log("??? 뭐임", state.widget);
    //         if (state.widget[wId]) {
    //             console.log("지금 열려고 하는 모달창 wId는?", wId);
    //             commit('setOpenWidgetModal', wId);
    //         } else {
    //             console.log("fail openWidgetModal");
    //         }
    //     },
    //
    //     closeWidgetModal({ state, commit }, wId) {
    //         if (state.widget[wId]) {
    //             console.log("closeWidgetModal actions");
    //             console.log("지금 닫으려고 하는 모달창 wId는?", wId);
    //             commit('setCloseWidgetModal', wId);
    //         } else {
    //             console.log("fail closeWidgetModal");
    //         }
    //     },
    // },
};

export default modalStore;