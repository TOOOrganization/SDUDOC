<template>
  <v-card class="container center">
    <div class="left">
      <div>
        <v-img max-height="80" max-width="80" :src="require('@/assets/sdu.png')"/>
      </div>
      <div>
        移动工具
      </div>
      <v-btn-toggle v-model="toggle_exclusive" style="left:0px">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn x-small fab tile v-bind="attrs" v-on="on"><v-icon>mdi-drag-variant</v-icon></v-btn>
          </template>
          <span>移动工具</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn x-small fab tile v-bind="attrs" v-on="on"><v-icon>mdi-circle-medium</v-icon></v-btn>
          </template>
          <span>点工具</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn x-small fab tile v-bind="attrs" v-on="on"><v-icon>mdi-ray-start-end</v-icon></v-btn>
          </template>
          <span>切线工具</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn x-small fab tile v-bind="attrs" v-on="on"><v-icon>mdi-scissors-cutting</v-icon></v-btn>
          </template>
          <span>剪开</span>
        </v-tooltip>

      </v-btn-toggle>

    </div>
    <div class="right">
      <DocView class="doc" :image_src='require("@/assets/1.jpg")'/>
    </div>
  </v-card>
</template>

<script>
import DocView from "@/elements/DocView";
export default {
  name: 'TestImgProcess',
  components: {DocView},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  height: calc(100% - 40px);
}
.left {
  float: left;
  width: 200px;
  height: 100%;
  background: antiquewhite;
}
.right {
  height: 100%;
  margin-left: 200px;
}
.doc {
  width: 100%;
  height: 100%;
}
</style>
