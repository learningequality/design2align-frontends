<template>
  <div>
    <label for="username">Username</label>
    <input type="text" name="username" v-model="username" />
    <br />
    <label for="password">Password</label>
    <input type="password" name="password" v-model="password" />
    <br />
    <button @click="login">Login</button>
    <p>Need an account? <a :href="registerLink">Register here</a></p>
  </div>
</template>

<script>
import { baseUrl, login } from "./client";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    registerLink() {
      return `${baseUrl}/register/`;
    }
  },
  methods: {
    login() {
      return login(this.username, this.password).then(() => {
        this.$router.push({ name: "home" });
      });
    }
  }
};
</script>
