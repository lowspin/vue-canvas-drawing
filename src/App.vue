<template>
  <h3>Annotate</h3>
  <Button @click="annotateImage('img1')" class="p-button-text">image1</Button>
  <Button @click="annotateImage('img2')" class="p-button-text">image2</Button>

  <div v-if="bgImage" class="show-canvas-container">
    <Button icon="pi pi-times" iconPos="right" class="p-button-rounded p-button-text p-button-lg closebtn" @click="closeCanvas" />
    <MainCanvas :bgImgData="bgImage" @result="processAnnotations" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MainCanvas from './components/MainCanvas.vue';
import { imgData1, imgData2 } from './assets/imageData'

export default defineComponent({
  name: 'App',
  components: {
    MainCanvas
  },
  setup() {

    // state
    const bgImage = ref()

    // choose background image
    const annotateImage = (img: string) => {
      bgImage.value = (img === "img1") ? imgData1 : imgData2;
    }

    // process annotation result - not used
    const processAnnotations = (result: string) => {
      console.log("Annotation result", result)
    }

    // close canvas overlay
    const closeCanvas = () => {
      bgImage.value = null
    }

    return { bgImage, annotateImage, processAnnotations, closeCanvas }

  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.show-canvas-container {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0, 0.9); /* Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
}

.show-canvas-container .closebtn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 2;
}

</style>
