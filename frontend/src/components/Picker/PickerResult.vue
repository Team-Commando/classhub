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
      <canvas id="result-chart"></canvas>
    </div>

    <div class="status-container">
      <div class="status-box">
        <div class="status-label">응답 진행 현황</div>
        <div class="status-value">{{ responseCount }} / {{ totalStudents }}</div>
      </div>
    </div>

    <div class="action-container">
      <button @click="backToPicker" class="action-button">질문 생성으로 돌아가기</button>
      <button @click="endResult" class="action-button end-button">종료</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import styles from '../../assets/css/Picker.module.css';

export default {
  name: 'PickerResult',
  props: {
    question: {
      type: String,
    },
    choices: {
      type: Array,
    },
    pickerType: {
      type: Number,
    },
  },
  data() {
    return {
      circleCount: 0,
      crossCount: 0,
      responseCount: 0,
      totalStudents: 0,
      choicesCount: {}, // 초기 선택 수
      respondedSessionIds: new Set(), // 응답한 세션 ID 저장

    };
  },
  computed: {
    ...mapState(["socket", "pickerSelect", "students"]),
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
  watch: {
    pickerSelect(newVal, oldVal) {
      if (newVal) {
        this.handleIncomingSelect(newVal);
      }
    }
  },
  mounted() {
    if(this.pickerType === 1){
      this.renderChart();
    }
    this.totalStudents =  Object.keys(this.students).length;

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
          this.updateChart();
      }
      this.responseCount++;
      this.respondedSessionIds.add(sessionId); // 응답한 세션 추가


    },
    backToPicker(){
      this.$emit('endPicker');
      this.$emit('switchComponent', 'Picker');
    },

    endResult() {
      this.$emit('toggleWidgetModal')
      this.$emit('endPicker');
      this.$emit('switchComponent', 'Picker');
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    renderChart() {
      // choices 배열의 각 요소를 순회하며 choicesCount 객체에 키와 값을 초기화
      this.choices.forEach(choice => {
        this.choicesCount[choice] = 0;
      });

      const ctx = document.getElementById('result-chart').getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }

      const backgroundColors = this.choices.map(() => this.getRandomColor());

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
            data: this.choicesCount,
            backgroundColor: backgroundColors
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                callback: function(value) {
                  // value를 일정 길이 이상이면 생략
                  const maxLineLength = 10; // 한 줄에 표시할 최대 길이
                  const label = this.getLabelForValue(value);
                  if (label.length > maxLineLength) {
                    return label.slice(0, maxLineLength) + '...';
                  } else {
                    return label;
                  }
                }
              }
            },  
            y: {
              ticks: {
                stepSize: 1 // Y축 눈금을 1단위로 설정합니다.
              }
            }
          },
          plugins: {
            legend: {
              display: false // legend display 옵션을 false로 설정하여 숨깁니다.
            }
          }
        }
      });
    },
    updateChart() {
      this.chart.data.datasets[0].data = this.choicesCount;

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
#result-chart{
  width: 800px;
  height: 600px;
}
</style>
