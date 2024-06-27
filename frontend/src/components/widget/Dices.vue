<template>
  <div id="DICES_WORKAREA"></div>
  <div id="CAPTIONAREA"></div>
  <div id="UI_TOOLBAR"></div>
</template>

<script>
import {upred} from "../../code/commmonui.js";
// import {dUpred} from "../../code/dices.js";

export default {
  name: 'Dices',
  data() {
    return {
      upred: upred,
      // dUpred: dUpred
    }
  },
  mounted() {
    // new upred.ui.CommonUI().Start(dUpred.dices.Startup);
  },
  methods: {

  }
}
</script>

<style>
#DICES_WORKAREA{
  background: linear-gradient(to bottom,  #eae5c2 47%,#ffffff 81%);
}

#CAPTIONAREA {
  display:none;
  font-weight: bold;
  z-index: 100000;
  position:absolute;
  left:0;
  top:0;
  width:100%;
  text-align: center;
  font-size:10vh;
}
</style>