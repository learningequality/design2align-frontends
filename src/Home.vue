<template>
  <v-content class="home">
    <div v-if="judgmentRoutes.length">
      <h1>Judgment Apps</h1>
      <router-link
        v-for="route in judgmentRoutes"
        :key="route.name"
        :to="route"
      >
        {{ displayName("judgment", route.name) }}
      </router-link>
    </div>
    <p v-else>There are no current Judgement Apps - why not make one?</p>
    <div v-if="visualizationRoutes.length">
      <h1>Visualization Apps</h1>
      <router-link
        v-for="route in visualizationRoutes"
        :key="route.name"
        :to="route"
      >
        {{ displayName("visualization", route.name) }}
      </router-link>
    </div>
    <p v-else>There are no current Visualization Apps - why not make one?</p>
    <p>
      To make your own app, copy the <code>__template__</code> folder to a new
      folder inside the relevant subfolder (<code>judgement</code>, or
      <code>visualization</code>)
    </p>
  </v-content>
</template>

<script>
import { judgmentRoutes, visualizationRoutes } from "./router";

export default {
  name: "Home",
  computed: {
    judgmentRoutes() {
      return judgmentRoutes;
    },
    visualizationRoutes() {
      return visualizationRoutes;
    }
  },
  methods: {
    displayName(root, name) {
      name = name.replace(`${root}-`, "");
      return (
        name.slice(0, 1).toUpperCase() + name.replace("-index", "").slice(1)
      );
    }
  }
};
</script>
