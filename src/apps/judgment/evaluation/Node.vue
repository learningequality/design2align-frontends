<template>
  <v-container>
    <template v-if="nodeData.ancestors && nodeData.ancestors.length">
      <v-container fluid>
        <h3>Curricular context</h3>
        <ul>
          <li
            v-for="(nodeDatum, i) in nodeData.ancestors"
            :key="'descendant' + nodeDatum.id"
            :style="{
              paddingLeft: `${i * 5}px`,
              marginLeft: `${i * 5}px`
            }"
          >
            {{ nodeDatum.title }}
          </li>
        </ul>
      </v-container>
      <v-divider />
    </template>
    <v-container fluid>
      <h3>Title</h3>
      <h2>{{ nodeData.title }}</h2>
    </v-container>
    <template v-if="nodeData.children && nodeData.children.length">
      <v-divider />
      <v-container fluid>
        <h3>Contents</h3>
        <ul>
          <li
            v-for="nodeDatum in nodeData.children"
            :key="'descendant' + nodeDatum.id"
          >
            {{ nodeDatum.title }}
          </li>
        </ul>
      </v-container>
    </template>
  </v-container>
</template>

<script>
// This component provides a basic display for a node

export default {
  name: "Node",
  props: {
    nodeData: {
      type: Object,
      required: true
    }
  }
};
</script>
