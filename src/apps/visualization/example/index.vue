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
        <v-select
          v-if="modelNames"
          v-model="selectedModel"
          :items="modelNames"
          :rules="[v => !!v || 'Model is required']"
          label="Model"
          required
          @change="setRecommendedNodes"
        ></v-select>

        <v-layout row wrap>
          <v-flex v-if="recommendedNodes">
            <RecommendedNode
              v-for="(node, index) in recommendedNodes"
              v-bind:node="node"
              v-bind:relevanceScore="relevanceScores[index]"
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
import {
  modelResource,
  nodeResource,
  recommendedNodesResource
} from "@/client";

export default {
  name: "Visualize",
  data() {
    return {
      currentCurriculum: null,
      currentRoot: null,
      loading: false,
      selectedNode: null,
      recommendedNodes: null,
      relevanceScores: null,
      selectedModel: "tf_idf_sample_negs_no_training",
      modelNames: null
    };
  },
  components: {
    CurriculumFilter,
    CurriculumTree,
    RecommendedNode
  },
  created() {
    this.getModelNames();
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
      this.recommendedNodes = null;
      recommendedNodesResource
        .getRecommendedNodes(this.selectedNode.id, this.selectedModel)
        .then(response => {
          this.recommendedNodes = response.results;
          this.relevanceScores = response.relevances;
        });
    },
    getModelNames() {
      modelResource.getModels().then(models => {
        this.modelNames = [];
        models.forEach(model => {
          this.modelNames.push(model.name);
        });
      });
    }
  }
};
</script>
