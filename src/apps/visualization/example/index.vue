<template>
  <div>
    <p>Histogram</p>
    <div ref="chart"></div>
  </div>
</template>

<script>
import vegaEmbed from "vega-embed";

export default {
  name: "Visualize",
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      vegaEmbed(this.$refs.chart, {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        data: {
          url:
            "http://alignmentapp.learningequality.org/files/exports/data/latest/humanjudgments.csv"
        },
        mark: "bar",
        encoding: {
          x: {
            bin: true,
            field: "rating",
            type: "quantitative"
          },
          y: {
            aggregate: "count",
            type: "quantitative"
          }
        }
      });
    }
  }
};
</script>
