<template>
  <v-container>
    <v-navigation-drawer permanent absolute width="400px" app clipped>
      <v-container>
        <CurriculumFilter v-model="currentCurriculum" @input="loadTree" />
        <CurriculumTree
          v-if="currentRoot"
          :node="currentRoot"
          root
          :key="currentRoot.id"
          @selected="selectNode"
          :selected="selectedNode"
        />
        <div v-else-if="loading">
          <v-progress-circular indeterminate size="15" width="2" />
          &nbsp; Loading...
        </div>
        <div v-else>
          Please select a curriculum
        </div>
      </v-container>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        {{ selectedNode }}
        <div ref="chart"></div>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import vegaEmbed from "vega-embed";
import CurriculumFilter from "../../judgment/evaluation/CurriculumFilter";
import CurriculumTree from "./CurriculumTree";
import { nodeResource } from "@/client";

export default {
  name: "Visualize",
  mounted() {
    this.drawChart();
  },
  data() {
    return {
      currentCurriculum: null,
      currentRoot: null,
      loading: false,
      selectedNode: null
    };
  },
  components: {
    CurriculumFilter,
    CurriculumTree
  },
  methods: {
    loadTree() {
      this.loading = true;
      nodeResource.getDocumentNode(this.currentCurriculum.id).then(data => {
        this.currentRoot = data;
        this.loading = false;
      });
    },
    selectNode(node) {
      this.selectedNode = node;
    },
    drawChart() {
      vegaEmbed(this.$refs.chart, {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: {
          url:
            "https://alignmentapp.learningequality.org/files/exports/data/latest/humanjudgments.csv"
        },
        mark: "bar",
        encoding: {
          x: {
            bin: true,
            field: "rating",
            type: "quantitative"
          },
          y: {
            aggregate: "count",
            type: "quantitative"
          }
        }
      });
    }
  }
};
</script>
