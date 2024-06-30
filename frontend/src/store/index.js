import { createStore } from 'vuex';
import websocket from "./modules/websocket.js";
import modalStore from "./modules/modalStore.js";
import picker from "./modules/picker.js";

export default createStore({
    modules: {
        websocket,
        modalStore,
        picker,
    },
});