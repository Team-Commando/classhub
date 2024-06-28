import { createStore } from 'vuex';
import websocket from "./modules/websocket.js";
import jokes from "./modules/jokes.js";

export default createStore({
    modules: {
        websocket,
        jokes,
    },
});