<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12> </v-flex>
      <v-flex xs6>
        <Node v-if="node1" :nodeData="node1" />
      </v-flex>
      <v-flex xs6>
        <Node v-if="node2" :nodeData="node2" />
      </v-flex>
      <v-flex xs12>
        <v-container fluid>
          <v-form
            @submit.prevent="submitRating"
            v-model="valid"
            ref="form"
            lazy-validation
          >
            <v-radio-group
              v-model="rating"
              label="How relevant are these two nodes to one another?"
              required
              :rules="matchRules"
            >
              <v-radio label="Highly relevant" value="1" />
              <v-radio label="Somewhat relevant" value="0.5" />
              <v-radio label="Not relevant" value="0" />
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
            <v-btn type="submit">
              Submit
            </v-btn>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
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
      comment: "",
      valid: true,
      selectedCurriculum: null
    };
  },
  created() {
    this.setNodes();
  },
  computed: {
    matchRules() {
      return [v => !!v || "This field is required"];
    }
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
      if (this.$refs.form.validate()) {
        this.$refs.form.resetValidation();
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
            this.$refs.form.reset();
            return this.setNodes();
          });
      }
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

<style lang="scss"></style>
