<template>
  <div id="student-login">
    <form @submit.prevent="joinClassroom">
      <label for="classCode">Class Code:</label>
      <input v-model="internalClassCode" type="text" id="classCode" required />
      <label for="studentName">Student Name:</label>
      <input v-model="studentName" type="text" id="studentName" required />
      <button type="submit">Join Classroom</button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      internalClassCode: "",
      studentName: "",
    };
  },
  computed: {
    ...mapState('websocket', ['socket']),
  },
  methods: {
    async joinClassroom() {
      if (this.internalClassCode && this.studentName) {
        console.log("Joining classroom:", this.internalClassCode, "with name:", this.studentName);

        try {
          // Vuex 상태 업데이트
          this.$store.dispatch("websocket/triggerClassCode", this.internalClassCode);
          this.$store.dispatch("websocket/triggerSender", this.studentName);
          this.$store.dispatch("websocket/triggerUserType", 'student');

          // WebSocket 연결 초기화
          const connect = this.$store.dispatch("websocket/initializeWebSocket", this.internalClassCode);

          connect.then(() => {
            this.socket.publish({
              destination: `/pub/join/${this.internalClassCode}`,
              body: JSON.stringify({
                type: "JOIN",
                sender: this.studentName,
              }),
            });
            // Classroom 페이지로 이동
            this.$router.push({
              name: "Classroom",
              params: { classCode: this.internalClassCode },
              query: { currentUser: this.studentName, userType: 'student' },
            });
          });
        } catch (error) {
          console.error("Failed to initialize WebSocket connection:", error);
          alert("Failed to initialize WebSocket connection. Please try again.");
        }
      } else {
        alert("Classroom ID and Name are required.");
      }
    },
  },
};
</script>

<style scoped>
#student-login {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 50px auto;
}
label {
  margin: 10px 0 5px;
}
input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
