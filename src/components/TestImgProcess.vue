<template>
  <DocView/>
</template>

<script>
import DocView from "@/elements/DocView";
export default {
  name: 'TestImgProcess',
  components: {DocView},
  data () {
    return {
      course_dialog: false,
      list: [
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
        {name:"移动工具", icon:"mdi-drag-variant", click: this.a.bind(this)},
      ]
    }
  },
  methods: {
    a(){
      let input = document.createElement('input');
      input.setAttribute('accept', 'image/*');
      input.setAttribute('id','_ef');
      input.setAttribute('type','file');
      input.setAttribute("style",'visibility:hidden; display:none');
      input.addEventListener('change', (event)=> {
        let reader = new FileReader();
        reader.onload = function(event){
          console.log(event.target.result);
          Graphics.setImage(event.target.result)
        }
        reader.readAsDataURL(event.target.files[0]);
      });
      document.body.appendChild(input);
      input.click();
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

.left {
  float: left;
  width: 200px;
  height: 100%;
  background: antiquewhite;
}
.tool_title{
  padding: 6% 5% 0% 5%;
  display: flex;
  font-size: 14px;
}
.tool_list{
  width: 80%;
  margin: 0% 10%;
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
  width: calc(100% - 400px);
}
.doc {
  width: 100%;
  height: 100%;
}

.right{
  float: right;
  width: 200px;
  height: 100%;
  background: antiquewhite;
}
.page_list{
  width: 80%;
  margin: 0% 10%;
  height: calc(100% - 120px);
  background: white;
}
</style>
