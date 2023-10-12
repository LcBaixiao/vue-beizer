import BezierCurvesViewer from "@/components/bezier/BezierCurvesViewer.vue";
import BezierCurvesDialog from "@/components/BezierCurvesDialog.vue";

const install = (Vue) => {
    Vue.component(BezierCurvesViewer.name, BezierCurvesViewer)
    Vue.component(BezierCurvesDialog.name, BezierCurvesDialog)
}

export default {
    install
}