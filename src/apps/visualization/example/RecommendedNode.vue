<template>
  <v-flex>
    <v-card>
      <div class="card-header">
        {{ node.document.title }}
      </div>

      <v-card-title primary-title>
        <div>
          <p class="title">{{ node.title }}</p>
        </div>
        <div>
          <v-chip class="chip-action"> <v-icon small>add</v-icon> </v-chip>
          <v-chip class="chip-action">
            <v-icon small>bookmark_border</v-icon>
          </v-chip>
          <v-chip class="chip-action"> View Content </v-chip>
        </div>
      </v-card-title>

      <v-card-text>
        <div>
          {{ node.notes }}
          <ul>
            <li v-for="standard in fullNodeInfo.children" :key="standard.id">
              {{ standard.title }}
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-chip class="tag">
          <v-img
            :src="getCountryIconURL(node.document.country)"
            aspect-ratio="1"
          ></v-img>
          {{ node.document.country }}
        </v-chip>
        <v-chip class="tag"> Subject </v-chip>
        <v-chip class="tag"> Grade </v-chip>
        <v-chip class="tag"> Languages </v-chip>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { nodeResource } from "@/client";

export default {
  name: "RecommendedNode",
  data() {
    return {
      fullNodeInfo: null
    };
  },
  created() {
    this.setFullNodeInfo();
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    setFullNodeInfo() {
      nodeResource.getModel(this.node.id).then(node => {
        this.fullNodeInfo = node;
      });
    },
    getCountryIconURL(country) {
      switch (country) {
        case "USA":
          return "https://github.com/madebybowtie/FlagKit/raw/master/Assets/PNG/US@2x.png?raw=true";
        default:
          return "";
      }
    }
  }
};
</script>

<style scoped>
.card-header {
  background-color: #000000;
  color: #ffffff;
  font-weight: bold;
  padding: 12px;
}
.chip-action {
  background-color: transparent;
  border: 1px solid #2f80ed;
  color: #2f80ed;
}
.tag {
  background-color: #f0f6fb;
}
.title {
  font-size: 20px;
}
</style>
