<template>
  <v-container>
    <template v-if="nodeData.ancestors && nodeData.ancestors.length">
      <v-container fluid>
        <h3>Curricular context</h3>
        <v-list>
          <v-list-tile
            v-for="(nodeDatum, i) in nodeData.ancestors"
            :key="'ancestor' + nodeDatum.id"
            :style="{
              paddingLeft: `${i * 10}px`,
              marginLeft: `${i * 10}px`
            }"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                • &nbsp;{{ nodeDatum.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
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
        <v-list>
          <v-list-tile
            v-for="nodeDatum in nodeData.children"
            :key="'descendant' + nodeDatum.id"
          >
            <v-list-tile-content>
              <v-list-tile-title> • {{ nodeDatum.title }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
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
