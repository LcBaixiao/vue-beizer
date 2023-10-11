<template>
  <div></div>
</template>

<script>
export default {
  props: {
    xFrom: Number,
    yFrom: Number,
    xTo: Number,
    yTo: Number
  },

  methods: {
    interp(a, b, x) {
      return a * (1 - x) + b * x;
    }
  },

  computed: {
    x() {
      return (value) => this.interp(this.xFrom, this.xTo, value);
    },
    y() {
      return (value) => this.interp(this.yFrom, this.yTo, value);
    }
  },
}
</script>
