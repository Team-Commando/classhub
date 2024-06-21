<template>
  <div class="modal-container" v-if="isWidgetModalOpen">
    <div class="modal-window">
      <!-- modal-header start -->
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-button" @click="closeModal">X</button>
      </div>
      <!-- modal-header end -->

      <!-- modal body start -->
      <div class="modal-body">
        <div id="WORKAREA"></div>
        <div id="UI_PALETTE"></div>
        <div id="UI_TOOLBAR"></div>
      </div>
      <!-- modal body end -->
    </div>
  </div>
</template>

<script>
import {upred} from "../../public/code/tangram.js";

export default {
  name: 'WidgetModal',
  mounted() {
  },
  data() {
    return {
      upred: upred,
      isWidgetModalOpen: this.isWidgetModalOpen
    }
  },
  props: {
    isWidgetModalOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Modal Title1'
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    drawingCanvas() {
      console.log("start drawing Canvas");
      new upred.ui.CommonUI().Start(new upred.math.Tangrams());
    }
  },
  watch: {
    isWidgetModalOpen(state) {  // isWidgetModalOpen의 상태를 감시
      if (state) {  // isWidgetModalOpen == true (모달창이 활성화 되면)
        this.$nextTick(() => {
          // DOM이 완전히 업데이트된 이후 drawingCanvas() 호출
          this.drawingCanvas();
        })
      }
    },
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 100px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.modal-window {
  background: white;
  border-radius: 8px;
  width: 1200px;
  height: 800px;
  pointer-events: all;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: lightgray;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  text-align: center;
  flex-grow: 1;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}

.modal-body {
  flex: 1;
  display: flex;
  position: relative;
}

div {
  font-family: sans-serif;
}

#WORKAREA {
  flex: 1;
  position: relative;
}

#WORKAREA canvas, #WORKAREA div, #WORKAREA svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

#UI_PALETTE {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 80px;
  width: 200px;
  height: auto;
  border-right: #CCD1D1 1px solid;
  padding: 8px 4px;
  z-index: 800;
  background: #ffffff;
  background: linear-gradient(to right, #e1e1e1 0%, #f6f6f6 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#UI_PALETTE svg {
  margin: 8px;
}

#UI_TOOLBAR {
  user-select: none;
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  z-index: 50000;
  left: 0;
  width: 100%;
  bottom: 0;
  height: 80px;
  background: #f2f6f8;
  background: linear-gradient(to bottom, #f2f6f8 0%, #d8e1e7 50%, #b5c6d0 51%, #e0eff9 100%);
}
</style>