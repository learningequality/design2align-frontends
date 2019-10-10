<template>
  <div>
    <div>
      <template v-if="nodeData.ancestors && nodeData.ancestors.length">
        <h3>Ancestors</h3>
        <span
          v-for="nodeDatum in nodeData.ancestors"
          :key="'descendant' + nodeDatum.id"
        >
          {{ nodeDatum.title }}
        </span>
        <hr />
      </template>
      <h3>Title</h3>
      <h2>{{ nodeData.title }}</h2>
      <template v-if="nodeData.children && nodeData.children.length">
        <hr />
        <h3>Descendants</h3>
        <span
          v-for="nodeDatum in nodeData.children"
          :key="'descendant' + nodeDatum.id"
        >
          {{ nodeDatum.title }}
        </span>
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
