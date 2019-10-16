<template>
  <div>
    <div class="section">
      <Node v-if="node1" class="node subsection" :nodeData="node1" />
      <Node v-if="node2" class="node subsection" :nodeData="node2" />
    </div>
    <div style="width: 100%;">
      <p>How related are these curriculum nodes? (<i>Required</i>)</p>
      <input type="radio" v-model="rating" value="1" />Exact match<br />
      <input type="radio" v-model="rating" value="0.5" />Partial match<br />
      <input type="radio" v-model="rating" value="0" />Unrelated
      <hr />
    </div>
    <div class="section">
      <div class="subsection">
        <p>How confident are you of this decision?</p>
        <input type="radio" v-model="confidence" value="1" />Completely<br />
        <input type="radio" v-model="confidence" value="0.5" />Somewhat<br />
        <input type="radio" v-model="confidence" value="0" />Not at all<br />
        <hr />
        <button :disabled="rating === null" @click="submitRating">
          Submit
        </button>
      </div>
      <div class="subsection">
        <p label-for="comment">
          What criteria did you use to make this decision?
        </p>
        <textarea v-model="comment" rows="4" cols="75" name="comment" />
      </div>
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
      confidence: null,
      comment: ""
    };
  },
  created() {
    this.setNodes();
  },
  methods: {
    setNodes() {
      this.node1 = null;
      this.node2 = null;
      this.rating = null;
      this.confidence = null;
      this.comment = "";
      this.startTimer();
      nodeResource.getComparisonNodes().then(nodes => {
        this.node1 = nodes[0];
        this.node2 = nodes[1];
      });
    },
    submitRating() {
      const name = this.$route.name.replace("judgment-", "");
      const uiName =
        name.slice(0, 1).toUpperCase() + name.replace("-index", "").slice(1);
      this.stopTimer();
      return judgmentResource
        .submitJudgment(
          this.node1.id,
          this.node2.id,
          this.rating,
          this.confidence,
          uiName,
          {
            comment: this.comment,
            time_for_judgment: this.elapsedTime
          }
        )
        .then(() => {
          return this.setNodes();
        });
    },
    startTimer() {
      this.elapsedTime = null;
      this.resumeTimer();
      window.addEventListener("blur", this.stopTimer.bind(this));
      window.addEventListener("focus", this.resumeTimer.bind(this));
    },
    stopTimer() {
      if (this.timerRunning) {
        this.timerRunning = false;
        this.elapsedTime += Date.now() - this.startTime;
      }
    },
    resumeTimer() {
      if (!this.timerRunning) {
        this.timerRunning = true;
        this.startTime = Date.now();
      }
    }
  }
};
</script>

<style lang="scss">
.section {
  display: inline-block;
  width: 100%;
  > :first-child {
    float: left;
  }
  > :last-child {
    float: right;
  }
}

.subsection {
  display: inline-block;
  width: 49%;
}

.node {
  border: red solid 1px;
}
</style>
