<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-container fluid>
        <Node v-if="node1" class="node subsection" :nodeData="node1" />
        <Node v-if="node2" class="node subsection" :nodeData="node2" />
      </v-container>
    </v-flex>
    <v-flex xs12>
      <v-container fluid>
        <v-form @submit="submitRating">
          <v-radio-group
            v-model="rating"
            label="How related are these curriculum nodes?"
          >
            <v-radio label="Exact match" value="1" />
            <v-radio label="Partial match" value="0.5" />
            <v-radio label="Unrelated" value="0" />
          </v-radio-group>
          <v-radio-group
            v-model="confidence"
            label="How confident are you of this decision?"
          >
            <v-radio label="Completely" value="1" />
            <v-radio label="Somewhat" value="0.5" />
            <v-radio label="Not at all" value="0" />
          </v-radio-group>
          <v-textarea
            label="What criteria did you use to make this decision?"
            auto-grow
          />
          <v-btn :disabled="rating === null" type="submit">
            Submit
          </v-btn>
        </v-form>
      </v-container>
    </v-flex>
  </v-layout>
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
