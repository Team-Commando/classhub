<template>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg" data-bs-theme="light">
    <div class="container-fluid">
      <a class="navbar-brand">클래스룸</a>
      <form class="d-flex" role="search">
        <div class="card">
          <div class="card-body d-flex">
            <h5>http://localhost:5173/student/{{ classCode }}</h5>
            <button @click="changeModalData('반 코드')" class="btn btn-sm btn-outline-secondary" type="button" 
            data-bs-toggle="modal" data-bs-target="#exampleModalCenter">코드</button>
            <button @click="changeModalData('QR 코드')" class="btn btn-sm btn-outline-secondary" type="button" 
            data-bs-toggle="modal" data-bs-target="#exampleModalCenter">QR</button>
          </div>
        </div>
        <button @click="toggleStudentList" class="btn btn-outline-success me-2" type="button">
          학생리스트
        </button>
      </form>
    </div>
  </nav>

  <!-- 클래스룸 본문 -->
  <div id="classBody">

    <!-- Other components can be added here -->
    <!-- 수진 -->




    <!-- 창규 -->




    <!-- 영주 -->




  </div>
  <Whiteboard :classCode="classCode" :sender="sender" />


  <!-- Student List Modal -->
  <div v-if="isStudentListOpen" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">접속 중인 학생 리스트</h5>
          <button type="button" class="btn-close" @click="toggleStudentList"></button>
        </div>
        <div class="modal-body">
          <ul>
            <li v-for="(name, sessionId) in students" :key="sessionId">{{ name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <DimModal :modalData="modalData"/>
  <!-- Widget Modal: 버튼 클릭 시, 선택한 위젯에 대한 모달창 출력 -->
  <WidgetModal
      v-for="(w, i) in wArr"
      :key="i"
      :isWidgetModalOpen="w.isOpen"
      :wId="w.wId"
      :title="w.title"
      @close="closeWidgetModal(w.wId)"
  />
  <WidgetModal2 :isWidgetModalOpen="this.isWidgetModalOpen2" @toggleWidgetModal="toggleWidgetModal2" :pickerType="pickerType"/>

  <!-- 하단 위젯 선택 버튼 생성 -->
  <button v-for="(wButton, i) in widget" :key="i" @click="toggleWidgetModal(wButton.wId)">{{ wButton.title }}</button>
  <div class="btn-group dropup">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      고르기
    </button>
    <ul class="dropdown-menu">
      <li><a @click="toggleWidgetModal2(true,0)" class="dropdown-item">OX</a></li>
      <li><a @click="toggleWidgetModal2(true,1)" class="dropdown-item">선다형</a></li>
    </ul>
  </div>

</template>

<script>
import Whiteboard from "../components/Whiteboard.vue";
import { mapState } from "vuex";
import { reactive } from "vue";
import DimModal from "../components/DimModal.vue";
import WidgetModal from "../components/WidgetModal.vue";
import WidgetModal2 from "../components/WidgetModal2.vue";

export default {
  name: "Classroom",
  components: {
    Whiteboard,
    DimModal,
    WidgetModal,
    WidgetModal2,
  },
  props: {
    classCode: {
      type: String,
      required: true,
    },
  },
  setup() {
    // const students = reactive({});
    const modalData = reactive({ modalTitle: '', modalBody: '' });
    return { modalData };
  },
  data() {
    return {
      sender: this.$route.query.currentUser,
      userType: this.$route.query.userType, // Added to get user type

      pickerType: 0,
      isStudentListOpen: false,
      canLeaveSite: false,
      isWidgetModalOpen2:false,

      // widget 정의: 위젯별 고유 ID, 위젯명, 위젯(모달창) 활성화 유무 설정
      widget: [
        { wId: 0, title: '칠교놀이', isOpen: false },
        { wId: 1, title: '주사위', isOpen: false },
      ],
      wArr: {},   // 활성화된 위젯을 관리하는 Object
      wArrId: 0,  // wArr(Object)의 key를 동적으로 생성하기 위해 선언
    };
  },
  computed: {
    ...mapState(["socket", "students"]),
  },
  mounted() {
    this.$store.dispatch("subscribeToClass", { classCode: this.classCode, userType: this.userType });

    window.addEventListener("beforeunload", this.unLoadEvent);
  },
  methods: {
    unLoadEvent(event) {
      if (this.canLeaveSite) return;

      event.preventDefault();
      event.returnValue = "";

      this.leaveClassroom();
    },
    leaveClassroom() {
      const message = JSON.stringify({
        sender: this.sender,
        type: "LEAVE",
      });
      if (this.socket && this.socket.connected) {
        this.socket.publish({
          destination: `/pub/leave/${this.classCode}`,
          body: message,
        });
      }
    },
    toggleStudentList() {
      this.isStudentListOpen = !this.isStudentListOpen;
    },
    changeModalData(title) {
      this.modalData.modalTitle = title;
      this.modalData.modalBody = this.classCode;
    },

    // 선택한 위젯을 활성화
    toggleWidgetModal(wId) {
      this.widget[wId].isOpen = true;             // 선택한 위젯의 isOpen 속성을 true로 변경

      // wArr(object) 데이터 추가: key 값을 동적으로 생성
      this.wArrId = wId;                          // wArr key: wArr(Object)의 key 값을 선택한 위젯의 고유 ID와 동일하게 설정
      this.wArr[this.wArrId] = this.widget[wId];  // wArr value: key에 해당하는 위젯 정보(wId, title, isOpen)를 설정
    },

    // 선택한 위젯을 비활성화
    closeWidgetModal(wId) {
      this.widget[wId].isOpen = false;            // 선택한 위젯의 isOpen 속성을 false로 변경
      delete this.wArr[wId];                      // wArr(Object)에서 선택한 위젯에 해당하는 데이터를 삭제
    },

    toggleWidgetModal2(forceToggle, pickerType) {
        this.pickerType = pickerType;

        if(typeof forceToggle === "boolean"){
          this.isWidgetModalOpen2 = forceToggle;
        }else {
          this.isWidgetModalOpen2 = !this.isWidgetModalOpen2;
        }
    },

  },
};
</script>

<style scoped>
#classBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.popup {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 200px;
  padding: 10px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
