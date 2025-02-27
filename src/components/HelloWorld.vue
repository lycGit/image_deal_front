<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <vueCropper
        ref="cropper"
        v-bind="option"
        @realTime="realTime"
        @imgLoad="imgLoad"
        @imgLoadError="imgLoad"
        @cropMoving="cropMoving"
        style="width: 400px; height: 400px;" 
      ></vueCropper>
  </div>
</template>

<script>
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
export default {
  name: 'HelloWorld',
  components: {
    VueCropper,
  },
  props: {
    msg: String
  },
  data: function() {
    return {
      model: false,
      modelSrc: "",
      crap: false,
      previews: {
        url: ''
      },
      lists: [
        {
        	img: 'https://fengyuanchen.github.io/cropper/images/picture.jpg'
        },
        {
          img: "https://avatars2.githubusercontent.com/u/15681693?s=460&v=4"
        },
        {
          img: "https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_2f07496a52314c3e024eaafaba73dd35.jpeg"
        },
        {
          img: "https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/mosaic-legacy_2e7480001384708367aa1.jpeg"
        },
        {
          img: "https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-i-0813_80f34c63344d44c292dacf4608c7b258.jpeg"
        },
        {
          img: "https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_48b61ee1b6b34fe945246cd1ccc4243d.jpeg"
        },
      ],
      option: {
        img: "https://fengyuanchen.github.io/cropper/images/picture.jpg",
        size: 1,
        full: false,
        infoTrue: true,
        outputType: "png",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 150,
        centerBox: true,
        high: false,
        cropData: {},
				enlarge: 1,
        mode: 'contain',
        maxImgSize: 3000,
        limitMinSize: [50, 50],
        fixed: false,
        fixedNumber: [2, 1],
        fillColor: '#000',
      },
      downImg: "#",
      previewStyle1: {},
      previewStyle2: {},
      previewStyle3: {},
      previewStyle4: {},
			code0: '',
    };
  },
  methods: {
    // 实时预览函数
    realTime(data) {
      var previews = data;
      var h = 0.5;
      var w = 0.2;

      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: h
      };

      this.previewStyle2 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: w
      };

      this.previewStyle3 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: (100 / previews.w)
      };

      this.previewStyle4 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: (100 / previews.h)        
      };

			this.previews = data;
    },
    imgLoad(msg) {
      console.log(msg);
    },
    cropMoving(data) {
      this.option.cropData = data;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
