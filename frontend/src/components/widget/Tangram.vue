<template>
  <svg id="SVG">
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
  <div id="WORKAREA"></div>
  <div id="UI_PALETTE"></div>
  <div id="UI_TOOLBAR"></div>
</template>

<script>
import {upred} from "../../code/tangram.js";

export default {
  name: 'Tangram',
  data() {
    return {
      upred: upred,
    }
  },
  mounted() {
    // 칠교판 및 모형 출력
    new upred.ui.CommonUI().Start(new upred.math.Tangrams());
  },
  methods: {
  }
}
</script>

<style>
#SVG {
  width: 200px;
  height: auto;
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