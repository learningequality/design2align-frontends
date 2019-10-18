<template>
  <v-container fluid :key="curriculum">
    <v-layout row wrap>
      <v-alert :value="errorMsg.length > 0" dismissible type="error">
        {{ errorMsg }}
      </v-alert>
      <v-flex xs12 sm6 md4 class="section">
        <h2>Main content item</h2>
        <Node v-if="node1" :nodeData="node1" />
        <div v-else class="loading">
          <v-progress-circular indeterminate color="#18BAFF" />
        </div>
      </v-flex>
      <v-flex xs12 sm6 md4 class="section">
        <h2>Is this item relevant?</h2>
        <Node v-if="node2" :nodeData="node2" />
        <div v-else class="loading">
          <v-progress-circular indeterminate color="#18BAFF" />
        </div>
      </v-flex>
      <v-spacer />
      <v-flex sm12 md4 class="section" height="100%">
        <v-layout fill-height row wrap>
          <div style="width: 100%;">
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  flat
                  v-if="answer"
                  @click="setAnswer(null)"
                  style="padding: 5px; min-width: 0px;"
                  >Back</v-btn
                >
              </v-flex>
              <v-spacer />
              <v-flex class="progress"> {{ count }} / {{ total }} </v-flex>
            </v-layout>
            <div v-for="option in answers" :key="option.id">
              <v-btn
                block
                round
                outline
                large
                :color="option.color"
                v-if="!answer || answer.id === option.id"
                @click="setAnswer(option.id)"
              >
                <v-icon>{{ option.icon }}</v-icon>
                &nbsp;&nbsp;
                {{ option.text }}
              </v-btn>
              <br />
              <v-form
                v-if="answer && answer.id === option.id"
                v-model="valid"
                ref="form"
                lazy-validation
              >
                <div v-if="option.showSimilarities">
                  <h4>Key SIMILARITIES</h4>
                  <ToggleBox v-model="similarities.subject" label="Subject" />
                  <ToggleBox
                    v-model="similarities.keywords"
                    label="Key Words"
                  />
                  <ToggleBox
                    v-model="similarities.competency"
                    label="Competency"
                  />
                  <ToggleBox v-model="similarities.task" label="Task" />
                  <ToggleBox
                    v-model="similarities.proficiency"
                    label="Level Proficiency"
                  />
                </div>
                <div v-if="option.showDifferences">
                  <h4>Key DIFFERENCES</h4>
                  <ToggleBox v-model="differences.subject" label="Subject" />
                  <ToggleBox v-model="differences.keywords" label="Key Words" />
                  <ToggleBox
                    v-model="differences.competency"
                    label="Competency"
                  />
                  <ToggleBox v-model="differences.task" label="Task" />
                  <ToggleBox
                    v-model="differences.proficiency"
                    label="Level Proficiency"
                  />
                </div>
                <v-divider />
                <br />
                <v-textarea label="Additional notes" auto-grow />
              </v-form>
            </div>
            <br /><br /><br />
            <v-layout row justify-center style="text-align: center;">
              <v-spacer />
              <v-flex>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#18BAFF"
                      dark
                      outline
                      fab
                      depressed
                      v-on="on"
                      @click="skip"
                    >
                      <v-icon large>redo</v-icon>
                    </v-btn>
                  </template>
                  <span>Skip</span>
                </v-tooltip>
              </v-flex>
              <v-spacer />
              <v-flex>
                <v-tooltip top v-if="answer">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#18BAFF"
                      dark
                      outline
                      fab
                      depressed
                      v-on="on"
                      @click="submitRating"
                    >
                      <v-icon large>arrow_forward</v-icon>
                    </v-btn>
                  </template>
                  <span>Next</span>
                </v-tooltip>
                <v-tooltip top v-else>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#18BAFF"
                      dark
                      outline
                      fab
                      depressed
                      v-on="on"
                      v-clipboard:copy="shareUrl"
                    >
                      <v-icon large>share</v-icon>
                    </v-btn>
                  </template>
                  <span>Share</span>
                </v-tooltip>
              </v-flex>
              <v-spacer />
            </v-layout>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import Node from "./Node";
import ToggleBox from "./ToggleBox";
import { nodeResource, judgmentResource } from "@/client";
export default {
  name: "EvaluationWindow",
  components: {
    Node,
    ToggleBox
  },
  data() {
    return {
      node1: null,
      node2: null,
      rating: null,
      confidence: null,
      comment: "",
      valid: true,
      selectedCurriculum: null,
      answer: null,
      differences: {},
      similarities: {},
      count: 1,
      errorMsg: ""
    };
  },
  props: {
    total: {
      type: Number,
      default: 5
    },
    curriculum: {
      type: Number,
      required: false
    }
  },
  created() {
    this.setNodes();
  },
  computed: {
    shareUrl() {
      if (this.node1 && this.node2) {
        let query = { node1: this.node1.id, node2: this.node2.id };
        const route = { name: "judgment-evaluation-index", query };
        return window.location.origin + "/" + this.$router.resolve(route).href;
      }
      return "";
    },
    matchRules() {
      return [v => !!v || "This field is required"];
    },
    answers() {
      return [
        {
          id: "yes",
          color: "green",
          icon: "check",
          text: "Yes",
          rating: 1,
          showSimilarities: true,
          showDifferences: false
        },
        {
          id: "somewhat",
          color: "#FFB800",
          icon: "remove",
          text: "Somewhat",
          rating: 0.5,
          showSimilarities: true,
          showDifferences: true
        },
        {
          id: "no",
          color: "red",
          icon: "clear",
          text: "No",
          rating: 0,
          showSimilarities: false,
          showDifferences: true
        }
      ];
    }
  },
  watch: {
    curriculum(newVal) {
      if (newVal || newVal === 0) {
        this.node2 = null;
        nodeResource.getNodeInCurriculum(newVal).then(node => {
          this.setNodes(node.id);
        });
      }
    }
  },
  methods: {
    setNodes(nodeID) {
      this.node2 = null;
      this.rating = null;
      this.answer = null;
      this.confidence = null;
      this.startTimer();

      if (!this.maybeSetNodesFromQueryParams(nodeID)) {
        // Randomly get two nodes to compare if the user hasn't specified them.
        nodeResource.getComparisonNodes().then(nodes => {
          this.node1 = this.node1 || nodes[0];
          this.node2 = nodes[1];
        });
      }
    },
    maybeSetNodesFromQueryParams(nodeParam1) {
      nodeParam1 = nodeParam1 || this.$route.query.node1;
      // node1 must be set and a valid number to proceed.
      if (nodeParam1 == null) {
        return false;
      }
      let nodeId1 = parseInt(nodeParam1);
      if (isNaN(nodeId1)) {
        this.errorMsg = "The node1 and node2 parameters must be valid numbers.";
        return false;
      }
      nodeResource.getModel(nodeId1).then(node => {
        this.node1 = node;
      });

      let nodeParam2 = this.$route.query.node2;
      let nodeId2 = parseInt(nodeParam2);
      if (!isNaN(nodeId2)) {
        nodeResource.getModel(nodeId2).then(node => {
          this.node2 = node;
        });
      } else if (nodeParam2 != null) {
        // node2 is specified but not a valid number.
        this.errorMsg = "The node1 and node2 parameters must be valid numbers.";
        nodeResource.getNodeToCompareTo(nodeId1).then(node => {
          this.node2 = node;
        });
      } else {
        nodeResource.getNodeToCompareTo(nodeId1).then(node => {
          this.node2 = node;
        });
      }

      return true;
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
          this.answer.rating,
          this.confidence,
          uiName,
          {
            comment: this.comment,
            time_for_judgment: this.elapsedTime,
            similarities: this.similarities,
            differences: this.differences
          }
        )
        .then(() => {
          if (this.count >= this.total) {
            this.$emit("submitted");
          } else {
            this.count++;
          }

          return this.setNodes();
        });
    },
    skip() {
      return this.setNodes();
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
    setAnswer(answer) {
      this.answer = _.find(this.answers, { id: answer });
      this.differences = {};
      this.similarities = {};
    }
  }
};
</script>

<style scoped>
.section {
  padding: 20px;
}
.loading {
  text-align: center;
  padding-top: 10%;
}

.v-btn {
  border-width: 3px !important;
}
/deep/ .v-input--selection-controls {
  padding: 10px 20px;
  border: 2px solid #bbb;
  height: 50px;
  border-radius: 30px;
  width: 100%;
  margin-bottom: 15px;
}
/deep/ .v-input--selection-controls label {
  width: 100%;
}

.progress {
  text-align: right;
  font-size: 13pt;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px;
}
</style>
