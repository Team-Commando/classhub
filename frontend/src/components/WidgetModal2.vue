<template>
  <div class="modal-container" v-if="isWidgetModalOpen">
    <div class="modal-window">
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-button" @click="thisModalOFF" v-if="userType === 'teacher'">X</button>
      </div>
      <div class="modal-body">
        <component :is="currentComponent"
                   @switchComponent="switchComponent" @startPicker="startPicker" @endPicker="endPicker" @toggleWidgetModal="toggleWidgetModal"
                   :classCode="classCode" :sender="sender" :message="this.message" :question="question" :choices="choices" :pickerType="pickerType"/>
      </div>
    </div>
  </div>
</template>

<script>
import Picker from './Picker/Picker.vue';
import PickerBox from './Picker/PickerBox.vue';
import Whiteboard from "./Whiteboard.vue";
import PickerSelect from "./Picker/PickerSelect.vue";
import PickerResult from "./Picker/PickerResult.vue";
import {mapState} from "vuex";

export default {
  name: 'WidgetModal2',
  components: {
    Whiteboard,
    Picker,
    PickerBox,
    PickerSelect,
    PickerResult,
  },
  props: {
    isWidgetModalOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Modal Title2'
    },
    classCode: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    pickerType: {
      type: Number,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentComponent: 'Picker',
      message:{},
      question: '',
      choices:[],
    };
  },
  computed: {
    ...mapState(["socket", "pickerStarts", "pickerEnds"]),
  },
  mounted() {
    this.$store.watch(
        (state) => state.pickerStarts.length,
        (newLength) => {
          const startEvent = this.pickerStarts[newLength - 1];
          if (startEvent) {
            this.handlePickerStart(startEvent);
          }
        }
    );
    this.$store.watch(
        (state) => state.pickerEnds.length,
        (newLength) => {
          const endEvent = this.pickerEnds[newLength - 1];
          if (endEvent) {
            this.handlePickerEnd(endEvent);
          }
        }
    );
  },
  methods: {
    thisModalOFF(){
      this.$emit('toggleWidgetModal');
      this.endPicker();
      this.switchComponent('Picker');
    },
    toggleWidgetModal(forceToggle, pickerType) {
      console.log('forceToggle', forceToggle);
      this.$emit('toggleWidgetModal', forceToggle, pickerType);
    },
    switchComponent(componentName, question='', choices) {
      this.currentComponent = componentName;
      this.question = question;
      this.choices = choices;
    },
    handlePickerStart(message) {
      // Handle picker start event for students
      this.message = message;
      this.switchComponent('PickerSelect');
      this.toggleWidgetModal(true);
    },
    handlePickerEnd(message){
      // Handle picker end event for students
      this.toggleWidgetModal(false);
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
      this.switchComponent('PickerResult', question, choices);
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
  padding: 20px;
  overflow-y: auto;
  height: 80%;
}
</style>
