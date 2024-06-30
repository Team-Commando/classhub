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
      v-for="(w, i) in activeWidget"
      :key="i"
      :isWidgetModalOpen="w.isOpen"
      :wId="w.wId"
      :title="w.title"
      @open="openWidgetModal(w.wId)"
      @close="closeWidgetModal(w.wId)"
      :pickerType="state.pickerType"
      :ref="'widgetModal'+ i"
  />

  <!-- 하단 위젯 선택 버튼 생성 -->
  <div class="btn-group dropup">
    <button v-for="(wButton, i) in widget" :key="i" @click="openWidgetModal(wButton.wId)" >{{ wButton.title }}</button>
  </div>

  <div class="btn-group dropup">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      고르기
    </button>
    <ul class="dropdown-menu">
<!--      <li><a @click="toggleWidgetModal(2, 1)" class="dropdown-item">OX</a></li>-->
<!--      <li><a @click="toggleWidgetModal(2, 2)" class="dropdown-item">선다형</a></li>-->
    </ul>
  </div>

</template>

<script>
import Whiteboard from "../components/Whiteboard.vue";
import {mapMutations, mapState} from "vuex";
import {reactive, ref} from "vue";
import DimModal from "../components/DimModal.vue";
import WidgetModal from "../components/WidgetModal.vue";
import WidgetModal2 from "../components/Picker/Picker.vue";

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
  setup(props, { root }) {
    const modalData = reactive({ modalTitle: "", modalBody: "" });

    let state = reactive({
      canLeaveSite: false,
      pickerType: null,
    });
    const isStudentListOpen = ref(false);

    const toggleStudentList = () => {
      isStudentListOpen.value = !isStudentListOpen.value;
    };

    const changeModalData = (title) => {
      modalData.modalTitle = title;
      modalData.modalBody = props.classCode;
    };

    return {
      modalData,
      state,
      isStudentListOpen,
      toggleStudentList,
      changeModalData,
    };
  },
  data() {
    return {
      sender: this.$route.query.currentUser,
      userType: this.$route.query.userType,
      pickerType: null,
    }
  },
  computed: {
    ...mapState('modalStore', {
      widget: state => state.widget,
      activeWidget: state => state.activeWidget,
      activeWidgetKey: state => state.activeWidgetKey,
      // pickerType: state => state.pickerType,
    }),
    ...mapState('websocket',["socket", "students", "pickerStart"]),
  },
  watch: {
    pickerStart: { //학생의 경우, watch를 모달창에서 해야 Picker 적용됨
      handler(newVal) {
        if (newVal) {
          this.toggleWidgetModal(2, newVal.data.pickerType);
          this.$nextTick(() => {
            const widgetComponent = this.$refs['widgetModal2'][0];
            if (widgetComponent) {
              widgetComponent.switchToPickerSelect(newVal);
            }
          });
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.dispatch("websocket/subscribeToClass", {classCode: this.classCode, userType: this.userType});

    window.addEventListener("beforeunload", this.unLoadEvent);
  },
  methods: {
    ...mapMutations('modalStore', ['openWidgetModal', 'closeWidgetModal']),

    unLoadEvent(event) {
      if (this.state.canLeaveSite) return;

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
  },

  toggleWidgetModal2(forceToggle, pickerType) {
    this.pickerType = pickerType;

    if (typeof forceToggle === "boolean") {
      this.isWidgetModalOpen2 = forceToggle;
    } else {
      this.isWidgetModalOpen2 = !this.isWidgetModalOpen2;
    }
  }
}
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