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
      <div class="modal-body" @load="drawingCanvas">
        <div id="WORKAREA" ref="a"></div>
        <div ref="b" id="UI_PALETTE"></div>
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
    }
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
  height: 700px;
  pointer-events: all;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  /*
  padding: 20px;
   */
}


/* 좌측 칠교판 도형 및 모형 스타일 적용 */
#UI_PALETTE {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: flex-start; /* Align items from the top */
  height: auto; /* Ensure the container takes full height */
  background: azure;
  width: 200px;
}

#UI_PALETTE svg {
  margin: 8px; /* 칠교 모형 (4가지) 사이 간격 */
}

/* 하단 ToolBar 스타일 적용 */
#UI_TOOLBAR {
  display: flex;
  gap: 10px;
  width: 1200px;
  height: 60px;
  align-items: center;
}


.uiButtonDef img, .uiButtonDefGrayed img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
  width: 5px !important;
  height: 5px !important;
}

/*
.uiButtonDefColor {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.uiButtonDefText {
  font-size: 12px;
  margin-top: 4px;
} */

</style>