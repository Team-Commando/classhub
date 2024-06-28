<template>
  <div id="teacher-login">
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input v-model="username" type="text" id="username" required />
      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  computed: {
    ...mapState('websocket', ['socket', 'classCode']),
    ...mapState('jokes', ['data']),
  },
  methods: {
    login() {
      axios
        .post("http://localhost:8080/api/teacher/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data) {
            console.log('여긴됨?1')
            return axios.get(
              `http://localhost:8080/api/classrooms/teacher/${response.data}`
            );
          } else {
            throw new Error("Invalid credentials");
          }
        })
        .then((classCodeResponse) => {
          const internalClassCode = classCodeResponse.data.code;
          // Vuex 상태 업데이트

          this.$store.dispatch("websocket/triggerClassCode", internalClassCode);
          this.$store.dispatch("websocket/triggerSender", this.username);
          this.$store.dispatch("websocket/triggerUserType", 'teacher');


          // WebSocket 연결 초기화
          const connect = this.$store.dispatch("websocket/initializeWebSocket", internalClassCode);
          connect.then(() => {
            // Redirect to the classroom page
            this.$router.push({
              name: "Classroom",
              params: { classCode: internalClassCode },
              query: { currentUser: this.username, userType: 'teacher' },
            });
          });
        })
        .catch((error) => {
          console.error("Login failed: ", error.message);
          alert("Login failed: " + error.message);
        });
    },
  },
};
</script>

<style scoped>
#teacher-login {
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
