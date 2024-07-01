<template>

      <div id="picker-container">
        <component :is="currentComponent"/>
      </div>

</template>

<script>
import PickerInit from './PickerInit.vue';
import PickerBox from './PickerBox.vue';
import PickerSelect from "./PickerSelect.vue";
import PickerResult from "./PickerResult.vue";
import PickerEdit from "./PickerEdit.vue";
import {mapMutations, mapState} from "vuex";

export default {
  name: 'Picker',
  components: {
    PickerInit,
    PickerBox,
    PickerSelect,
    PickerResult,
    PickerEdit,
  },
  data() {
    return {
      componentProps: {},
      eventListeners: {},
      message:{},
      question: '',
      choices:[],
      questionId: 0,
      title: 'Modal Title2',

    };
  },
  computed: {
    ...mapState('websocket', ["socket", "pickerStart", "pickerEnd", "classCode", "sender", "userType"]),
    ...mapState('picker', ["pickerType", "currentComponent"]),
  },
  watch: {
    pickerEnd: {
      handler(newVal) {
        if (newVal) {
          this.handlePickerEnd();
        }
      },
      immediate: true,
    },
    pickerType: {
      handler(newVal) {
        if (newVal) {
          const componentName = (this.userType === 'teacher') ? 'PickerInit' : 'PickerSelect'
          this.setCurrentComponent(componentName);
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('picker', ["setCurrentComponent"]),

    // thisModalOFF(){
    //   this.$emit('toggleWidgetModal');
    //   this.endPicker();
    //   this.switchComponent('PickerInit');
    // },
    handlePickerEnd(){
      // Handle picker end event for students
      this.$emit('closeModal');
    },
  }
};
</script>

<style scoped>
  #picker-container{
    flex: 1;
    position: relative;
  }
</style>
