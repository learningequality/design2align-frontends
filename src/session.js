import Vue from "vue";

const sessionData = new Vue({
  data() {
    return {
      username: "",
      token: ""
    };
  },
  computed: {
    loggedIn() {
      return Boolean(this.username && this.token);
    }
  },
  watch: {
    username(newVal) {
      window.localStorage.setItem("username", newVal);
    },
    token(newVal) {
      window.localStorage.setItem("token", newVal);
    }
  }
});

if (localStorage.getItem("username")) {
  sessionData.username = localStorage.getItem("username");
}

if (localStorage.getItem("token")) {
  sessionData.token = localStorage.getItem("token");
}

export default sessionData;
