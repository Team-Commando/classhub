<template>
  <div>
    <div class="container" v-if="!isSubmit">
      <div class="question-container">
        <label for="question"><h2>Q.</h2></label>
        <p id="question">{{ question }}</p>
      </div>

      <div class="ox-choice-container" v-if="pickerType===1">
        <button class="ox-choice-button" :class="{ selected: studentChoice === 'O' }" @click="selectChoice('O')">
          <div class="circle"></div>
        </button>
        <button class="ox-choice-button" :class="{ selected: studentChoice === 'X' }" @click="selectChoice('X')">
          <div class="cross"></div>
        </button>
      </div>

      <div class="multi-choice-container" v-if="pickerType===2">
        <div v-for="(choice, index) in choices" :key="index" class="multi-choice">
          <input type="text" v-model="choices[index]" @click="selectChoice(choice)" :class="{ selected: studentChoice === choice }" readonly/>
        </div>
      </div>

      <div class="action-container">
        <button @click="pickerSelect" class="action-button start-button">제출하기</button>
      </div>
    </div>
    <div class="container" v-if="isSubmit">
      <div class="box">
        <p>결과 기다리는중 ...</p>
      </div>
    </div>
  </div>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: 'PickerSelect',
  props: {
  },
  data() {
    return {
      studentChoice:'',
      isSubmit: false,
    };
  },
  computed: {
    ...mapState('websocket', ["socket", "classCode", "sender"]),
    ...mapState('picker', ["pickerType", "question", "choices"]),
  },
  mounted() {

    if(this.question === ""){
      const question = (this.pickerType===1) ? 'OX를 골라주세요':'보기를 선택해 주세요';
      this.setQuestionAndChoices({ question });
    }

  },
  methods: {
    ...mapMutations('picker', ["setQuestionAndChoices"]),

    selectChoice(studentChoice) {
      this.studentChoice = studentChoice;
    },
    pickerSelect() {
      // Implement the logic for starting selection
      alert('Selection submit!');
      // 메시지 전송
      const message = JSON.stringify({
        type: "PICKER/SELECT",
        sender: this.sender,
        data: {
          choice: this.studentChoice,
          pickerType: this.pickerType,
        },
      });
      if (this.socket && this.socket.connected) {
        this.socket.publish({
          destination: `/pub/picker/select/${this.classCode}`,
          body: message,
        });
      }
      this.isSubmit = true;
    },
  }
};
</script>

<style scoped>
  @import "../../css/Picker.module.css";
  .action-container{
    justify-content: center;
  }
  .box {
    width: 800px;
    height: 550px;
    background-color: #ededed;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .box p {
    font-size: 1.5em;
    color: #333;
  }
</style>