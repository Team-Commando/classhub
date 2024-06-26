<template>
  <div id="WORKAREA"></div>
  <div id="CAPTIONAREA"></div>
</template>

<script>
export default {
  name: 'Dice',
  mounted() {

  },
  methods: {

  }
}
</script>

<style>
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