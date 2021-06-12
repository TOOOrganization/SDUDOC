<template>
  <div class="container">
    <div class="text-main mb-2">
      {{main_text}}
    </div>
    <div class="text-sub my-5">
      {{sub_text}}
    </div>
    <div class="button-group mt-1 mb-13">
      <v-chip class="ma-2" @click="goEditor">{{texts.go_editor}}</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data (){
    return {
      texts: {},
      main_text: null,
      sub_text: null
    }
  },
  mounted() {
    if(window.Engine){
      this.updateTextData();
    }
  },
  methods: {
    setTextData(json) {
      this.texts     = json.texts     === undefined ? this.texts     : json.texts;
      this.main_text = json.main_text === undefined ? this.main_text : json.main_text;
      this.sub_text  = json.sub_text  === undefined ? this.sub_text  : json.sub_text;
    },
    updateTextData(){
      this.setTextData(Engine.getIndexTextData());
    },
    goEditor() {
      this.$router.replace('editor');
    },
    getText(id){
      return this.texts[id];
    },
  }
}
</script>

<style scoped>
.container {
  top:50%;
  left:50%;
  position: absolute;
  -webkit-transform: translateY(-50%)  translateX(-50%);
  transform: translateY(-50%)  translateX(-50%);
  z-index:100;
}

.text-main{
  font-size: 25px;
}

.text-sub{
  color: darkgrey;
}

.button-group{
  font-size: 10px;
  color: gainsboro;
}
</style>
