<template>
  <div class="box" @click="$emit('input', !value)" :class="{ selected: value }">
    <v-icon>{{ value ? "lens" : "panorama_fish_eye" }}</v-icon>
    {{ label }}
  </div>
</template>

<script>
export default {
  name: "ToggleBox",
  props: {
    value: {
      type: Boolean
    },
    label: {
      type: String
    }
  }
};
</script>

<style scoped>
.box {
  border-radius: 30px;
  border: 2px solid #90a4ae;
  margin: 15px;
  font-size: 14pt;
  padding: 5px 20px;
  cursor: pointer;
}
.v-icon {
  margin-right: 15px;
  vertical-align: text-bottom;
}

.box.selected {
  border-color: #2196f3;
  color: #2196f3;
  background-color: #e3f2fd;
}
.box.selected .v-icon {
  color: #2196f3;
}
</style>
