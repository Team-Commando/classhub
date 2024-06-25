<template>
  <div class="modal-container" v-if="isWidgetModalOpen">
    <div class="modal-window" ref="modalWindow" @mousedown="handleMouseDown">
      <!-- modal header start -->
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-button" @click="closeModal">X</button>
      </div>
      <!-- modal header end -->

      <!-- modal body start -->
      <div class="modal-body">
        <div id="WORKAREA"></div>
        <div id="UI_PALETTE"></div>
        <div id="UI_TOOLBAR"></div>
      </div>
      <!-- modal body end -->

      <!-- 모달창 우측 하단 크기 조정 핸들 -->
      <div class="resizable-handle"></div>
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
      isWidgetModalOpen: this.isWidgetModalOpen,
      dragStartX: 0,
      dragStartY: 0,
      initialX: 0,
      initialY: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      initialWidth: 0,
      initialHeight: 0
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
    },
  },
  methods: {
    // 모달창 종료 메서드
    closeModal() {
      this.$emit('close');
    },

    // 모달창 내 칠교판 도형 및 모형 세팅 메서드
    drawingCanvas() {
      new upred.ui.CommonUI().Start(new upred.math.Tangrams());
    },

    // mousedown 이벤트 발생 시, 모달창의 위치 or 크기 조정을 결정하는 handler 메서드
    handleMouseDown(event) {
      if (event.target.classList.contains('modal-window')) {
        this.startResizeModal(event); // 모달창 크기 조정 처리 메서드 호출
      } else {
        this.startDragModal(event);   // 모달창 위치 조정 처리 메서드 호출
      }
    },

    // 모달 드래그 시작 처리 메서드
    startDragModal(event) {
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;

      // getBoundingClientRect(): DOM 제공 함수, 요소 크기와 뷰포트를 기준으로 한 요소의 위치를 반환한다.
      // => DOMRect 객체 제공 (left, top, right, bottom, x, y, width, height 등의 속성을 포함)
      // 변수 rect = modalWindow의 DOMRect 객체 정보가 저장된다.
      const rect = this.$refs.modalWindow.getBoundingClientRect();

      this.initialX = rect.left;
      this.initialY = rect.top;

      document.addEventListener('mousemove', this.moveModal);
      document.addEventListener('mouseup', this.stopDragModal);
    },

    // 모달 드래그 동작 처리 메서드
    moveModal(event) {
      if (event.clientX === 0 && event.clientY === 0) return; // Modal에 대한 좌표 이동이 없을 시, return

      // 상대적으로 이동한 X, Y 좌표(거리)
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      this.$refs.modalWindow.style.left = `${this.initialX + deltaX}px`;
      this.$refs.modalWindow.style.top = `${this.initialY + deltaY}px`;
    },

    // 모달 드래그 종료 처리 메서드
    stopDragModal() {
      // mousemove, mouseup에 대한 이벤트를 제거한다.
      document.removeEventListener('mousemove', this.moveModal);
      document.removeEventListener('mouseup', this.stopDragModal);
    },

    // 모달 크기 조정 시작 처리 메서드
    startResizeModal(event) {
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;

      const rect = this.$refs.modalWindow.getBoundingClientRect();
      this.initialWidth = rect.width;
      this.initialHeight = rect.height;

      document.addEventListener('mousemove', this.resizeModal);
      document.addEventListener('mouseup', this.stopResizeModal);
    },

    // 모달 크기 조정 처리 메서드
    resizeModal(event) {
      const deltaX = event.clientX - this.resizeStartX;
      const deltaY = event.clientY - this.resizeStartY;

      this.$refs.modalWindow.style.width = `${this.initialWidth + deltaX}px`;
      this.$refs.modalWindow.style.height = `${this.initialHeight + deltaY}px`;
    },

    // 모달 크기 조정 종료 처리 메서드
    stopResizeModal() {
      document.removeEventListener('mousemove', this.resizeModal);
      document.removeEventListener('mouseup', this.stopResizeModal);
    }
  },
  watch: {
    isWidgetModalOpen(state) {  // isWidgetModalOpen의 상태를 감시
      if (state) {  // isWidgetModalOpen == true (모달창이 활성화 되면)
        this.$nextTick(() => {
          // DOM이 완전히 업데이트된 이후 drawingCanvas() 호출
          this.drawingCanvas();
        });
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
  min-width: 50%;
  min-height: 50%;
  pointer-events: all;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  resize: both;   /* 모달창에 대한 크기 조정 허용 */
  overflow: hidden; /* 오버플로우 처리 (스크롤 숨김 처리) */
  position: absolute; /* 드래그 허용을 위해 절대값으로 위치 지정 */
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
  width: 220px;
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

/* 모달창 우측 하단 크기 조정 핸들 스타일 적용 */
.resizable-handle {
  width: 20px;
  height: 20px;
  background: #ccc;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: se-resize;
}
</style>