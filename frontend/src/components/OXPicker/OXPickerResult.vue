<template>
  <div class="container">
    <div class="question-container">
      <label for="question"><h2>Q.</h2></label>
      <p id="question">{{ question }}</p>
    </div>

    <div class="ox-choice-container" v-if="pickerType===0">
      <div class="ox-choice-button-container">
        <button class="ox-choice-button">
          <div class="circle"></div>
        </button>
        <div class="ox-choice-stats">
          <div>{{ circleCount }}명</div>
          <div>{{ circlePercentage }}%</div>
        </div>
      </div>
      <div class="ox-choice-button-container">
        <button class="ox-choice-button">
          <div class="cross"></div>
        </button>
        <div class="ox-choice-stats">
          <div>{{ crossCount }}명</div>
          <div>{{ crossPercentage }}%</div>
        </div>
      </div>
    </div>

    <div v-if="pickerType===1">
      <canvas id="resultChart"></canvas>
    </div>

    <div class="status-container">
      <div class="status-box">
        <div class="status-label">응답 진행 현황</div>
        <div class="status-value">{{ responseCount }} / {{ totalStudents }}</div>
      </div>
    </div>

    <div class="action-container">
      <button @click="backToOXPicker" class="action-button">질문 생성으로 돌아가기</button>
      <button @click="endResult" class="action-button end-button">종료</button>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
// import {Chart, registerable} from 'chart.js'
import styles from '../../assets/css/Picker.module.css';
// Chart.register(...registerable)

export default {
  name: 'OXPickerResult',
  props: {
    classCode: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    question: {
      type: String,
    },
    choices: {
      type: Array,
    },
    pickerType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      circleCount: 0,
      crossCount: 0,
      responseCount: 0,
      totalStudents: 21,
      choicesCount: {}, // 초기 선택 수
      respondedSessionIds: new Set(), // 응답한 세션 ID 저장

    };
  },
  computed: {
    ...mapState(["socket", "pickerSelects"]),
    $style() {
      return styles;
    },
    circlePercentage() {
      return ((this.circleCount / this.totalStudents) * 100).toFixed(2);
    },
    crossPercentage() {
      return ((this.crossCount / this.totalStudents) * 100).toFixed(2);
    },
  },
  mounted() {
    this.$store.watch(
        (state) => state.pickerSelects.length,
        (newLength) => {
          const event = this.pickerSelects[newLength - 1];
          if (event) {
            this.handleIncomingSelect(event);
          }
        }
    );
    if(this.pickerType === 1){
      this.renderChart();
    }

  },
  methods: {
    handleIncomingSelect(message){
      const { sessionId, data } = message;

      // 응답한 세션인지 확인
      if (this.respondedSessionIds.has(sessionId)) {
        return;
      }

      if (data.pickerType === 0) { //OX
        if (data.choice === "O") {
          this.circleCount++;
        } else if (data.choice === "X") {
          this.crossCount++;
        }
      } else if (data.pickerType === 1) { //선다형
          this.choicesCount[data.choice]++;
      }
      this.responseCount++;
      this.respondedSessionIds.add(sessionId); // 응답한 세션 추가
      this.updateChart();

    },
    backToOXPicker(){
      this.$emit('endPicker');
      this.$emit('switchComponent', 'OXPicker');
    },

    endResult() {
      this.$emit('toggleWidgetModal')
      this.$emit('endPicker');
      this.$emit('switchComponent', 'OXPicker');
    },
    renderChart() {
      // choices 배열의 각 요소를 순회하며 choicesCount 객체에 키와 값을 초기화
      this.choices.forEach(choice => {
        this.choicesCount[choice] = 1;
      });

      const ctx = document.getElementById('resultChart').getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.choices,
          datasets: [{
            label: '학생응답',
            data: Object.values(this.choicesCount),
            backgroundColor: ['#f5b7b1', '#f7b983', '#82e0aa', '#5dade2']
          }]
        },
        options: {
          responsive: true,
        }
      });
    },
    updateChart() {
      // console.log(Object.values(this.choicesCount));
      this.chart.data.datasets[0].data[0] = Object.values(this.choicesCount);
      this.chart.update();
    },
  }
};
</script>

<style scoped>
@import "../../assets/css/Picker.module.css";
.action-container{
  justify-content: space-between;
}
</style>
