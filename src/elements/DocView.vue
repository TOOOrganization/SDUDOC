<template>
  <v-card class="container center">
    <div class="box row">
      <div class="main">
        <div class="left">

          <div class="tool_title">
            <v-img max-height="80" max-width="80" :src="require('@/assets/sdu.png')"/>
            <div class="mt-2 mr-1">
              SDUDOC<br/>山东大学数字古籍上传工具
            </div>
          </div>

          <div class="mt-2 mb-4">
            <v-chip label outlined class="tool_label">文档工具</v-chip>
            <v-btn-toggle class="tool_group">
              <v-tooltip bottom v-for="(tool, index) in tools['document']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>

          <div class="mt-3 mb-4">
            <v-chip label outlined class="tool_label">历史记录</v-chip>
            <v-btn-toggle class="tool_group">
              <v-tooltip bottom v-for="(tool, index) in tools['history']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>

          <div class="my-4">
            <v-chip label outlined class="tool_label">插件工具</v-chip>
            <v-btn-toggle mandatory class="tool_group">
              <v-tooltip bottom v-for="(tool, index) in tools['plugin']" :key="index">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab tile v-bind="attrs" v-on="on" @click=tool.callback(tool.id)>
                    <v-icon>{{tool.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{tool.tooltip}}</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>

          <div class="my-2">
            <v-btn class="tool_button" color="blue lighten-2" dark @click="upLoadDoc">
              上传
            </v-btn>
          </div>

          <v-dialog v-model="alert_dialog" max-width="400">
            <v-card>
              <v-card-title class="headline">
                <v-icon class="mr-2">mdi-alert-circle-outline</v-icon> 提示
              </v-card-title>
              <v-card-text>{{pop_title}}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="pop_callback">确认</v-btn>
                <v-btn color="red darken-1" text @click="alert_dialog = false">取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="prompt_dialog" max-width="400">
            <v-card>
              <v-card-title class="headline">
                <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon> {{pop_title}}
              </v-card-title>
              <v-container class="my-1" v-for="(prompt, index) in prompt_tooltip" :key="index">
                <v-text-field required :label="prompt_tooltip[index]" class="mx-6" v-model="prompt_text[index]"></v-text-field>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="pop_callback">确认</v-btn>
                <v-btn color="red darken-1" text @click="prompt_dialog = false">取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog scrollable v-model="course_dialog" max-width="1000">

            <template v-slot:activator="{ on, attrs }">
              <v-btn class="tool_button" color="red lighten-2" dark v-bind="attrs" v-on="on">
                使用教程
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

        <div id="doc_view" ref="doc_view" class="middle">
          <canvas id="doc_canvas" ref="doc_canvas" class="doc" @contextmenu.prevent/>
        </div>

        <v-card tile outlined class="right" style="border: none">
          <div class="right-page" v-if="tab === 0">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">用户工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['user']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
          </div>

          <div class="right-page" v-if="tab === 1">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">云功能工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['cloud']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
          </div>

          <div class="right-page" v-if="tab === 2">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">页面工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['page']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
            <div id="page_view" ref="page_view" class="mt-4 page_list">
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

          <div class="right-page" v-if="tab === 3">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">检查工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['check']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
            <div id="check_view" ref="check_view" class="mt-4 check_list">
              <input v-model="check_id" class="check_input"/>
              <textarea v-model="check_info" class="check_textarea"/>
            </div>
          </div>

          <div class="right-page" v-if="tab === 4">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">设置工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['option']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
          </div>

          <div class="right-page" v-if="tab === 5">
            <div class="mt-5 mb-4">
              <v-chip label outlined class="tool_label">实验性工具</v-chip>
              <v-btn-toggle class="tool_group">
                <v-tooltip bottom v-for="(tool, index) in tools['dev']" :key="index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab tile plain v-bind="attrs" v-on="on" @click=tool.callback>
                      <v-icon>{{tool.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{tool.tooltip}}</span>
                </v-tooltip>
              </v-btn-toggle>
              <div class="mt-5" style="width: 80%;margin-left: 10%">
                实验性工具还在开发中，具有不稳定性，请谨慎使用。
              </div>
            </div>
          </div>

          <v-navigation-drawer :mini-variant.sync="tab_mini" floating absolute permanent
                               right class="navigator" style="background-color: antiquewhite">
            <v-list nav dense>
              <v-list-item v-for="(item, i) in tabs" :key="i" link @click="tab = !tab_mini ? changeTab(i) : tab"
                           @click.stop="tab_mini = !tab_mini">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </div>
      <div class="todo">
        {{ todo_text }}
      </div>
    </div>
  </v-card>
</template>

<script>
import {EngineLoader_Old} from "../engine/EngineLoader_Old";
import axios from 'axios'
import {Base64} from 'js-base64'
import crypto from "crypto"

export default {
  name: "DocView",
  data () {
    return {
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

      alert_dialog: false,
      prompt_dialog: false,
      prompt_text: null,
      prompt_tooltip: null,
      pop_title: null,
      pop_callback: function(){ this.alert_dialog = false },
      course_dialog: false,

      tools: {
        'document': [],
        'history': [],
        'plugin': [],
        'page': [],
        'check': [],
        'user': [],
        'cloud': [],
        'option': [],
        'dev': []
      },

      page_list: [],
      current_page: 0,

      check_id: null,
      check_info: null,

      current_plugin: 0,
      todo_text: ''
    }
  },
  async mounted() {
    await this.loadEngine();
    this.resizePageView();
    this.listenResizeHandler();
  },
  methods: {
    async loadEngine() {
      await EngineLoader_Old.load(this.$refs.doc_canvas, this.$refs.doc_view, axios, Base64, this);
      this.tools = ToolManager.getAllToolList({
        'document': Tool.Type.DOCUMENT,
        'history': Tool.Type.HISTORY,
        'plugin': Tool.Type.PLUGIN,
        'page': Tool.Type.PAGE,
        'check': Tool.Type.CHECK,
        'user': Tool.Type.USER,
        'dev': Tool.Type.DEV
      });
    },
    listenResizeHandler() {
      window.addEventListener('resize', function() {
        this.resizePageView();
      }.bind(this));
    },
    resizePageView() {
      let size_page = Math.ceil(this.tools['page'].length / 5);
      if(this.$refs.page_view)
        this.$refs.page_view.style.height = (window.innerHeight - 25 - 140 - size_page * 32) + "px";

      let size_check = Math.ceil(this.tools['check'].length / 5);
      if(this.$refs.check_view)
        this.$refs.check_view.style.height = (window.innerHeight - 25 - 140 - size_check * 32) + "px";
    },
    changeTab(index){
      if(this.tabs[index].login)
        return 0;
      return index;
    },
    changePage(index){
      DocumentManager.setCurrentPage(index);
    },
    async upLoadDoc(){
      await DocumentManager.upLoadDoc();
      Engine.alert('上传成功', function(){
        Engine.owner.alert_dialog = false;
      });
    },
    login(){
      let md5 = crypto.createHash("md5");
      md5.update("password");
      axios({
        method: 'post',
        url: 'http://211.87.232.197:8081/sdudoc/img/save_by_base64',
        data: {
          username: null,
          password: md5.digest('hex')
        },
        headers: {'content-type': "application/json"},
        responseType: 'json'
      }).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      });
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
  display: flex;
}

.box {
  padding: 10px;
  width: 100%;
  display: flex;
}

.main {
  width: 100%;
  height: calc(100% - 21px);
  background: white;
  display: flex;
}

.todo {
  width: 100%;
  height: 21px;
  padding: 1px 10px;
  font-size: 12px;
  text-align: left;
  background: ghostwhite;
  border-top: solid 1px gainsboro;
}

.left {
  float: left;
  width: 200px;
  height: 100%;
  background: antiquewhite;
}
.tool_title{
  padding: 6% 5% 0 5%;
  display: flex;
  font-size: 14px;
}
.tool_group{
  width: 80%;
  margin: 0 10%;
  display: flex;
  flex-wrap: wrap;
}
.tool_label{
  width: 80%;
  padding-top: 2px;
  justify-content: center;
}
.tool_button{
  width: 80%;
}

.middle{
  height: 100%;
  width: calc(100% - 400px - 56px);
}
.doc {
  width: 100%;
  height: 100%;
}

.right{
  width: 256px;
  height: 100%;
  border: none;
  background: antiquewhite;
}

.navigator{
  background: antiquewhite;
  border-left: solid 1px #c9c9c9;
}

.right-page{
  float: left;
  width: 200px;
  height: 100%;
  background: antiquewhite;
}

.user_list{
  width: 80%;
  margin: 0 10%;
  background: white;
  overflow-y: scroll;
}

.page_list{
  width: 80%;
  margin: 0 10%;
  background: white;
  overflow-y: scroll;
}
.page_list::-webkit-scrollbar {
  display:none
}

.check_list{
  width: 80%;
  margin: 0 10%;
  background: white;
}
.check_input{
  width: 100%;
  padding: 10px;
  font-size: 8px;
  background: white;
  border: none;
}
.check_textarea{
  width: 100%;
  height: calc(100% - 38px);
  padding: 10px;
  font-size: 8px;
  background: white;
  border: none;
  resize: none;
}
</style>
