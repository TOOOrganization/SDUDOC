<template>
  <canvas id="doc_view" ref="doc_view" @contextmenu.prevent>
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
      await EngineLoader.load(this.$refs.doc_view, this.$el);
      //await Graphics.setImage(this.image_src);
    }
  }
}
</script>

<style scoped>

</style>
