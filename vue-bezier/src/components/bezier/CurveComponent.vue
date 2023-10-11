<template>
  <path
      fill="none"
      :stroke="curveColor"
      :stroke-width="curveWidth"
      :d="curve"/>
</template>

<script>

import TransformComponent from "@/views/component/bezier/TransformComponent.vue";

export default {
  name: 'CurveComponent',
  extends: TransformComponent,
  props: {
    curveColor: String,
    curveWidth: Number,
    value: Object
  },
  computed: {
    segments() {
      return Math.floor((this.x(1) - this.x(0)) / 5);
    },
    curve() {
      let curve = `M${this.x(0)},${this.y(this.value.genValue(0))} `;
      if (this.segments > 0) {
        for (let i = 1 / this.segments; i <= 1; i += 1 / this.segments) {
          curve += `L${this.x(i)},${this.y(this.value.genValue(i))} `;
        }
      }
      curve += `L${this.x(1)},${this.y(this.value.genValue(1))} `;
      return curve;
    }
  }
}
</script>