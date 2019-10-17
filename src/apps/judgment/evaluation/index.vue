<template>
  <v-container fluid>
    <v-alert :value="errorMsg.length > 0" dismissible type="error">
      {{ errorMsg }}
    </v-alert>

    <v-layout row wrap>
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
              label="How related are these curriculum nodes?"
              required
              :rules="matchRules"
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
            <v-btn type="submit">
              Submit
            </v-btn>
          </v-form>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn v-clipboard:copy="shareUrl" v-on="on">Share</v-btn>
            </template>
            <span>Click to copy</span>
          </v-tooltip>
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
      errorMsg: "",
      shareUrl: "",
      valid: true
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
      this.errorMsg = "";
      this.shareUrl = "";

      if (!this.maybeSetNodesFromQueryParams()) {
        // Randomly get two nodes to compare if the user hasn't specified them.
        nodeResource.getComparisonNodes().then(nodes => {
          this.node1 = nodes[0];
          this.node2 = nodes[1];
          this.setShareUrl(this.node1.id, this.node2.id);
        });
      }
    },
    maybeSetNodesFromQueryParams() {
      // node1 must be set and a valid number to proceed.
      let nodeParam1 = this.$route.query.node1;
      if (nodeParam1 == null) {
        return false;
      }

      let nodeId1 = parseInt(nodeParam1);
      if (isNaN(nodeId1)) {
        this.errorMsg = "The node1 and node2 parameters must be valid numbers.";
        return false;
      }

      // Get node2, if the user has specified it.
      let nodeParam2 = this.$route.query.node2;
      let nodeId2 = parseInt(nodeParam2);
      let useRandomNode2 = true;
      if (!isNaN(nodeId2)) {
        useRandomNode2 = false;
      } else if (nodeParam2 != null) {
        // node2 is specified but not a valid number.
        this.errorMsg = "The node1 and node2 parameters must be valid numbers.";
      }

      // Retrieve both nodes.
      const node1Promise = nodeResource.getModel(nodeId1);
      let node2Promise = null;
      if (useRandomNode2) {
        // TODO: replace with method to get comparison node for a given node.
        node2Promise = nodeResource.getComparisonNodes();
      } else {
        node2Promise = nodeResource.getModel(nodeId2);
      }

      Promise.all([node1Promise, node2Promise]).then(nodes => {
        this.node1 = nodes[0];
        if (useRandomNode2) {
          this.node2 = nodes[1][0];
        } else {
          this.node2 = nodes[1];
        }
        this.setShareUrl(this.node1.id, this.node2.id);
      });

      return true;
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
    },
    setShareUrl(nodeId1, nodeId2) {
      // TODO: Don't use raw string.
      this.shareUrl =
        "https://hackathon.learningequality.org/#/judgment/evaluation?node1=" +
        nodeId1 +
        "&node2=" +
        nodeId2;
    }
  }
};
</script>

<style lang="scss"></style>
