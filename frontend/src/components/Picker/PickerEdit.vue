<template>
  <div class="container">
    <div class="question-container">
      <label for="question"><h2>Q.</h2></label>
      <input type="text" id="question" v-model="internalQuestion" required/>
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
      <div v-for="(choice, index) in internalChoices" :key="index" class="multi-choice">
        <input type="text" v-model="internalChoices[index]" />
        <button v-if="internalChoices.length > 2" @click="removeChoice(index)" class="remove-button">-</button>
      </div>
      <button v-if="internalChoices.length < 10" @click="addChoice" class="add-button">+</button>
    </div>

    <div class="action-container">
      <button @click="setCurrentComponent('PickerBox')" class="action-button">취소하기</button>
      <button @click="editQuestion" class="action-button start-button">수정하기</button>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import axios from "axios";

export default {
  name: 'PickerEdit',
  props: {
  },
  data() {
    return {
      internalQuestion: '',
      internalChoices: [],
    };
  },
  computed: {
    ...mapState('websocket', ["socket"]),
    ...mapState('picker', ["pickerType", "question", "choices", "questionId"]),
  },
  mounted() {
    this.internalQuestion = this.question;
    this.internalChoices= this.choices;

  },
  methods: {
    ...mapMutations('picker', ["setCurrentComponent"]),

    addChoice() {
      this.internalChoices.push('');
    },
    removeChoice(index) {
      this.internalChoices.splice(index, 1);
    },
    editQuestion(){
      let payload = {};

      if(this.pickerType === 1){
        payload = {
          question: this.internalQuestion,
          choices: [],
          type: this.pickerType,
          id: this.questionId
        };
      }else if(this.pickerType === 2) {
        payload = {
          question: this.internalQuestion,
          choices: this.internalChoices,
          type: this.pickerType,
          id: this.questionId
        };
      }

      axios.post('http://localhost:8080/api/picker/edit-question', payload)
        .then(response => {
          if (response.status === 200) {
            this.setCurrentComponent('PickerBox');
          } else {
            alert('Failed to save the question');
          }
        })
        .catch(error => {
          alert('Error saving the question');
        });

    },
  }
};
</script>

<style scoped>
@import "../../css/Picker.module.css";
.action-container{
  justify-content: space-between;
}
</style>