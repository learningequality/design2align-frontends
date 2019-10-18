<template>
  <v-card>
    <div class="card-header">
      {{ node.document.title }}
    </div>

    <v-card-title primary-title>
      <v-layout align-center row justify-space-between fill-height>
        <v-flex align-center>
          <span class="title">{{ node.title }}</span>
        </v-flex>
        <v-flex xs8 justify-end class="card-actions">
          <v-chip class="chip-action">
            <v-icon small>add</v-icon>
          </v-chip>
          <v-chip class="chip-action">
            <v-icon small>bookmark_border</v-icon>
          </v-chip>
          <v-chip class="chip-action"> View Content </v-chip>
        </v-flex>
      </v-layout>
    </v-card-title>

    <v-card-text class="card-text">
      <div v-if="node.notes.length > 0">{{ node.notes }} <br /><br /></div>

      <p>Some standards:</p>
      <ul v-if="fullNodeInfo">
        <li
          v-for="standard in fullNodeInfo.children.slice(0, 4)"
          :key="standard.id"
        >
          {{ standard.title }}
        </li>
      </ul>
    </v-card-text>

    <v-card-actions>
      <v-layout align-center row justify-space-between fill-height>
        <v-flex>
          <v-chip class="tag">
            <Flag :country="node.document.country" />
          </v-chip>
        </v-flex>

        <v-flex xs4 justify-end class="relevance">
          <span v-bind:class="getRelevanceClass" class="relevance-number">
            {{ Math.round(relevanceScore * 100) }}%</span
          >
          <br />
          <span class="relevance-label">Relevance score</span>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
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
  computed: {
    getRelevanceClass() {
      if (this.relevanceScore >= 0.75) {
        return "high-relevance";
      } else if (this.relevanceScore >= 0.45) {
        return "medium-relevance";
      }
      return "low-relevance";
    }
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    relevanceScore: {
      type: Number,
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
  text-align: right;
}
.card-text {
  padding-top: 0px;
}
.chip-action {
  background-color: transparent;
  border: 1px solid #2f80ed;
  color: #2f80ed;
}
.relevance {
  text-align: right;
  line-height: 100%;
}
.relevance-number {
  font-size: 20px;
  font-weight: bold;
}
.high-relevance {
  color: #219653;
}
.medium-relevance {
  color: #f2994a;
}
.low-relevance {
  color: #f24a4a;
}
.relevance-label {
  color: #4f4f4f;
  font-size: 12px;
}
.tag {
  background-color: #f0f6fb;
  text-align: center;
}
.title {
  font-size: 20px;
}
</style>
