<template>
  <canvas id="doc_view" ref="doc_view">
  </canvas>
</template>

<script>
import {Engine} from "../assets/SDUDOC_Engine";
export default {
  name: "DocView",
  props: {
    image_src:{
      type: String,
      default: null
    },
  },
  data () {
    return {
      engine: null,
      canvas: null
    }
  },
  mounted() {
    this.loadEngine();
    this.refreshCanvas();
    window.addEventListener('resize', () => {
      this.refreshCanvas();
    });
  },
  methods: {
    loadEngine() {
      this.engine = new Engine();
      this.canvas = this.$refs.doc_view;
      this.engine.setCanvas(this.canvas);
      this.engine.setImage(this.image_src);
    },
    refreshCanvas(){
      this.canvas.width = this.$el.clientWidth;
      this.canvas.height = this.$el.clientHeight;
      this.engine.refresh();
    }
  }
}
</script>

<style scoped>

</style>
