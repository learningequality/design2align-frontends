<template>
  <div>
    <label for="username">Username</label>
    <input type="text" name="username" v-model="username" />
    <br />
    <label for="password">Password</label>
    <input type="password" name="password" v-model="password" />
    <br />
    <button @click="login">Login</button>
    <span v-if="error" style="color: red; font-weight: bold;">
      There was an error logging in:
      {{ error }}
    </span>
    <p>Need an account? <a :href="registerLink">Register here</a></p>
    <p v-if="devServer" style="color: red; font-weight: bold;">
      Registration will redirect you to the production server, make sure to
      reopen the devserver URL after registration
    </p>
  </div>
</template>

<script>
import { baseUrl, login } from "./client";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: null
    };
  },
  computed: {
    registerLink() {
      return `${baseUrl}/register/`;
    },
    devServer() {
      return process.env.NODE_ENV !== "production";
    }
  },
  methods: {
    login() {
      this.error = null;
      return login(this.username, this.password)
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.error = err;
        });
    }
  }
};
</script>
