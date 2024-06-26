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
  <!-- Widget Modal: 버튼 클릭 시, 모달창 내부에 선택한 위젯 콘텐츠 출력 -->
  <WidgetModal1
      v-for="(w, i) in wArr"
      :key="i"
      :isWidgetModalOpen="w.isOpen"
      :choice="w.cId"
      :title="widget[w.cId].title"
      @close="closeWidgetModal1(w.cId)"
  />
  <WidgetModal2 :isWidgetModalOpen="this.isWidgetModalOpen2" @toggleWidgetModal="toggleWidgetModal2" :classCode="classCode" :sender="sender" :pickerType="pickerType" :userType="userType"/>

  <!-- 하단 위젯 선택 버튼 생성 -->
  <button v-for="(wButton, i) in widget" :key="i" @click="toggleWidgetModal1(wButton.wId)">{{ wButton.title }}</button>
  <div class="btn-group dropup">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      고르기
    </button>
    <ul class="dropdown-menu">
      <li><a @click="toggleWidgetModal2('true',0)" class="dropdown-item">OX</a></li>
      <li><a @click="toggleWidgetModal2('true',1)" class="dropdown-item">선다형</a></li>
    </ul>
  </div>

</template>

<script>
import Whiteboard from "../components/Whiteboard.vue";
import { mapState } from "vuex";
import { reactive } from "vue";
import DimModal from "../components/DimModal.vue";
import WidgetModal1 from "../components/WidgetModal1.vue";
import WidgetModal2 from "../components/WidgetModal2.vue";

export default {
  name: "Classroom",
  components: {
    Whiteboard,
    DimModal,
    WidgetModal1,
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

      // widget 정의: 위젯별 고유 ID, 위젯명 설정
      widget: [
        { wId: 0, title: '칠교놀이' },
        { wId: 1, title: '주사위' },
      ],

      createWidget: null,       // 생성할 WidgetModal Component
      wArr: [],
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
    toggleWidgetModal1(wId) {
      console.log("wId", wId);
      this.createWidget = {  // 화면에 출력할 모달창에 대한 속성 지정
        cId: wId,            // 위젯 고유 ID 지정 (초기 wId = 0, 이후 모달창 추가 시, 1씩 증가)
        isOpen: true,        // 선택 위젯의 활성화 상태 지정
      };
      this.wArr.push(this.createWidget); // 생성한 WidgetModal Component를 widget(Array)에 push
    },
    closeWidgetModal1(id) {
      console.log("close Widget Modal", id);
      // this.wArr.splice(cId, 1);  // widget 배열에서 종료하고자 하는 위젯을 삭제
      // this.wArr = this.wArr.filter((e) => e !== this.wArr.id);

      if (id == 0) {
        this.wArr.splice(id, 1);
      } else {
        this.wArr.splice(id - 1, 1);
      }
      this.wArr[id].isOpen = false;
      console.log(this.wArr);
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
