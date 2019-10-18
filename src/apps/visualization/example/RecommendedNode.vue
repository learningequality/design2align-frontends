<template>
  <v-flex>
    <v-card>
      <div class="card-header">
        {{ node.document.title }}
      </div>

      <v-layout row wrap>
        <v-card-title primary-title
          ><v-flex>
            <v-flex align-self-start
              ><p class="title">{{ node.title }}</p></v-flex
            >
            <v-flex align-self-end class="card-actions">
              <v-chip class="chip-action"> <v-icon small>add</v-icon> </v-chip>
              <v-chip class="chip-action">
                <v-icon small>bookmark_border</v-icon>
              </v-chip>
              <v-chip class="chip-action"> View Content </v-chip>
            </v-flex>
          </v-flex></v-card-title
        ></v-layout
      >

      <v-card-text>
        <div>
          {{ node.notes }}
          <ul v-if="fullNodeInfo">
            <li v-for="standard in fullNodeInfo.children" :key="standard.id">
              {{ standard.title }}
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-chip class="tag">
          <Flag :country="node.document.country" />
        </v-chip>
        <v-chip class="tag"> Subject </v-chip>
        <v-chip class="tag"> Grade </v-chip>
        <v-chip class="tag"> Languages </v-chip>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import Flag from "../../judgment/evaluation/Flag";
import { nodeResource } from "@/client";

export default {
  name: "RecommendedNode",
  data() {
    return {
      fullNodeInfo: null
    };
  },
  components: {
    Flag
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
.card-actions {
  /*position: absolute;
  right: 16px;*/
}
.chip-action {
  background-color: transparent;
  border: 1px solid #2f80ed;
  color: #2f80ed;
}
.tag {
  background-color: #f0f6fb;
  text-align: center;
}
.title {
  font-size: 20px;
}
</style>
