<template>
  <div ref="main_box" class="main-box flex fill-height row">

    <div class="plugin-bar">
      <div class="my-4">
        <v-chip label outlined class="plugin-label mb-2">工具</v-chip>
        <v-btn-toggle v-if="tools['plugin']" mandatory dense tile borderless class="plugin-group">
          <v-tooltip bottom v-for="(tool, index) in tools['plugin']" :key="index">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small fab tile v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
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
          <v-btn-toggle v-if="tools['history']" dense class="top-tool-group">
            <v-tooltip bottom v-for="(tool, index) in tools['history']" :key="index">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                       color="white" class="top-tool-button">
                  <v-icon>{{tool.icon}}</v-icon>
                </v-btn>
              </template>
              <span>{{tool.tooltip}}</span>
            </v-tooltip>
          </v-btn-toggle>
          <v-btn-toggle v-if="tools['history']" dense class="top-tool-group">
            <v-tooltip bottom v-for="(tool, index) in tools['document']" :key="index">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                       color="white" class="top-tool-button">
                  <v-icon>{{tool.icon}}</v-icon>
                </v-btn>
              </template>
              <span>{{tool.tooltip}}</span>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </div>
      <div id="editor_view" ref="editor_view" class="editor-view">
        <div id="editor_pixi" ref="editor_pixi" class="editor-pixi" @contextmenu.prevent></div>
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
      <div class="right-page" v-if="tab === 0">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">用户工具</v-chip>
            <v-btn-toggle v-if="tools['user']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['user']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
          <div class="mb-5" v-if="!is_login">
            <div class="mt-2">您需要登录才能使用</div>
            <v-text-field label="用户名" v-model="user_username" :rules="user_username_rules" outlined dense
                          hide-details="auto" class="my-4" style="font-size: 14px"></v-text-field>
            <v-text-field label="密码" v-model="user_password" :rules="user_password_rules" outlined dense
                          :append-icon="user_password_show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="user_password_show ? 'text' : 'password'"
                          @click:append="user_password_show = !user_password_show"
                          hide-details="auto" style="font-size: 14px"></v-text-field>
            <v-btn outlined class="mt-4" style="width: 100%" @click="login">登录</v-btn>
          </div>
          <div class="mb-5" v-if="is_login">
            <v-btn outlined class="mt-4" style="width: 100%" @click="logout">登出</v-btn>
          </div>
        </div>
      </div>

      <div class="right-page" v-if="tab === 1">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">云功能工具</v-chip>
            <v-btn-toggle v-if="tools['cloud']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['cloud']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
        </div>
      </div>

      <div class="right-page" v-if="tab === 2">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">页面工具</v-chip>
            <v-btn-toggle v-if="tools['page']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['page']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
          <div class="mb-5 page-list">
            <v-list nav dense>
              <v-list-item-group mandatory color="primary" v-model="current_page">
                <v-list-item v-for="(page, index) in page_list" :key="index" class="pa-2" @click="changePage(index)">
                  <v-img max-height="60" max-width="60" :src="page.src" class="mr-4"/>
                  <v-list-item-content>
                    {{page.id}}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
      </div>

      <div class="right-page" v-if="tab === 3">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">检查工具</v-chip>
            <v-btn-toggle v-if="tools['check']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['check']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
          <div class="mb-5 check-list">
            <input v-model="check_id" class="check-input"/>
            <textarea v-model="check_info" class="check-textarea"/>
          </div>
        </div>
      </div>

      <div class="right-page" v-if="tab === 4">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">设置工具</v-chip>
            <v-btn-toggle v-if="tools['option']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['option']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
        </div>
      </div>

      <div class="right-page" v-if="tab === 5">
        <div class="mx-5 right-content">
          <div class="mt-5 mb-4">
            <v-chip label outlined class="right-tool-label">实验性工具</v-chip>
            <v-btn-toggle v-if="tools['dev']" mandatory dense tile borderless class="right-tool-group">
              <v-tooltip bottom v-for="(tool, index) in tools['dev']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click="clickToolFilter(tool.on_click)"
                         color="white" class="right-tool-button">
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
          <div>
            实验性工具还在开发中，具有不稳定性，可能对文档造成不可逆的损坏。请在使用时先保存备份，谨慎处理。
          </div>
        </div>
      </div>
    </div>

    <v-navigation-drawer :mini-variant.sync="tab_mini" permanent right class="navigator">
      <v-list nav dense>
        <v-list-item v-for="(item, i) in tabs" :key="i" link @click="tab = changeTabFilter(i); right_box = true"
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
    <!--
    <v-btn class="expansion-button-tab mb-2" outlined fab bottom small color="grey"
           @click="tab_mini = !tab_mini">
      <v-icon>{{ tab_mini ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
    </v-btn>
    -->
    <v-btn class="expansion-button-right mb-2" outlined fab bottom small color="grey"
           @click="right_box = !right_box">
      <v-icon>{{ right_box ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
    </v-btn>

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import {EleResize} from "../js/resize";

export default {
  name: "Editor",
  data(){
    return{
      local_storage: localStorage,
      is_login: false,

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

      pixi: null,
      pixi_app: null,
      pixi_context: null,

      user_username: null,
      user_username_rules: [
        value => !!value || '请填写用户名',
      ],

      user_password: null,
      user_password_show: false,
      user_password_rules: [
        value => !!value || '请填写密码',
        value => (value && value.length >= 3) || '密码最少需要8个字符。',
      ],

      page_list: null,
      current_page: 0,

      check_id: null,
      check_info: null
    }
  },
  mounted () {
    if(window.Engine){
      this.initializePixiApplication();
      Engine.initializeEditor();
      this.updateToolData();
      this.checkLogin();
    }
    this.setupResizeEvent();
  },
  methods: {
    initializePixiApplication(){
      this.pixi_app = new PIXI.Application({
        antialias: true,
        backgroundColor: 0xffffff,
        powerPreference: 'high-performance'
      });
      this.$refs.editor_pixi.appendChild(this.pixi_app.view);
      this.pixi_app.resizeTo = this.pixi_app.view;
      this.pixi_app.view.style.width = "100%";
      this.pixi_app.view.style.height = "100%";
      this.pixi_app.renderer.autoResize = true;
      this.pixi_app.resize();

      this.pixi_context = new PIXI.Graphics();
      this.pixi_app.stage.addChild(this.pixi_context);

      this.pixi = PIXI;
    },
    resizePixiApp(){
      this.pixi_app.resize();
      Graphics.update();
    },
    clickToolFilter(callback){
      if(!localStorage.getItem(HttpRequest.TOKEN_KEY)) {
        Engine.noticeHint('need-login', true);
        this.right_box = true;
        this.tab = 0;
        return;
      }
      callback();
    },
    changeTabFilter(index){
      if(this.tabs[index].login && !localStorage.getItem(HttpRequest.TOKEN_KEY)) {
        Engine.noticeHint('need-login', true);
        return 0;
      }
      return index;
    },
    changePage(index){
      DocumentManager.setCurrentPage(index);
    },
    setToolData(json) {
      this.tools        = json.tools        === undefined ? this.tools       : json.tools;
    },
    setPageData(json) {
      this.page_list    = json.page_list    === undefined ? this.page_list   : json.page_list;
      this.current_page = json.current_page === undefined ? this.current_page: json.current_page;
    },
    setCheckData(json) {
      this.check_id     = json.check_id     === undefined ? this.check_id    : json.check_id;
      this.check_info   = json.check_info   === undefined ? this.check_info  : json.check_info;
    },
    updateToolData() {
      this.setToolData(Engine.getEditorToolData());
    },
    updatePageData() {
      this.setPageData(Engine.getEditorPageData());
    },
    updateCheckData() {
      this.setCheckData(Engine.getEditorCheckData());
    },
    checkLogin(){
      this.is_login = localStorage.getItem(HttpRequest.TOKEN_KEY);
    },
    async login() {
      if(this.user_username && this.user_password){
        await HttpRequest.Login(this.user_username, this.user_password);
      }
      this.checkLogin();
    },
    logout() {
      Engine.noticeSuccess(200);
      localStorage.removeItem(HttpRequest.TOKEN_KEY);
      this.checkLogin();
    },
    setupResizeEvent: function (){
      let that = this;
      EleResize.on(this.$refs.editor_view, this.resizePixiApp.bind(this));

      let box = this.$refs.main_box;
      let resize_left = this.$refs.resize_box_left;
      let resize_right = this.$refs.resize_box_right;
      resize_left.first_x = null;
      resize_right.first_x = null;
      resize_left.onmousedown = function (e) {
        if(!that.left_box) {
          that.left_box = true;
          return;
        }
        let left = that.$refs.left_box;
        resize_left.first_x = left.offsetWidth - e.clientX;
        box.onmousemove = function (event) {
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
.left-page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}

.resize-box{
  background-color: #f5f5f5;
  width: 10px;
  height: 100%;
  cursor: col-resize;
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
.top-tool-group{
  height: 80%;
  margin: 6px;
  position: relative;
}
.top-tool-button{
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

.right-box{
  background-color: #f5f5f5;
  width: 250px;
  height: 100%;
}
.right-page{
  width: 100%;
  height: 100%;
}
.right-content{
  height: 100%;
  display: flex;
  flex-flow: column;
}
.right-tool-group{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.right-tool-label{
  width: 100%;
  padding-top: 2px;
  justify-content: center;
}
.right-tool-button{
  border-right: 1px #f5f5f5 solid !important;
  border-bottom: 1px #f5f5f5 solid !important;
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

.page-list{
  width: 100%;
  background: white;
  flex-grow: 1;
  overflow-y: scroll;
}
.page-list::-webkit-scrollbar {
  display:none
}

.check-list{
  width: 100%;
  background: white;
  flex-grow: 1;
}
.check-input{
  width: 100%;
  padding: 10px;
  font-size: 8px;
  background: white;
  border: none;
  outline-color: #5D9BFF;
}
.check-textarea{
  width: 100%;
  height: calc(100% - 38px);
  padding: 10px;
  margin-top : 1px;
  font-size: 8px;
  background: white;
  border: none;
  resize: none;
  outline-color: #5D9BFF;
}
</style>
