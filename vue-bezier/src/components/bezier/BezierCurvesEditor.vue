<template>
  <div ref="rootRef" @contextmenu.prevent >
    <svg :width="width" :height="height" :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`" preserveAspectRatio="none"
         @mousedown="onMouseDown" @mousemove="onDownMove" @mouseup="onMouseUp" @wheel="onMouseWheel" @mouseleave="onDownLeave">
      <defs>
        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse" :y="0">
          <rect width="80" height="80" fill="url(#smallGrid)"/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
        </pattern>
      </defs>
      <rect :y="-800" :width="width" :height="1600" fill="url(#grid)"/>
      <text v-for="(text, index) in scaleText" :key="index + 'scaleText'" :x="-40" :y="text.y">{{ text.text }}</text>
      <path :d="`M 0 0 L ${width} 0`" fill="none" stroke="black" stroke-width="2"/>
      <g  v-for="(curve, index) in curves" :key="index + 'curve'">
        <CurveComponent :x-from="curve.xFrom" :x-to="curve.xTo" :y-from="curve.yFrom" :y-to="curve.yTo"
                        :curve-color="curveColor" :curve-width="curveWidth" :value="curve.bez"/>
        <HandleComponent :xFrom="curve.xFrom" :xTo="curve.xTo" :yFrom="0" :yTo="-height * zoom.y"
                         :onMousedown="(e) => onDownHandle(index, 0, e)"
                         :onMouseup="(e) => onUpHandle(index, 0 , e)"
                         :onMouseenter="() => onEnterHandle(index, 0)"
                         :onMouseleave="onLeaveHandle"
                         :eventA="onChange"
                         :xstart="0" :ystart="curve.bez.p[0]" :xval="0" :yval="curve.bez.p[0]"
                         :handleRadius="handleRadius" :handleColor="handleColor"
                         :down="curveIndex === index && downHandle === 0"
                         :hover="curveIndex === index && hoverHandle === 0"
                         :handleStroke="handleStroke" :background="background"/>
        <HandleComponent :xFrom="curve.xFrom" :xTo="curve.xTo" :yFrom="0" :yTo="-height * zoom.y"
                         :onMousedown="(e) => onDownHandle(index, 1, e)"
                         :onMouseup="(e) => onUpHandle(index, 1 , e)"
                         :onMouseenter="() => onEnterHandle(index, 1)"
                         :onMouseleave="onLeaveHandle"
                         :xstart="0" :ystart="curve.bez.p[0]" :xval="1.0 / 3" :yval="1.0 / 3 * curve.slope0 + curve.bez.p[0]"
                         :handleRadius="handleRadius" :handleColor="handleColor"
                         :down="curveIndex === index && downHandle === 1"
                         :hover="curveIndex === index && hoverHandle === 1"
                         :handleStroke="handleStroke" :background="background"/>
        <HandleComponent :xFrom="curve.xFrom" :xTo="curve.xTo" :yFrom="0" :yTo="-height * zoom.y"
                         :onMousedown="(e) => onDownHandle(index, 2, e)"
                         :onMouseup="(e) => onUpHandle(index, 2 , e)"
                         :onMouseenter="() => onEnterHandle(index, 2)"
                         :onMouseleave="onLeaveHandle"
                         :xstart="1" :ystart="curve.bez.p[3]" :xval="1 - 1.0 / 3" :yval="curve.bez.p[3] - 1.0 / 3 * curve.slope1"
                         :handleRadius="handleRadius" :handleColor="handleColor"
                         :down="curveIndex === index && downHandle === 2"
                         :hover="curveIndex === index && hoverHandle === 2"
                         :handleStroke="handleStroke" :background="background"/>
        <HandleComponent :xFrom="curve.xFrom" :xTo="curve.xTo" :yFrom="0" :yTo="-height * zoom.y"
                         :onMousedown="(e) => onDownHandle(index, 3, e)"
                         :onMouseup="(e) => onUpHandle(index, 3 , e)"
                         :onMouseenter="() => onEnterHandle(index, 3)"
                         :onMouseleave="onLeaveHandle"
                         :xstart="1" :ystart="curve.bez.p[3]" :xval="1" :yval="curve.bez.p[3]"
                         :handleRadius="handleRadius" :handleColor="handleColor"
                         :down="curveIndex === index && downHandle === 3"
                         :hover="curveIndex === index && hoverHandle === 3"
                         :handleStroke="handleStroke" :background="background"/>
      </g>
    </svg>
  </div>
</template>
<script>

import {PiecewiseBezier} from "three.quarks";
import CurveComponent from "@/views/component/bezier/CurveComponent.vue";
import HandleComponent from "@/views/component/bezier/HandleComponent.vue";


const ZOOM_POW = Math.sqrt(Math.sqrt(2));

const defaultP = {
  padding: [0, 0, 0, 0],
  handleRadius: 4,
}; //[25, 5, 25, 18]

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
    onChange: Function,
    curveWidth: {
      type: Number,
      default: 1
    },
    curveColor: {
      type: String,
      default: "#000"
    },
    handleRadius: {
      type: Number,
      default: defaultP.handleRadius
    },
    handleColor: {
      type: String,
      default: "#f00"
    },
    controlHandleColor: {
      type: String,
      default: "#a0f"
    },
    handleStroke: {
      type: Number,
      default: 1
    },
    background: {
      type: String,
      default: "#fff"
    },

  },
  components: {
    CurveComponent, HandleComponent
  },
  data(){
    return {
      viewBox: {
        x: -45,
        y: -this.height,
        w: this.width*1.1,
        h: this.height
      },
      zoom: {
        x: 1,
        y: 1
      },

      currentValue: new PiecewiseBezier(this.$props.value.functions),
      curveIndex: -1,
      hoverHandle: -1,
      downHandle: -1,
      lastMousePos: null,
      curves: [],
      scaleText: []

    }
  },
  methods: {
    updateTexts() {
      const { height } = this.$props
      this.scaleText.length = 0
      for (let i = 0; i < 10; i ++) {
        this.scaleText.push({y: -i * 80, text:Math.round(i * 80 / height / this.zoom.y * 100) / 100})
      }
    },
    updateCurves() {
      for (let i = 0; i < this.currentValue.numOfFunctions; i++) {
        const x1 = this.currentValue.getStartX(i);
        const x2 = this.currentValue.getEndX(i);
        const bez = this.currentValue.getFunction(i);
        const slope0 = bez.getSlope(0);
        const slope1 = bez.getSlope(1);
        const curve = {
          xFrom: x1 * this.width,
          xTo: x2 * this.width,
          yFrom: 0,
          yTo: -this.height * this.zoom.y,
          curveColor: this.curveColor,
          curveWidth: this.curveWidth,
          bez: bez,
          slope0,
          slope1
        }
        this.$set(this.curves, i, curve)
      }
    },

    initCurves() {
      for (let i = 0; i < this.currentValue.numOfFunctions; i++) {
        const x1 = this.currentValue.getStartX(i);
        const x2 = this.currentValue.getEndX(i);
        const bez = this.currentValue.getFunction(i);
        const slope0 = bez.getSlope(0);
        const slope1 = bez.getSlope(1);
        const curve = {
          xFrom: x1 * this.width,
          xTo: x2 * this.width,
          yFrom: 0,
          yTo: -this.height * this.zoom.y,
          curveColor: this.curveColor,
          curveWidth: this.curveWidth,
          bez: bez,
          slope0,
          slope1
        }
        this.$set(this.curves, i, curve)
      }
    },

    getViewportPositionFromEvent(e) {
      const { rootRef } = this.$refs
      if (rootRef) {
        const rect = rootRef.getBoundingClientRect();
        return [(e.clientX - rect.left), (e.clientY - rect.top)];
      } else {
        return [0, 0];
      }
    },

    getPositionFromEvent(e) {
      const { rootRef } = this.$refs

      if (rootRef) {
        const rect = rootRef.getBoundingClientRect();
        return [((e.clientX - rect.left) + this.viewBox.x) / this.viewBox.w, -((e.clientY - rect.top) + this.viewBox.y) / this.viewBox.h / this.zoom.y];
      } else {
        return [0, 0];
      }
    },

    onDownLeave(e) {
      if (this.downHandle) {
        this.onDownMove(e);
        this.downHandle = -1;
        this.hoverHandle = -1
      }
    },

    onMouseDown(e) {
      if (e.button !== 2 && this.curveIndex === -1) {
        const [x, y] = this.getViewportPositionFromEvent(e);
        this.lastMousePos = {x, y};
      }
      this.updateCurves()

      //}
    },

    onDownMove(e) {
      const { viewBox, lastMousePos, downHandle, curveIndex, currentValue } = this.$data
      const { onChange } = this.$props
      if (this.lastMousePos) {
        e.preventDefault();
        const [x, y] = this.getViewportPositionFromEvent(e);
        viewBox.x -= x - lastMousePos.x;
        viewBox.y -= y - lastMousePos.y;
        // setViewBox(viewBox);
        // setLastMousePos({x, y});
        lastMousePos.x = x
        lastMousePos.y = y

      } else if (downHandle >= 0) {
        e.preventDefault();
        const [x, y] = this.getPositionFromEvent(e);

        const curve = currentValue.getFunction(curveIndex);
        if (downHandle === 0) {
          const old = curve.p[0];
          curve.p[0] = y;
          curve.p[1] += curve.p[0] - old;
          currentValue.setStartX(curveIndex, x);
          if (curveIndex - 1 >= 0) {
            const pCurve = currentValue.getFunction(curveIndex - 1);
            pCurve.p[3] = y;
            pCurve.p[2] += curve.p[0] - old;
            currentValue.setFunction(curveIndex - 1, currentValue.getFunction(curveIndex - 1).clone());
          }
          currentValue.setFunction(curveIndex, curve.clone());
        }
        if (downHandle === 3) {
          const old = curve.p[3];
          curve.p[3] = y;
          curve.p[2] += curve.p[3] - old;
          currentValue.setEndX(curveIndex, x);
          if (curveIndex + 1 < currentValue.numOfFunctions) {
            const nCurve = currentValue.getFunction(curveIndex + 1);
            nCurve.p[0] = y;
            nCurve.p[1] += curve.p[3] - old;
            currentValue.setFunction(curveIndex + 1, currentValue.getFunction(curveIndex + 1).clone());
          }
          currentValue.setFunction(curveIndex, curve.clone());
        }
        if (downHandle === 1) {
          curve.p[1] = y;
          currentValue.setFunction(curveIndex, curve.clone());
        }
        if (downHandle === 2) {
          curve.p[2] = y;
          currentValue.setFunction(curveIndex, curve.clone());
        }
        this.currentValue = new PiecewiseBezier(currentValue.functions)
        //value[i] = inversex(x);
        //value[i + 1] = inversey(y);
        if (onChange)
          onChange(currentValue);

        this.updateCurves()

      }

    },

    onMouseUp(e) {
      const { hoverHandle, currentValue } = this.$data
      const { onChange } = this.$props

      e.preventDefault();
      if (e.button === 2 && hoverHandle === -1) {
        const [x, y] = this.getPositionFromEvent(e);

        const cIndex = currentValue.findFunction(x);
        const curve = currentValue.getFunction(cIndex);
        const endX = currentValue.getEndX(cIndex), startX = currentValue.getStartX(cIndex);
        const d = curve.getSlope(x) * (endX - x) / 3;
        const nCurve1 = curve.clone();
        const nCurve2 = curve.clone();

        nCurve1.p[1] = curve.p[0] + curve.getSlope(startX) / (endX - startX) * (x - startX) / 3;
        nCurve1.p[2] = y - curve.getSlope(x) / (endX - startX) * (x - startX) / 3;
        nCurve1.p[3] = y;
        nCurve2.p[0] = y;
        nCurve2.p[1] = y + curve.getSlope(x) / (endX - startX) * (endX - x) / 3;
        nCurve2.p[2] = curve.p[3] - curve.getSlope(endX)  / (endX - startX) * (endX - x) / 3;

        currentValue.insertFunction(x, nCurve2);
        currentValue.setFunction(cIndex, nCurve1);

        this.curveIndex = cIndex + 1
        this.hoverHandle = 0
        this.currentValue = new PiecewiseBezier(currentValue.functions)
        if (onChange) {
          onChange(currentValue);
        }
        //value.
      } else {
        this.hoverHandle = -1
        this.downHandle = -1
        this.curveIndex = -1
        this.lastMousePos = null
      }
      this.updateCurves()

    },

    onMouseWheel(e) {
      const { zoom } = this.$data
      e.preventDefault();
      this.zoom = {x: zoom.x, y: zoom.y * Math.pow(ZOOM_POW, e.deltaY / 100)}
      this.updateCurves()
      this.updateTexts()

    },


    onEnterHandle (c, h) {
      if (!this.downHandle) {
        this.hoverHandle = h
        this.curveIndex = c
      }
    },

    onUpHandle(c, h, e) {
      const { currentValue } = this.$data
      const { onChange } = this.$props

      e.preventDefault();
      e.stopPropagation();
      if (e.button === 2) {
        if (h === 0 && c > 0) {
          const nextC = currentValue.removeFunction(c);
          const curve = currentValue.getFunction(c - 1);
          curve.p[2] = nextC.p[2];
          curve.p[3] = nextC.p[3];
          currentValue.setFunction(c - 1, curve.clone());
          this.currentValue = new PiecewiseBezier(currentValue.functions)

          if (onChange) {
            //const value = new PiecewiseBezier(props.value.functions);
            onChange(currentValue);
          }
        } else if (h === 3 && c < currentValue.numOfFunctions - 1) {
          const nextC = currentValue.removeFunction(c + 1);
          const curve = currentValue.getFunction(c);
          curve.p[2] = nextC.p[2];
          curve.p[3] = nextC.p[3];
          currentValue.setFunction(c, curve.clone());
          this.currentValue = new PiecewiseBezier(currentValue.functions)
          if (onChange) {
            //const value = new PiecewiseBezier(props.value.functions);
            onChange(currentValue);
          }
        }
      } else {
        this.downHandle = -1
        this.lastMousePos = null
      }
    },

    onDownHandle(c, h, e) {
      this.updateCurves()

      e.preventDefault();
      if (e.button === 2) {
        //x
      } else {
        e.preventDefault();
        e.stopPropagation();
        this.downHandle = h
        this.hoverHandle = -1
        this.curveIndex = c
      }
    },

    onLeaveHandle() {
      if (!this.downHandle) {
        this.hoverHandle = -1
      }
      if (!this.lastMousePos) {
        this.lastMousePos = null
      }
    },

  },
  mounted() {
    this.initCurves();
    this.updateTexts()

  }
}
</script>
