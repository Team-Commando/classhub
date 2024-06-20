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
<!--      v-if="initDraw(isWidgetModalOpen)"-->
      <div class="modal-body">
<!--        <svg>-->
<!--          <filter id="filterOutline">-->
<!--            <feMorphology in="SourceAlpha" result="EXP" operator="dilate" radius="2"></feMorphology>-->

<!--            <feFlood flood-color="#1F618D" flood-opacity="1" result="LINECOLOR"></feFlood>-->
<!--            <feComposite in="LINECOLOR" in2="EXP" operator="in" result="OUTLINE"></feComposite>-->

<!--            <feMerge>-->
<!--              <feMergeNode in="OUTLINE" />-->
<!--              <feMergeNode in="SourceGraphic" />-->
<!--            </feMerge>-->
<!--          </filter>-->
<!--        </svg>-->
        <button @click="checkDiv">과연!</button>
        <div ref="b" id="UI_PALETTE" style="background: #535bf2"></div>
        <div id="UI_TOOLBAR" style="background: firebrick"></div>
        <div id="WORKAREA" ref="a"></div>
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
    // this.drawingCanvas();
    // DOM 업데이트가 완료된 후 drawingCanvas 메서드 호출
    // this.ensureElementsExist(['#WORK_AREA', '#UI_PALETTE', '#UI_TOOLBAR'], this.drawingCanvas);
    // this.$nextTick(() => {
    //   this.ensureElementsExist(['#WORK_AREA', '#UI_PALETTE', '#UI_TOOLBAR'], this.drawingCanvas);
    // });
    // this.$nextTick(() => {
    //   this.drawingCanvas();
    // })

  },
  data() {
    return {
      upred: upred
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
      new upred.ui.CommonUI().Start(new upred.math.Tangrams());
    },
    initDraw(state) {
      if (state) {
        this.drawingCanvas();
      }
    },
    checkDiv() {
      const a = this.$refs.a;
      console.log("돔 접근 : ",a);

      console.log(this.$refs.b);

      this.drawingCanvas();
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
  height: 100%; /* Ensure the container takes full height */
  background: #b7ffff;
  width: 154px;
}

#UI_PALETTE svg {
  margin: 8px; /* 칠교 모형 (4가지) 사이 간격 */
}

/* 좌측 칠교판 도형 및 모형 스타일 적용 */
#UI_PALETTE {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: flex-start; /* Align items from the top */
  height: 100%; /* Ensure the container takes full height */
  background: #b7ffff;
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
  background: #faff23;
}

.uiButtonDef, .uiButtonDefGrayed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
}

.uiButtonDef img, .uiButtonDefGrayed img {
  width: 24px; /* Adjust icon size */
  height: 24px;
}

.uiButtonDefColor {
  width: 24px; /* Adjust color button size */
  height: 24px;
  border-radius: 50%; /* Ensure round shape for color button */
}

.uiButtonDefText {
  font-size: 12px; /* Adjust text size */
  margin-top: 4px; /* Adjust spacing between icon and text */
}

#WORKAREA canvas {
  background: #646cff;
}
</style>