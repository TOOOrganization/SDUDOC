<template>
  <div class="container">
    <div class="loader-inner ball-beat">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="text-label mt-5 mb-2">
      {{label_text}}
    </div>
    <div class="text-loading mt-1 mb-15">
      {{process_text}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  mounted() {

  },
  data() {
    return{
      label_text: null,
      process_text: null
    }
  },
  methods: {
    setLabelData(json) {
      this.label_text = json.label_text || this.label_text;
    },
    setProcessData(json) {
      this.process_text = json.process_text || this.process_text;
    },
    updateLabelData(){
      this.setLabelData(Engine.getLoadingLabelData());
    },
    updateProcessData(){
      this.setProcessData(Engine.getLoadingProcessData());
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

@-webkit-keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.ball-beat > div {
  background-color: #5D9BFF;
  width: 15px;
  height: 15px;
  border-radius: 100% !important;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
  -webkit-animation: ball-beat 0.7s 0s infinite linear;
  animation: ball-beat 0.7s 0s infinite linear;
}

.ball-beat > div:nth-child(2n-1) {
  -webkit-animation-delay: 0.35s !important;
  animation-delay: 0.35s !important;
}

@-webkit-keyframes text-label {
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

@keyframes text-label {
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.text-label{
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: text-label 3s 0s infinite linear;
  animation: text-label 3s 0s infinite linear;
}

.text-loading{
  font-size: 12px;
  color:darkgrey;
}
</style>
