<template>
  <v-content>
    <v-container fluid>
      <v-text-field v-model="username" name="username" label="Username" />
      <v-text-field
        v-model="password"
        name="password"
        type="password"
        label="Password"
      />
      <br />
      <v-btn @click="login">Login</v-btn>
      <span v-if="error" style="color: red; font-weight: bold;">
        There was an error logging in:
        {{ error }}
      </span>
      <p>Need an account? <a :href="registerLink">Register here</a></p>
      <p v-if="devServer" style="color: red; font-weight: bold;">
        Registration will redirect you to the production server, make sure to
        reopen the devserver URL after registration
      </p>
    </v-container>
  </v-content>
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
