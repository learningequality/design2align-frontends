<template>
  <div>
    <div class="section">
      <Node v-if="node1" class="node" style="float: left;" :nodeData="node1" />
      <Node v-if="node2" class="node" style="float: right;" :nodeData="node2" />
    </div>
    <div class="section">
      <p>How aligned are these curriculum nodes?</p>
      <input type="radio" v-model="rating" value="1" />Aligned<br />
      <input type="radio" v-model="rating" value="0.5" />Similar<br />
      <input type="radio" v-model="rating" value="0" />Different
      <hr />
      <p>How confident are you of this decision?</p>
      <input type="radio" v-model="confidence" value="1" />Completely<br />
      <input type="radio" v-model="confidence" value="0.5" />Somewhat<br />
      <input type="radio" v-model="confidence" value="0" />Not at all<br />
      <hr />
      <button @click="submitRating">Submit</button>
    </div>
  </div>
</template>

<script>
import Node from "./Node";
import { nodeResource, judgmentResource } from "@/client";
export default {
  name: "Judgment",
  components: {
    Node
  },
  data() {
    return {
      node1: null,
      node2: null,
      rating: null,
      confidence: null
    };
  },
  created() {
    this.setNodes();
  },
  methods: {
    setNodes() {
      nodeResource.getComparisonNodes().then(nodes => {
        this.node1 = nodes[0];
        this.node2 = nodes[1];
      });
    },
    submitRating() {
      const name = this.$route.name.replace("judgment");
      const uiName =
        name.slice(0, 1).toUpperCase() + name.replace("-index", "").slice(1);
      return judgmentResource
        .submitJudgment(
          this.node1.id,
          this.node2.id,
          this.rating,
          this.confidence,
          uiName
        )
        .then(() => {
          this.node1 = null;
          this.node2 = null;
          this.rating = null;
          this.confidence = null;
          return this.setNodes();
        });
    }
  }
};
</script>

<style lang="scss">
.section {
  display: inline-block;
}

.node {
  width: 49%;
  border: red solid 1px;
}
</style>
