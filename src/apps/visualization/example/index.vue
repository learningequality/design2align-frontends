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
      <v-container align-center fluid grid-list-md>
        <v-layout row wrap>
          <v-flex>
            <RecommendedNode
              v-for="node in recommendedNodes"
              v-bind:node="node"
              :key="node.id"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import CurriculumFilter from "../../judgment/evaluation/CurriculumFilter";
import CurriculumTree from "./CurriculumTree";
import RecommendedNode from "./RecommendedNode";
import { nodeResource } from "@/client";
import { recommendedNodesResource } from "@/client";

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
      selectedNode: null,
      recommendedNodes: null
    };
  },
  components: {
    CurriculumFilter,
    CurriculumTree,
    RecommendedNode
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
      this.setRecommendedNodes();
    },
    setRecommendedNodes() {
      recommendedNodesResource
        .getRecommendedNodes(this.selectedNode.id)
        .then(nodes => {
          this.recommendedNodes = nodes;
        });
    }
  }
};
</script>
