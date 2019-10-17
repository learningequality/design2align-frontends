<template>
  <div>
    <div v-if="loading">
      <v-progress-circular indeterminate size="15" width="2" />
      &nbsp;Loading curricula...
    </div>
    <v-autocomplete
      v-else
      :items="curricula"
      v-model="curriculum"
      label="Curriculum"
      :item-text="getText"
      item-value="id"
    />
  </div>
</template>

<script>
import _ from "lodash";
import { documentResource } from "@/client";

export default {
  name: "CurriculumFilter",
  props: {
    value: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      curricula: [],
      loading: false
    };
  },
  mounted() {
    this.loading = true;
    documentResource.getDocuments().then(data => {
      this.loading = false;
      this.curricula = _.sortBy(data, ["country", "title"]);
    });
  },
  computed: {
    curriculum: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", _.find(this.curricula, { id: value }));
      }
    }
  },
  methods: {
    getText(item) {
      return `${item.country}: ${item.title}`;
    }
  }
};
</script>
