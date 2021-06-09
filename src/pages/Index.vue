<template>
  <div class="container">
    <div class="text-main mb-2">
      {{main_text}}
    </div>
    <div class="text-sub my-5">
      {{sub_text}}
    </div>
    <div class="mt-1 mb-13" style="font-size: 10px;color: gainsboro">
      <v-chip class="ma-2" @click="goEditor">现在开始编辑</v-chip>
      <v-chip class="ma-2">查看教程</v-chip>
      <v-chip class="ma-2">个人信息修改</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data (){
    return {
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
      this.main_text = json.main_text || this.main_text;
      this.sub_text = json.sub_text || this.sub_text;
    },
    updateTextData(){
      this.setTextData(Engine.getIndexTextData());
    },
    goEditor() {
      this.$router.replace('editor');
    },
    async alert(){
      await Engine.alert(this, '1', function(){});
      console.log(1)
    }
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
</style>
