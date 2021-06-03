<template>
  <div ref="main_box" class="main-box flex fill-height row">
    <div class="plugin-bar">
      <div class="my-4">
        <v-chip label outlined class="plugin-label mb-2">工具</v-chip>
        <v-btn-toggle v-if="tools['plugin']" mandatory dense tile borderless class="plugin-group">
          <v-tooltip bottom v-for="(tool, index) in tools['plugin']" :key="index">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small fab tile v-bind="attrs" v-on="on" @click="tool.callback(tool.id)"
                     color="white" class="plugin-button">
                <v-icon>{{tool.icon}}</v-icon>
              </v-btn>
            </template>
            <span>{{tool.tooltip}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </div>
    </div>
    <div v-if="left_box" ref="left_box" class="left-box">

    </div>
    <div ref="resize_box_left" class="resize-box">
      <div class="resize-space"></div>
      <div class="resize-graph row">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="content-box">
      <div class="tool-bar">
        <div class="mx-4">
          <v-btn-toggle v-if="tools['tool']" dense class="tool-group">
            <v-tooltip bottom v-for="(tool, index) in tools['tool']" :key="index">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="tool.callback"
                       color="white" class="tool-button">
                  <v-icon>{{tool.icon}}</v-icon>
                </v-btn>
              </template>
              <span>{{tool.tooltip}}</span>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </div>
      <div id="editor_view" ref="editor_view" class="editor-view">
        <div id="editor_pixi" ref="editor_pixi" class="editor-pixi"></div>
        <!--<canvas id="editor_canvas" ref="editor_canvas" class="editor-canvas" @contextmenu.prevent/>-->
      </div>
    </div>
    <div ref="resize_box_right" class="resize-box">
      <div class="resize-space"></div>
      <div class="resize-graph row">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div v-if="right_box" ref="right_box" class="right-box">

    </div>
    <v-navigation-drawer :mini-variant.sync="tab_mini" permanent right class="navigator">
      <v-list nav dense>
        <v-list-item v-for="(item, i) in tabs" :key="i" link @click="tab = i; right_box = true"
                     @click.stop="tab_mini = true">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-btn class="expansion-button-left ma-2" outlined fab bottom color="grey"
           @click="left_box = !left_box">
      <v-icon>{{ left_box ? 'mdi-chevron-left' : 'mdi-chevron-right'}}</v-icon>
    </v-btn>
    <v-btn class="expansion-button-tab mb-2" outlined fab bottom small color="grey"
           @click="tab_mini = !tab_mini">
      <v-icon>{{ tab_mini ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
    </v-btn>
    <v-btn class="expansion-button-right mb-2" outlined fab bottom small color="grey"
           @click="right_box = !right_box">
      <v-icon>{{ right_box ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: "Editor",
  data(){
    return{
      left_box: true,
      right_box: true,

      tab: 2,
      tabs:[
        {icon: 'mdi-account', text: '用户菜单', login: false},
        {icon: 'mdi-cloud-outline', text: '云功能菜单', login: true},
        {icon: 'mdi-book-open-page-variant', text: '页面菜单', login: false},
        {icon: 'mdi-checkbox-marked-outline', text: '检查菜单', login: false},
        {icon: 'mdi-cogs', text: '设置菜单', login: true},
        {icon: 'mdi-ladybug', text: '实验性功能菜单', login: false}
      ],
      tab_mini: true,

      tools: {},

      app: null,
      context: null
    }
  },
  mounted () {
    this.setupResizeEvent();
    if(window.Engine){
      this.initializePixiApplication();
      this.updateToolData();
    }
  },
  methods: {
    initializePixiApplication(){
      this.app = new PIXI.Application({backgroundColor: 0xffffff})
      this.$refs.editor_pixi.appendChild(this.app.view);
      this.app.resizeTo = this.app.view;
      this.app.view.style.width = "100%";
      this.app.view.style.height = "100%";
      this.app.renderer.autoResize = true;
      this.app.resize();

      this.context = new PIXI.Graphics();
      this.app.stage.addChild(this.context);

      Engine.updateGraphicsData();
    },
    setToolData(json) {
      this.tools = json.tools || this.tools;
    },
    updateToolData() {
      this.setToolData(Engine.getEditorToolData());
    },
    setupResizeEvent: function (){
      let box = this.$refs.main_box;
      let resize_left = this.$refs.resize_box_left;
      let resize_right = this.$refs.resize_box_right;
      resize_left.first_x = null;
      resize_right.first_x = null;
      let that = this;
      resize_left.onmousedown = function (e) {
        if(!that.left_box) {
          that.left_box = true;
          return;
        }
        let left = that.$refs.left_box;
        resize_left.first_x = left.offsetWidth - e.clientX;
        box.onmousemove = function (event) {
          that.app.resize()
          if(resize_left.first_x !== null){
            let width = event.clientX + resize_left.first_x;
            width = Math.max(100, Math.min(width, 400));
            left.style.width = String(width) + "px";
          }
        }
      };
      resize_right.onmousedown = function (e) {
        if(!that.right_box) {
          that.right_box = true;
          return;
        }
        let right = that.$refs.right_box;
        resize_right.first_x = right.offsetWidth + e.clientX;
        box.onmousemove = function (event) {
          if(resize_right.first_x !== null){
            let width = resize_right.first_x - event.clientX;
            width = Math.max(100, Math.min(width, 400));
            right.style.width = String(width) + "px";
          }
        }
      };
      box.onmouseup = function (event) {
        resize_left.first_x = null;
        resize_right.first_x = null;
        box.onmousemove = null;
      };
      box.onmouseleave = function (event) {
        resize_left.first_x = null;
        resize_right.first_x = null;
        box.onmousemove = null;
      };
    },
  }
}
</script>

<style scoped>
.main-box{
  width: 100%;
  margin: 0;
  flex-wrap: nowrap;
  flex-basis: content-box;
  position: relative;
}

.plugin-bar{
  background-color: #f5f5f5;
  width: 81px;
  height: 100%;
  border-right: 1px lightgrey solid;
  flex: none;
}

.plugin-group{
  width: 80%;
  margin: 0 10%;
  display: flex;
  flex-wrap: wrap;
}
.plugin-label{
  width: 80%;
  padding-top: 2px;
  justify-content: center;
}
.plugin-button{
  border-right: 1px #f5f5f5 solid !important;
  border-bottom: 1px #f5f5f5 solid !important;
}

.left-box{
  background-color: #f5f5f5;
  width: 250px;
  height: 100%;
}

.resize-box{
  background-color: #f5f5f5;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
  border-left: 1px lightgrey solid;
  border-right: 1px lightgrey solid;
}
.resize-box:hover{
  background-color: #e9e9e9;
}
.resize-space{
  height: calc((100% - 15px) / 2);
}
.resize-graph{
  margin: 0;
  height: 15px;
}
.resize-graph > div {
  background-color: lightgrey;
  width: 0.5px;
  height: 100%;
  margin: 0 1px;
}

.content-box{
  background-color: white;
  height: 100%;
  flex: 1;
}

.tool-bar{
  background-color: #f5f5f5;
  width: 100%;
  height: 46px;
  border-bottom: 1px lightgrey solid;
}
.tool-group{
  height: 80%;
  margin: 6px;
  position: relative;
}
.tool-button{
  border-right: 1px #f5f5f5 solid !important;
}

.editor-view{
  background-color: white;
  width: 100%;
  height: calc(100% - 46px);
}
.editor-pixi{
  width: 100%;
  height: 100%;
  z-index: -1;
}
.editor-canvas{
  width: 100%;
  height: 100%;
}

.right-box{
  background-color: #f5f5f5;
  width: 250px;
  height: 100%;
}

.navigator{
  background-color: #f5f5f5 !important;
  height: 100%;
}

.expansion-button-left{
  position: absolute;
  left: 5px;
  bottom: 2px;
}
.expansion-button-tab{
  position: absolute;
  right: 8px;
  bottom: 52px;
}
.expansion-button-right{
  position: absolute;
  right: 8px;
  bottom: 2px;
}
</style>
