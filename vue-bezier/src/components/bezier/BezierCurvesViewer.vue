<template>
  <div ref="rootRef" style="display: flex; align-items: center; margin: 1px;" @contextmenu.prevent>
    <svg :width="width" :height="height" :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`" style="background-color: #dddddd;">
      <g v-for="(curve, index) in curves" :key="index">
        <CurveComponent :x-from="curve.xFrom" :x-to="curve.xTo" :y-from="curve.yFrom" :y-to="curve.yTo"
                        :curve-color="curveColor" :curve-width="curveWidth" :value="curve.bez"/>
      </g>
    </svg>
    <button @click="handleClick">Edit</button>
  </div>
</template>

<script>

import CurveComponent from "./CurveComponent.vue";
import {mapMutations, mapState} from "vuex";

export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    curveWidth: {
      type: Number,
      default: 1
    },
    curveColor: {
      type: String,
      default: "#000"
    }
  },
  computed: {
    ...mapState('particleSystem',['bezierCurve'])
  },
  watch: {
    bezierCurve() {
      this.updateCurves()
    }

  },
  data() {
    return {
      viewBox: {
        x: 0,
        y: -this.height,
        w: this.width,
        h: this.height
      },
      curves: []
    }
  },
  methods: {
    ...mapMutations('particleSystem', [
      'setEditableBezier',
    ]),
    handleClick() {
      this.setEditableBezier(this.value)
    },
    updateCurves() {
      for (let i = 0; i < this.value.numOfFunctions; i++) {
        const x1 = this.value.getStartX(i);
        const x2 = this.value.getEndX(i);
        // const bez = new Bezier(0.2, 1, 1, 1)
        const bez = this.value.getFunction(i);
        const curve = {
          xFrom: x1 * this.width,
          xTo: x2 * this.width,
          yFrom: 0,
          yTo: -this.height,
          curveColor: this.curveColor,
          curveWidth: this.curveWidth,
          bez: bez
        }
        this.$set(this.curves, i, curve)
        this.$set(this.curves[i], this.curves[i].bez, curve.bez)
      }
    }
  },
  mounted() {
    this.updateCurves()

  },
  components: {
    CurveComponent
  }
}
</script>
