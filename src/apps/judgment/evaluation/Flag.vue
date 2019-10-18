<template>
  <CountryFlag :country="flag" />
</template>

<script>
// This component provides a basic display for a node
import CountryFlag from "vue-country-flag";
var lookup = require("country-code-lookup");

export default {
  name: "Flag",
  props: {
    country: {
      type: String
    }
  },
  components: {
    CountryFlag
  },
  computed: {
    flag() {
      return (lookup.byCountry(this.country) || lookup.byIso(this.country))
        .iso2;
    }
  }
};
</script>

<style>
.flag {
  vertical-align: bottom;
}
</style>
