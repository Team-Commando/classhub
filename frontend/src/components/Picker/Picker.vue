<template>

      <div id="picker-container">
        <component :is="currentComponent"
                   v-bind="componentProps"
                   v-on="eventListeners"/>
      </div>

</template>

<script>
import PickerInit from './PickerInit.vue';
import PickerBox from './PickerBox.vue';
import PickerSelect from "./PickerSelect.vue";
import PickerResult from "./PickerResult.vue";
import PickerEdit from "./PickerEdit.vue";
import {mapState} from "vuex";
import websocket from "../../store/modules/websocket.js";

export default {
  name: 'Picker',
  components: {
    PickerInit,
    PickerBox,
    PickerSelect,
    PickerResult,
    PickerEdit,
  },
  props: {
    // pickerType: {
    //   type: Number,
    //   required: false,
    // },
    pickerSendToStudentMessage: {},
  },
  data() {
    return {
      pickerType: 1,
      currentComponent: PickerInit,
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
  },
  watch: {
    // pickerStart: {
    //   handler(newVal) {
    //     if (newVal) {
    //       this.handlePickerStart();
    //     }
    //   },
    //   immediate: true,
    // },
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
          this.switchComponent(componentName, { pickerType: newVal, message: this.pickerSendToStudentMessage });
        }
      },
      immediate: true,
    },
  },
  methods: {
    thisModalOFF(){
      this.$emit('toggleWidgetModal');
      this.endPicker();
      this.switchComponent('PickerInit');
    },
    // handlePickerStart(message) {
    //   // Handle picker start event for students
    //   this.message = message;
    //   this.switchComponent('PickerSelect', { message });
    // },
    handlePickerEnd(){
      // Handle picker end event for students
      this.$emit('closeModal');
    },
    switchComponent(componentName, props={}) {
      this.currentComponent = componentName;
      this.componentProps = props;

      switch (componentName) {
        case 'PickerInit':
          this.eventListeners = {
            switchComponent: this.switchComponent,
            startPicker: this.startPicker,
          };
          break;
        case 'PickerBox':
          this.eventListeners = {
            switchComponent: this.switchComponent,
            startPicker: this.startPicker,
          };
          break;
        case 'PickerEdit':
          this.eventListeners = {
            switchComponent: this.switchComponent,
          };
          break;
        case 'PickerResult':
          this.eventListeners = {
            endPicker: this.endPicker,
            switchComponent: this.switchComponent,
            openModal: this.openModal,
            closeModal: this.closeModal,
          };
          break;
        case 'PickerSelect':
          this.eventListeners = {
          };
          break;
        default:
          this.eventListeners = {};
      }
    },
    openModal(pickerType) {
      this.$emit('openModal', pickerType);
    },
    closeModal() {
      this.$emit('closeModal');
    },
    startPicker(question, choices) {
      // Implement the logic for starting selection for teacher
      alert('Selection started!');
      // 메시지 전송
      const message = JSON.stringify({
        type: "PICKER/START",
        sender: this.sender,
        data: {
          question: question,
          choices: choices,
          pickerType: this.pickerType,
        },
      });
      if (this.socket && this.socket.connected) {
        this.socket.publish({
          destination: `/pub/picker/start/${this.classCode}`,
          body: message,
        });
      }
      if(question===''){
        question = (this.pickerType===0) ? 'OX를 골라주세요':'보기를 선택해 주세요';
      }
      this.switchComponent('PickerResult', {pickerType: this.pickerType, question, choices});
    },
    endPicker() {
      // Implement the logic for starting selection for teacher
      alert('Selection end!');
      // 메시지 전송
      const message = JSON.stringify({
        type: "PICKER/END",
        sender: this.sender,
        data: {
        },
      });
      if (this.socket && this.socket.connected) {
        this.socket.publish({
          destination: `/pub/picker/end/${this.classCode}`,
          body: message,
        });
      }
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
