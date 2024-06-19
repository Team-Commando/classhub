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
        <div id="modal-content">
          <svg>
            <filter id="filterOutline">
              <feMorphology in="SourceAlpha" result="EXP" operator="dilate" radius="2"></feMorphology>
              <feFlood flood-color="#1F618D" flood-opacity="1" result="LINECOLOR"></feFlood>
              <feComposite in="LINECOLOR" in2="EXP" operator="in" result="OUTLINE"></feComposite>
              <feMerge>
                <feMergeNode in="OUTLINE" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </svg>
          <div id="WORKAREA">
            <canvas width="1365" height="768" style="position: absolute; left: 0px; top: 0px; z-index: 700; touch-action: none; cursor: crosshair;"></canvas>
            <div style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 701; overflow: hidden;"></div>
            <svg style="position:absolute; left:0px; top:0px; touch-action: none;" width="1365" height="768"></svg>
          </div>

          <!-- 좌측 칠교판 도형 및 모형 -->
          <div id="UI_PALETTE">
            <!-- 칠교판 도형 (7종) start -->
            <svg width="153.60000000000002" height="153.60000000000002" style="display: inline-block; margin: 4px 8px; background: #1a1a1a">
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)"><path d="M 0 0 L 153.60000000000002 0 L 76.80000000000001 76.80000000000001 Z" style="fill:rgb(41,133,77); stroke:rgb(20,66,38); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(76.80000000000001,0)"><path d="M 76.80000000000001 0 L 76.80000000000001 153.60000000000002 L 0 76.80000000000001 Z" style="fill:rgb(234,127,85); stroke:rgb(117,63,42); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(38.400000000000006,115.20000000000002)"><path d="M 0 0 L 76.80000000000001 0 L 115.20000000000002 38.400000000000006 L 38.400000000000006 38.400000000000006 Z" style="fill:rgb(194,167,206); stroke:rgb(97,83,103); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(0,76.80000000000001)"><path d="M 0 0 L 76.80000000000001 76.80000000000001 L 0 76.80000000000001 Z" style="fill:rgb(219,63,50); stroke:rgb(109,31,25); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)"><path d="M 0 0 L 38.400000000000006 38.400000000000006 L 0 76.80000000000001 Z" style="fill:rgb(35,108,147); stroke:rgb(17,54,73); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(0,38.400000000000006)"><path d="M 38.400000000000006 0 L 76.80000000000001 38.400000000000006 L 38.400000000000006 76.80000000000001 L 0 38.400000000000006 Z" style="fill:rgb(237,216,66); stroke:rgb(118,108,33); stroke-width:1"></path></g>
              <g style="touch-action: none; position: absolute;" transform="translate(38.400000000000006,76.80000000000001)"><path d="M 38.400000000000006 0 L 76.80000000000001 38.400000000000006 L 0 38.400000000000006 Z" style="fill:rgb(168,194,89); stroke:rgb(84,97,44); stroke-width:1"></path></g>
            </svg>
            <!-- 칠교판 도형 (7종) end -->

            <!-- 칠교 모형 (4가지) start -->
            <svg width="71.17645019878177" height="64.43888076297984" style="display: inline-block;">
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)">
                <path d="M 0 64.43888076297984 L 9.600000000000117 54.83888076297985 L 28.800000000000004 54.83888076297985 L 28.800000000000004 35.638880762979845 L 48.00000000000001 16.438880762979785 L 57.60000000000001 6.838880762979764 L 57.60000000000001 0 L 71.17645019878177 13.576450198781666 L 57.60000000000001 13.576450198781666 L 57.60000000000001 26.038880762979844 L 67.20000000000002 35.638880762979845 L 48.00000000000019 35.638880762979845 L 57.60000000000001 45.238880762979846 L 48.00000000000019 54.83888076297985 L 57.60000000000019 64.43888076297984 Z" style="fill:rgb(140,140,140); stroke:rgb(70,70,70); stroke-width:1"></path>
              </g>
            </svg>
            <svg width="48.94153162899169" height="73.50580079512686" style="display: inline-block;">
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)">
                <path d="M 12.188631231428298 73.50580079512686 L 20.141531628991682 65.55290039756353 L 20.141531628991682 59.01127833078951 L 6.565081430209998 59.01127833078951 L 20.141531628991682 45.434828132007745 L 20.141531628991682 40.7293505963451 L 6.565081430209998 40.7293505963451 L 6.565081430209998 27.152900397563524 L 20.141531628991682 27.152900397563524 L 3.51384387633049 17.552900397563466 L 0 4.439056521232839 L 16.627687752661117 14.03905652123284 L 20.141531628991682 27.152900397563524 L 20.141531628991682 0 L 33.71798182777344 13.576450198781725 L 20.141531628991682 27.152900397563524 L 39.34153162899169 46.35290039756353 L 39.34153162899169 54.305800795126856 L 48.94153162899169 63.905800795126865 L 39.34153162899169 73.50580079512686 Z" style="fill:rgb(140,140,140); stroke:rgb(70,70,70); stroke-width:1"></path>
              </g>
            </svg>
            <svg width="73.50580079512686" height="54.305800795126856" style="display: inline-block;">
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)">
                <path d="M 13.576450198781743 54.305800795126856 L 13.576450198781743 27.152900397563524 L 0 13.576450198781725 L 0 0 L 13.576450198781743 13.576450198781725 L 27.152900397563524 0 L 27.152900397563524 13.576450198781725 L 13.576450198781743 27.152900397563524 L 21.52935059634528 35.105800795126854 L 46.35290039756353 35.105800795126854 L 46.35290039756353 21.52935059634528 L 59.92935059634529 7.952900397563464 L 73.50580079512686 7.952900397563464 L 59.92935059634529 21.52935059634528 L 59.92935059634529 35.105800795126854 L 40.7293505963451 54.305800795126856 Z" style="fill:rgb(140,140,140); stroke:rgb(70,70,70); stroke-width:1"></path>
              </g>
            </svg>
            <svg width="69.5293505963453" height="53.68790839200884" style="display: inline-block;">
              <g style="touch-action: none; position: absolute;" transform="translate(0,0)">
                <path d="M 0 53.14112549695431 L 13.576450198781725 39.56467529817255 L 13.576450198781725 20.36467529817255 L 0 20.36467529817255 L 0 6.788225099390805 L 13.576450198781725 6.788225099390805 L 25.334000964141126 0 L 32.122226063531905 11.757550765359305 L 13.576450198781725 6.788225099390805 L 13.576450198781725 20.36467529817255 L 51.97645019878177 20.36467529817255 L 59.92935059634529 12.411774900609197 L 59.92935059634529 34.48790839200865 L 69.5293505963453 44.08790839200884 L 59.92935059634529 53.68790839200884 L 59.92935059634529 39.56467529817255 L 27.152900397563524 39.56467529817255 L 13.576450198781725 53.14112549695431 Z" style="fill:rgb(140,140,140); stroke:rgb(70,70,70); stroke-width:1"></path>
              </g>
            </svg>
            <!-- 칠교 모형 (4가지) end -->
          </div>
          <!-- 좌측 칠교판 도형 및 모형 -->

          <div id="UI_TOOLBAR">
            <button class="uiButtonDef"><img src="../assets/bt_select.svg">
              <div class="uiButtonDefText">선택</div>
            </button>
            <button class="uiButtonDefGrayed"><img src="../assets/icon_flip.png">
              <div class="uiButtonDefText">뒤집기</div>
            </button>
            <button class="uiButtonDefGrayed"><img src="../assets/bt_rotate_left.svg">
              <div class="uiButtonDefText">회전</div>
            </button>
            <button class="uiButtonDefGrayed"><img src="../assets/bt_rotate_right.svg">
              <div class="uiButtonDefText">회전</div>
            </button>
            <button class="uiButtonDefGrayed"><img src="../assets/bt_duplicate.svg">
              <div class="uiButtonDefText">복제</div>
            </button>
            <button class="uiButtonDefGrayed"><img src="../assets/bt_delete.svg">
              <div class="uiButtonDefText">삭제</div>
            </button>
            <button class="uiButtonDef">
              <div class="uiButtonDefColor" style="background: rgb(192, 57, 43);"></div>
              <div class="uiButtonDefText">색상변경</div>
            </button>
            <button class="uiButtonDef">
              <img src="../assets/bt_pen_thin.svg">
              <div class="uiButtonDefText">펜</div>
            </button>
            <button class="uiButtonDef">
              <img src="../assets/bt_pen_thick.svg">
              <div class="uiButtonDefText">색연필</div>
            </button>
            <button class="uiButtonDef">
              <img src="../assets/bt_text.svg">
              <div class="uiButtonDefText">글자 입력</div>
            </button>
            <button class="uiButtonDef">
              <img src="../assets/bt_eraser.svg">
              <div class="uiButtonDefText">지우개</div>
            </button>
            <button class="uiButtonDef">
              <img src="../assets/bt_trash.svg">
              <div class="uiButtonDefText">새로시작</div>
            </button>
          </div>
<!--          <div class="uiColorPalette" style="position: absolute; display: none; z-index: 50001;">-->
<!--            <button class="uiColorButton" style="background: rgb(231, 76, 60);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(230, 126, 34);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(241, 196, 15);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(39, 174, 96);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(52, 152, 219);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(41, 128, 185);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(142, 68, 173);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(148, 49, 38);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(147, 81, 22);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(154, 125, 10);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(25, 111, 61);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(33, 97, 140);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(26, 82, 118);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(91, 44, 111);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(253, 254, 254);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(204, 209, 209);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(127, 140, 141);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(66, 73, 73);"></button>-->
<!--            <button class="uiColorButton" style="background: rgb(23, 32, 42);"></button></div>-->
<!--          <button id="UI_GUIDE_SHOW_BUTTON"></button>-->
        </div>
      <!-- modal body end -->
      </div>
<!--      <div id="loadingContainer">-->
<!--        <div class="loadingIconAnimation">이건 머임?</div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>

export default {
  name: 'WidgetModal',
  data() {
    return {
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
  background: #007bff;
  width: 154px;
}

#UI_PALETTE svg {
  margin: 8px; /* 칠교 모형 (4가지) 사이 간격 */
}

/* 하단 ToolBar 스타일 적용 */
#UI_TOOLBAR {
  display: flex;
  gap: 10px;
  width: 1200px;
  background: #0056b3;
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
</style>