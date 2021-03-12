<template>
  <v-card class="container center">
    <div class="left">
      <div>
        <v-img max-height="80" max-width="80" :src="require('@/assets/sdu.png')"/>
      </div>

      <v-btn-toggle style="left:0px">
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

      <v-dialog scrollable v-model="course_dialog" max-width="1000">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
            教程！！！
          </v-btn>
        </template>

        <v-card>
          <v-toolbar color="white">
            <v-icon class="ml-2 mr-5">mdi-book-open-page-variant</v-icon>
            <v-toolbar-title>山东大学文档上传系统使用教程</v-toolbar-title>
            <v-spacer/>
            <v-btn icon large class="mr-1" @click="course_dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text ><!--style="height: 300px;"-->
            <v-radio-group column>
              <v-radio label="Bahamas, The" value="bahamas"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="course_dialog = false">
              了解
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>

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
      course_dialog: false
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
