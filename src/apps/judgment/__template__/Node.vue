<template>
  <div>
    <div>
      <template v-if="nodeData.ancestors && nodeData.ancestors.length">
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
        <hr />
      </template>
      <h3>Title</h3>
      <h2>{{ nodeData.title }}</h2>
      <template v-if="nodeData.children && nodeData.children.length">
        <hr />
        <h3>Contents</h3>
        <ul>
          <li
            v-for="nodeDatum in nodeData.children"
            :key="'descendant' + nodeDatum.id"
          >
            {{ nodeDatum.title }}
          </li>
        </ul>
      </template>
    </div>
  </div>
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
