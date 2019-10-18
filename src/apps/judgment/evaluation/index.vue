<template>
  <v-content>
    <v-container v-if="oneComparison">
      <EvaluationWindow @submitted="handleSubmit" :total="1" />
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline" primary-title color="#edf4f8">
            Thank you for your feedback!
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" depressed @click="reload">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

    <v-window v-model="step" v-else>
      <v-window-item :value="0">
        <v-layout align-center justify-center fill-height row wrap>
          <div style="text-align: center;">
            <h1>Source standard to compare items to</h1>
            <br />
            <br />
            <CurriculumFilter v-model="curriculum" />
            <br />
            <v-btn round depressed large dark color="#18BAFF" @click="step++"
              >Start</v-btn
            >
          </div>
        </v-layout>
      </v-window-item>
      <v-window-item :value="1">
        <EvaluationWindow
          @submitted="handleSubmit"
          :total="Number(count)"
          :curriculum="curriculum && curriculum.id"
          ref="eval"
        />
      </v-window-item>
      <v-window-item
        :value="2"
        style="background-color: #1A2039; color: white;"
      >
        <v-layout align-center justify-center fill-height row wrap>
          <div style="text-align: center;">
            <div>
              <img
                style="width: 150px; margin-right: 20px; vertical-align: bottom;"
                src="./robot.png"
              />
              <div
                style="font-size: 20pt; font-family: Courier; display: inline-block; width: 200px; text-align: center;"
              >
                Thanks for teaching me!
              </div>
            </div>
            <br /><br /><br />

            <h1>Way to go!</h1>
            <br />
            <h2>
              You completed <b>{{ count }}</b> more evaluations successfully.
            </h2>
            <br />
            <v-btn
              round
              depressed
              large
              dark
              color="#18BAFF"
              @click="backToStart"
              >Keep going</v-btn
            >
            <br /><br /><br /><br /><br /><br />
            <v-divider dark />
            <div v-if="loadingLeaderboard">
              <br />
              <p style="color: white;">Loading leaderboard...</p>
              <v-progress-linear indeterminate />
            </div>
            <v-container fluid v-else-if="!isNaN(currentStanding)">
              <v-layout row>
                <v-flex xs4>
                  <h2>
                    You are <b>#{{ currentStanding + 1 }}</b> on the
                    leaderboard!
                  </h2>
                  <p style="color: white;">
                    You've made
                    {{ currentUser.number_of_judgments }} evaluations so far
                  </p>
                  <v-btn
                    flat
                    href="https://alignmentapp.learningequality.org/api/leaderboard"
                    target="_blank"
                    >See leaderboard</v-btn
                  >
                </v-flex>
                <v-spacer />
                <v-flex class="rank">
                  <div class="number you">{{ currentStanding + 1 }}</div>
                  <p>
                    <b>{{ currentUser.username }}</b>
                  </p>
                </v-flex>
                <v-spacer />
                <v-flex
                  v-for="(person, i) in nextFive"
                  class="rank"
                  :key="person.username"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div dark v-on="on">
                        <div class="number">
                          {{ currentStanding - i }}
                        </div>
                        <p style="color: white;">{{ person.username }}</p>
                      </div>
                    </template>
                    <span>{{ person.number_of_judgments }} evaluations</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-layout>
      </v-window-item>
    </v-window>
  </v-content>
</template>

<script>
import _ from "lodash";
import EvaluationWindow from "./EvaluationWindow";
import CurriculumFilter from "./CurriculumFilter";
import { leaderboardResource } from "@/client";
import sessionData from "@/session";

export default {
  name: "Judgment",
  components: {
    EvaluationWindow,
    CurriculumFilter
  },
  data() {
    return {
      count: 2,
      step: 0,
      curriculum: null,
      loadingLeaderboard: false,
      leaderboard: [],
      oneComparison: false,
      dialog: false
    };
  },
  mounted() {
    this.oneComparison = !!this.$route.query.node2;
    this.getLeaderboard();
  },
  computed: {
    currentUser() {
      if (this.leaderboard.length)
        return this.leaderboard[this.currentStanding];
      return { username: "", number_of_judgments: 0 };
    },
    currentStanding() {
      let names = _.map(this.leaderboard, l => l.username);
      let index = _.indexOf(names, sessionData.username);
      return index;
    },
    nextFive() {
      return _.reverse(
        this.leaderboard.slice(
          Math.max(this.currentStanding - 5, 0),
          this.currentStanding
        )
      );
    }
  },
  methods: {
    reload() {
      window.location = "/#/judgment/evaluation";
      window.location.reload();
    },
    backToStart() {
      this.step = 1;
      this.$refs.eval.reset();
      this.$confetti.stop();
    },
    handleSubmit() {
      if (this.oneComparison) {
        this.dialog = true;
      } else {
        this.step++;
        this.$confetti.start();
        this.getLeaderboard();
        setTimeout(() => {
          this.$confetti.stop();
        }, 2000);
      }
    },
    getLeaderboard() {
      this.loadingLeaderboard = true;
      leaderboardResource.getLeaderboard().then(results => {
        this.loadingLeaderboard = false;
        this.leaderboard = results;
      });
    }
  }
};
</script>

<style scoped>
.v-content {
  background-color: #edf4f8;
}

.v-window {
  height: 100%;
}

/deep/ .v-window__container,
.v-window-item {
  height: 100%;
}

.count {
  font-size: 20pt;
  max-width: 200px;
  margin: 0 auto;
}
.count /deep/ input {
  text-align: center;
}

b {
  color: #18baff;
}

.rank {
  text-align: center;
  cursor: pointer;
  max-width: 100px;
  word-break: break-word;
}

.number {
  background-color: #3852c0;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  padding: 7px;
  margin: 0 auto;
  color: white;
  font-size: 18pt;
  margin-bottom: 10px;
}

.number.you {
  background-color: #18baff;
}
</style>
