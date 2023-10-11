<template>
  <g>
    <line
        :stroke="handleColor"
        :stroke-width="stroke"
        :x1="cxs"
        :y1="cys"
        :x2="sx"
        :y2="sy" />
    <circle
        :cx="cx"
        :cy="cy"
        :r="handleRadius"
        :stroke="handleColor"
        :stroke-width="strokeWidth"
        :fill="fill"
        @mouseenter="this.onMouseenter"
        @mouseleave="this.onMouseleave"
        @mousedown="this.onMousedown"
        @mouseup="this.onMouseup" />
  </g>

</template>
<script>
import TransformComponent from "./TransformComponent.vue";

export default {
  extends: TransformComponent,
  props: {
    xstart: Number,
    ystart: Number,
    handleRadius: Number,
    handleColor: String,
    hover: Boolean,
    down: Boolean,
    background: String,
    handleStroke: Number,
    xval: Number,
    yval: Number,
    eventA: Function,
    onMouseenter: {
      type: Function,
      default: () => {}
    },
    onMouseleave: {
      type: Function,
      default: () => {}
    },
    onMousedown: {
      type: Function,
      default: () => {}
    },
    onMouseup: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    sx() {
      return this.x(this.xstart);
    },
    sy() {
      return this.y(this.ystart);
    },
    cx() {
      return this.x(this.xval);
    },
    cy() {
      return this.y(this.yval);
    },
    cxs() {
      const a = Math.atan2(this.cy - this.sy, this.cx - this.sx);
      return this.cx - this.handleRadius * Math.cos(a);
    },
    cys() {
      const a = Math.atan2(this.cy - this.sy, this.cx - this.sx);
      return this.cy - this.handleRadius * Math.sin(a);
    },
    stroke() {
      return this.hover || this.down ? 1 + this.handleStroke : this.handleStroke;
    },
    strokeWidth() {
      return this.down ? 2 * this.handleStroke : this.handleStroke;
    },
    fill() {
      return this.down ? this.background : this.handleColor;
    }
  },
}
</script>

