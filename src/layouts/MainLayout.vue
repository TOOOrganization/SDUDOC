<template>
  <v-app>
    <v-dialog v-model="alert_dialog" max-width="400" @click:outside="pop_callback_cancel">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-alert-circle-outline</v-icon> {{alert_title}}
        </v-card-title>
        <v-card-text>{{pop_title}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="pop_callback_ok">{{pop_confirm_text}}</v-btn>
          <v-btn color="red darken-1" text @click="pop_callback_cancel">{{pop_cancel_text}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="prompt_dialog" max-width="400" @click:outside="pop_callback_cancel">
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon> {{pop_title}}
        </v-card-title>
        <v-container class="my-1" v-for="(prompt, index) in prompt_tooltip" :key="index">
          <v-text-field required :label="prompt_tooltip[index]" class="mx-6" v-model="prompt_text[index]"></v-text-field>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="pop_callback_ok">{{pop_confirm_text}}</v-btn>
          <v-btn color="red darken-1" text @click="pop_callback_cancel">{{pop_cancel_text}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-app-bar app flat outlined class="app-bar">
      <v-img max-height="56" max-width="58" :src="require('@/assets/sdu.png')"/>
      <v-toolbar-title class="mx-2" style="font-size: 18px">
        {{title}}
      </v-toolbar-title>
      <div class="version-container col">
        <v-chip color="white" class="version-chip mx-1 float-left" x-small>
          Application Version {{version}}
        </v-chip>
        <v-chip color="white" class="version-chip mx-1 mt-2 float-left" x-small v-if="engine_version">
          Engine Version {{engine_version}}
        </v-chip>
      </div>
      <v-spacer></v-spacer>
      <div class="mx-3" style="width: 220px">
        <v-select v-model="current_language" :items="language_list.name" prepend-icon="mdi-earth"
                  style="font-size: 12px" menu-props="auto"
                  :label="language_selector" outlined dense hide-details @change="onLanguageChange">
        </v-select>
      </div>
      <v-avatar size="36" class="ml-2">
        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
      </v-avatar>
    </v-app-bar>

    <v-main>
      <v-container class="router-container pa-0 fill-height" fluid>
        <transition name="router_view_fade" mode="out-in">
          <router-view ref="router_view"></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-footer app outlined class="footer-bar">
      Todo：{{todo_text ? todo_text : todo_default}}
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
import {Base64} from "js-base64";
import {EngineLoader} from "../engine/EngineLoader";

export default {
  name: "MainLayout",
  data () {
    return {
      version: '0.3.7 Build-1',
      title: 'SDUDOC - 山东大学数字化古籍编辑工具',

      engine_version: null,

      language_selector: null,
      language_list:[],
      current_language: null,

      todo_default: null,
      todo_text: null,

      alert_dialog: false,
      prompt_dialog: false,

      alert_title: null,
      pop_confirm_text: null,
      pop_cancel_text: null,

      pop_title: null,
      pop_callback_ok: function(){},
      pop_callback_cancel: function(){},
      prompt_text: null,
      prompt_tooltip: null,
    }
  },
  async mounted() {
    if(!window.Engine){
      if(this.$route.path !== '/loading') {
        await this.$router.replace('loading');
        await this.loadEngine();
        await this.$router.replace('index');
      }else{
        await this.loadEngine();
        await this.$router.replace('index');
      }
    }else{
      if(this.$route.path === '/loading') {
        await this.$router.replace('index');
      }
    }
    this.updateInitializeData();
    this.updateLanguageData();
    this.updateElementData();
  },
  methods: {
    async loadEngine() {
      let packages = { axios: axios, base64: Base64}
      await EngineLoader.load(this, packages);
    },
    getRouterComponent(){
      return this.$refs.router_view;
    },
    setInitializeData(json) {
      this.engine_version    = json.engine_version    === undefined ? this.engine_version    : json.engine_version;
    },
    setLanguageData(json){
      this.language_selector = json.language_selector === undefined ? this.language_selector : json.language_selector;
      this.language_list     = json.language_list     === undefined ? this.language_list     : json.language_list;
      this.current_language  = json.current_language  === undefined ? this.current_language  :
        this.language_list.name[this.language_list.id.indexOf(json.current_language)];
    },
    setElementData(json){
      this.todo_default      = json.todo_default      === undefined ? this.todo_default      : json.todo_default;
      this.todo_text         = json.todo_text         === undefined ? this.todo_text         : json.todo_text;

      this.alert_title       = json.alert_title       === undefined ? this.alert_title       : json.alert_title;
      this.pop_confirm_text  = json.confirm_text      === undefined ? this.pop_confirm_text  : json.confirm_text;
      this.pop_cancel_text   = json.cancel_text       === undefined ? this.pop_cancel_text   : json.cancel_text;
    },
    updateInitializeData(){
      this.setInitializeData(Engine.getAppInitializeData());
    },
    updateLanguageData(){
      this.setLanguageData(Engine.getAppLanguageData());
    },
    updateElementData(){
      this.setElementData(Engine.getAppElementData());
    },
    alert(json){
      this.pop_title           = json.title           === undefined ? this.pop_title           : json.title;
      this.pop_callback_ok     = json.callback_ok     === undefined ? this.pop_callback_ok     : json.callback_ok;
      this.pop_callback_cancel = json.callback_cancel === undefined ? this.pop_callback_cancel : json.callback_cancel;
      this.alert_dialog = true;
    },
    prompt(json){
      this.pop_title           = json.title           === undefined ? this.pop_title           : json.title;
      this.pop_callback_ok     = json.callback_ok     === undefined ? this.pop_callback_ok     : json.callback_ok;
      this.pop_callback_cancel = json.callback_cancel === undefined ? this.pop_callback_cancel : json.callback_cancel;
      this.prompt_tooltip      = json.tooltip         === undefined ? this.prompt_tooltip      : json.tooltip;
      this.prompt_text         = json.default_text    === undefined ? this.prompt_text         : json.default_text;
      this.prompt_dialog = true;
    },
    setTodo(text){
      this.todo_text = text;
    },
    onLanguageChange(){
      let index = this.language_list.name.indexOf(this.current_language);
      let id = this.language_list.id[index];
      Engine.setCurrentLanguage(id);
    },
  }

}
</script>

<style scoped>
.app-bar{
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
}

.version-container{
  max-width: 300px;
}
.version-chip{
  font-size: 8px;
  color: darkgrey;
}

.router-container{
  position: absolute;
  width: 100%;
  height: 100%;
}

.footer-bar{
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
  font-size: 10pt;
}

.router_view_fade-enter { opacity: 0; }
.router_view_fade-enter-to { opacity: 1; }
.router_view_fade-leave{ opacity: 1; }
.router_view_fade-leave-to{ opacity: 0; }
.router_view_fade-leave-active { transition: opacity 0.5s; }
.router_view_fade-enter-active { transition: opacity 1s; }
</style>
