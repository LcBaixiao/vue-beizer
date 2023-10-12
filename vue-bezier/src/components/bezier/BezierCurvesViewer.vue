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
import { PiecewiseBezier } from "three.quarks";

export default {
  name: "BezierCurvesViewer",
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
      default: () => new PiecewiseBezier()
    },
    curveWidth: {
      type: Number,
      default: 1
    },
    curveColor: {
      type: String,
      default: "#000"
    },
    onChange: {
      type: Function,
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
    getPureBezierArr(obj) {
      let result = []
      let startXArr = []
      if(obj && obj instanceof PiecewiseBezier){
        obj.functions.forEach((arr, index) => {
          let p = arr[0].p
          const startX = arr[1]
          const endX = obj.functions[index + 1] ? obj.functions[index + 1][1] : 1
          let xGap = (endX - startX) / 3
          let points = [
            {
              x: startX,
              y: p[0]
            },
            {
              x: startX + xGap,
              y: p[1]
            },
            {
              x: endX - xGap,
              y: p[2]
            },
            {
              x: endX,
              y: p[3]
            }
          ]
          result.push(points)
          startXArr.push(arr[1])
        })
      }
      return result
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

      this.$props.onChange(this.value, this.getPureBezierArr(this.value))

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
