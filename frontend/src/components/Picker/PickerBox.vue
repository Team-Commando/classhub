<template>
    <div class="container">
      <div class="list-container">
        <div v-for="(question, index) in questions" :key="question.id" class="question-item">
          <input type="radio" :value="question.id" v-model="selectedQuestion" />
          <span>{{ question.question }}</span>
          <button @click="switchToPickerEdit(question.id)" class="small-button">수정</button>
          <button @click="deleteQuestion(question.id)" class="small-button">삭제</button>
        </div>
      </div>
      <div class="action-container">
        <button @click="this.$emit('switchComponent', 'PickerInit', { pickerType })" class="action-button">질문 생성으로 돌아가기</button>
        <button @click="startPickerFromBox" class="action-button start-button">시작하기</button>
      </div>
    </div>
</template>
  
<script>
  import axios from 'axios';

  export default {
    name: 'PickerBox',
    props: {
      // pickerType: {
      //   type: Number,
      //   required: true,
      // },
    },
    data() {
      return {
        pickerType: 1,
        questions: [],
        selectedQuestion: null
      };
    },
    mounted() {
      this.fetchQuestions();
    },
    methods: {
      fetchQuestions() {
        axios.get('http://localhost:8080/api/picker/get-questions', {
          params: {
            classroomId: 1,
            type: this.pickerType
          }
        })
        .then(response => {
          this.questions = response.data;
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });
      },
      switchToPickerEdit(id) {
        let question = ""
        let choices = [];

        //기존 정보 불러오기
        axios.get(`http://localhost:8080/api/picker/get-saved-question?id=${id}`, {
        })
        .then(response => {
          question = response.data.question;
          choices = response.data.choices;
          this.$emit('switchComponent', 'PickerEdit', { pickerType: this.pickerType, question: question, choices: choices, questionId: id } )
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });

      },
      deleteQuestion(id) {
        const result = confirm('삭제하시겠습니까?');
        if(result){
          axios.get(`http://localhost:8080/api/picker/delete-question?id=${id}`, {
          })
          .then(response => {
            alert('삭제 완료');
            this.fetchQuestions();
          })
          .catch(error => {
            console.error('Error fetching questions:', error);
          });
        }
      },
      startPickerFromBox() {
        let question = ""
        let choices = [];

        axios.get(`http://localhost:8080/api/picker/get-saved-question?id=${this.selectedQuestion}`, {
        })
        .then(response => {
          question = response.data.question;
          choices = response.data.choices;
          this.$emit('startPicker', question, choices)
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });
      }
    }
  };
</script>
  
<style scoped>
@import "../../css/Picker.module.css";
  .container {
    flex-direction: column;
  }

</style>
  