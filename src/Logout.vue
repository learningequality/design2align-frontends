<template>
  <div></div>
</template>

<script>
import session from "./session";

export default {
  name: "Logout",
  created() {
    session.username = "";
    session.token = "";
    this.$router.push({ name: "login" });
  }
};
</script>
