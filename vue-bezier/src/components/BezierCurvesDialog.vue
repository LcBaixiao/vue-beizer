<template>
  <el-dialog title="编辑贝塞尔曲线" class="bezierDialog"  :width="shabi_style_vw_loader_wcnm" :visible.sync="bezierCurveState" @close="handleClose">
    <BezierCurvesEditor class="bezierEditor" v-if="bezierCurve != null" :value="bezierCurve" :onChange="handleChangeBezier" :width="800" :height="600" />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {mapMutations, mapState} from "vuex";
import BezierCurvesEditor from "./bezier/BezierCurvesEditor.vue";

export default {
  components: {
    BezierCurvesEditor
  },
  props: {

  },
  computed: {
    ...mapState('particleSystem',['bezierCurve']),
  },
  data() {
    return {
      shabi_style_vw_loader_wcnm: '',
      bezierCurveState: false
    }

  },
  watch: {
    bezierCurve(newVal) {
      this.bezierCurveState = newVal ? true : false
    }
  },
  methods: {
    ...mapMutations('particleSystem', [
      'setEditableBezier',
      'onChangeBezierCurve'
    ]),
    handleChangeBezier(bezierCurves) {
      this.onChangeBezierCurve(bezierCurves)
    },
    handleClose() {
      this.setEditableBezier(null)
    }
  },
  mounted() {
    this.shabi_style_vw_loader_wcnm = '860px'
  }
}

</script>
<style>
.bezierEditor {
  display: flex;
  justify-content: center;
}

</style>