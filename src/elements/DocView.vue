<template>
  <canvas id="doc_view" ref="doc_view">
  </canvas>
</template>

<script>
import {EngineLoader} from "../engine/EngineLoader";

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
  },
  methods: {
    async loadEngine() {

      this.engine = await EngineLoader.load();
      this.canvas = this.$refs.doc_view;
      this.engine.setCanvas(this.canvas);

      this.refreshCanvas();

      await this.engine.setImage(this.image_src);

      let a = new Dot2D();
      let b = DocumentManager.objectToXml(a);
      let c = DocumentManager.xmlToObject(b);
      console.log(a);
      console.log(b);
      console.log(c);
      window.addEventListener('resize', () => {
        this.refreshCanvas();
      });
    },
    refreshCanvas(){
      this.canvas.width = this.$el.clientWidth;
      this.canvas.height = this.$el.clientHeight;
      this.engine.refresh();
    },
    s(str) {
      let arr = str.split(".");
      let fn = (window || this);
      for (let i = 0, len = arr.length; i < len; i++) {
        fn = fn[arr[i]];
      }
      console.log(fn)
      if (typeof fn !== "function") {
        throw new Error("function not found");
      }
      return  fn;
    }

  }
}
</script>

<style scoped>

</style>
