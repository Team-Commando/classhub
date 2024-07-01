<template>
  <div class="container">
    <div class="question-container">
      <label for="question"><h2>Q.</h2></label>
      <input type="text" id="question" v-model="question" placeholder="원하시는 경우, 질문을 입력하세요(선택)" required/>
      <button class="store-button" @click="setCurrentComponent('PickerBox')">보관함</button>
    </div>

    <div class="ox-choice-container" v-if="pickerType===1">
      <div class="ox-choice-button-container">
        <button class="ox-choice-button">
          <div class="circle"></div>
        </button>
      </div>
      <div class="ox-choice-button-container">
        <button class="ox-choice-button">
          <div class="cross"></div>
        </button>
      </div>
    </div>

    <div class="multi-choice-container" v-if="pickerType===2">
      <div v-for="(choice, index) in choices" :key="index" class="multi-choice">
        <input type="text" v-model="choices[index]" />
        <button v-if="choices.length > 4" @click="removeChoice(index)" class="remove-button">-</button>
      </div>
      <button v-if="choices.length < 10" @click="addChoice" class="add-button">+</button>
    </div>

    <div class="action-container">
      <button @click="savePicker" class="action-button">저장하기</button>
      <button @click="teacherStartPicker({ question, choices })" class="action-button start-button">시작하기</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: 'PickerInit',
  props: {

  },
  data() {
    return {
      question: '',
      choices: ['A', 'B', 'C', 'D'],
    };
  },
  computed: {
    ...mapState('websocket', ["socket"]),
    ...mapState('picker', ["pickerType"]),
  },
  methods: {
    ...mapMutations('picker', ["setCurrentComponent"]),
    ...mapActions('picker', ["teacherStartPicker"]),

    addChoice() {
      this.choices.push('');
    },
    removeChoice(index) {
      this.choices.splice(index, 1);
    },
    savePicker() {
      // Implement the logic for saving the selection
      let payload = {};

      if(this.pickerType === 1){
        payload = {
          question: this.question,
          choices: [],
          type: this.pickerType ,
          classroomId: 1
        };
      }else if(this.pickerType === 2) {
        payload = {
          question: this.question,
          choices: this.choices,
          type: this.pickerType ,
          classroomId: 1
        };
      }
      axios.post('http://localhost:8080/api/picker/save', payload)
        .then(response => {
          if (response.status === 201) {
            alert(`Saved: Question: ${this.question}`);
            this.setCurrentComponent('PickerBox');
          } else {
            alert('Failed to save the question');
          }
        })
        .catch(error => {
          alert('Error saving the question');
        });

    }
  }
};
</script>

<style scoped>
@import "../../css/Picker.module.css";
.action-container{
  justify-content: space-between;
}
</style>