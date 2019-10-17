<template>
  <v-layout row wrap>
    <v-flex
      @click="setSelected(node)"
      xs12
      class="node-item"
      :class="{ selected: selected && selected.id === node.id }"
      v-if="!root"
    >
      <v-layout row wrap>
        <v-flex xs9>
          {{ node.title }}
        </v-flex>
        <v-spacer />
        <v-flex xs1>
          <v-progress-circular
            indeterminate
            size="15"
            width="2"
            v-if="loading"
          />
        </v-flex>
        <v-flex xs1 v-if="node.numchild" @click.stop="toggle">
          <v-icon>{{ expanded ? "expand_more" : "expand_less" }}</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex
      xs12
      class="subtree"
      v-if="children"
      v-show="expanded"
      transition="slide-y-transition"
    >
      <CurriculumTree
        v-for="child in children"
        :key="child.id"
        :node="child"
        :selected="selected"
        @selected="setSelected"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { nodeResource } from "@/client";

export default {
  name: "CurriculumTree",
  data: () => {
    return {
      loading: false,
      children: null,
      expanded: false
    };
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    root: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      required: false
    }
  },
  mounted() {
    if (this.root) {
      this.toggle();
    }
  },
  methods: {
    toggle() {
      if (this.node.numchild) {
        this.expanded = !this.expanded;
        if (!this.children) {
          nodeResource.getChildren(this.node.id).then(nodes => {
            this.children = nodes;
          });
        }
      }
    },
    setSelected(node) {
      this.$emit("selected", node);
    }
  }
};
</script>

<style scoped>
.subtree {
  padding-left: 10px;
}
.node-item {
  padding: 5px;
  padding-left: 10px;
  cursor: pointer;
  border-left: 3px solid transparent;
}
.selected {
  border-color: gray;
}
</style>
