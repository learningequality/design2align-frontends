<template>
  <div>
    <div v-if="loading">
      <v-progress-circular indeterminate size="15" width="2" />
      &nbsp;Loading curricula...
    </div>

    <v-autocomplete
      v-else
      solo
      :items="curricula"
      v-model="curriculum"
      label="Curriculum"
      item-value="id"
      :item-text="getText"
    >
      <template v-slot:selection="data">
        <div>
          <Flag :country="data.item.country" />
          {{ data.item.country }}: {{ data.item.title }}
        </div>
      </template>
      <template v-slot:item="data">
        <div>
          <Flag :country="data.item.country" />
          {{ data.item.country }}: {{ data.item.title }}
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import _ from "lodash";
import Flag from "./Flag";
import { documentResource } from "@/client";

export default {
  name: "CurriculumFilter",
  props: {
    value: {
      type: Object,
      required: false
    }
  },
  components: {
    Flag
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
