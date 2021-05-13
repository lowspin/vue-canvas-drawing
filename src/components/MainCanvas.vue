<template>

    <div class="batch-annotation-container">
        <!-- source and overlay canvas -->
        <canvas ref="overlayCanvas" id="overlayCanvas" ></canvas>
        <canvas ref="submissionCanvas" id="submissionCanvas" ></canvas>

        <!-- Edit Buttons -->
        <div class="pens-buttons-container">
            <Button icon="pi pi-minus-circle" class="p-button-rounded p-button-secondary p-button-lg" :class="{ 'p-button-outlined': penColor=='eraser' }" @click="switchPenColor('eraser')" />
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-lg p-button-danger" :class="{ 'p-button-outlined': penColor=='red' }" @click="switchPenColor('red')" />
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-lg p-button-success" :class="{ 'p-button-outlined': penColor=='green' }" @click="switchPenColor('green')" />
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-lg p-button-info" :class="{ 'p-button-outlined': penColor=='blue' }" @click="switchPenColor('blue')" />
            <div class="pen-width-control-container">
                <!-- <h5>Pen Width: {{penWidth}}</h5> -->
                <!-- <Slider v-model="penWidth" :step="2" :min="2" :max="6" /> -->
                <Button class="p-button-sm" :class="{ 'p-button-outlined': penWidth!='2' }" @click="switchPenWidth(2)" >thin</Button>
                <Button class="p-button-sm" :class="{ 'p-button-outlined': penWidth!='4' }" @click="switchPenWidth(4)">medium</Button>
                <Button class="p-button-sm" :class="{ 'p-button-outlined': penWidth!='6' }" @click="switchPenWidth(6)">thick</Button>
            </div>
        </div>

        <!-- Previous Button -->
        <Button icon="pi pi-angle-left" class="p-button-rounded p-button-text p-button-lg prevbtn" @click="editPrevImage" />

        <!-- Next Button -->
        <Button icon="pi pi-angle-right" class="p-button-rounded p-button-text p-button-lg nextbtn" @click="editNextImage" />

        <!-- Save Button -->
        <Button icon="pi pi-save" label="Save" iconPos="right" class="p-button-rounded p-button-text p-button-lg savebtn" @click="confirmImageEdit" />
    </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { CanvasPen } from '@/imageFunctions/canvasPen'

export default defineComponent({
    props: {bgImgData: String},
    emits: ["result"],
    setup(props, context) {

        // references
        const submissionCanvas = ref()
        const overlayCanvas = ref()

        // pen functions
        const canvasPen = ref()
        const penWidth = ref(4)
        const penColor = ref('red')

        // switch pen color
        const switchPenColor = (newColor: string) => {
            switch(newColor) {
                case 'eraser':
                    canvasPen.value.changePenColor('eraser')
                    penColor.value = 'eraser'
                    break;
                case 'red':
                    canvasPen.value.changePenColor('#FF0000')
                    penColor.value = 'red'
                    break;
                case 'green':
                    canvasPen.value.changePenColor('#00FF00')
                    penColor.value = 'green'
                    break;
                case 'blue':
                    canvasPen.value.changePenColor('#0000FF')
                    penColor.value = 'blue'
                    break;
                default:
                    canvasPen.value.changePenColor('#FF0000')
                    penColor.value = 'red'
            }
        }

        // switch pen width
        const switchPenWidth = (num: number) => {
            canvasPen.value.changePenWidth(num)
            penWidth.value = num
        }

        // edit previous image - not used
        const editPrevImage = () => {
            console.log("load previous")
        }

        // edit next image - not used
        const editNextImage = () => {
            console.log("load next")
        }

        // emit image dataURL
        const confirmImageEdit = () => {
            const canvas2 = overlayCanvas.value
            const pngData = canvas2.toDataURL("image/png");
            context.emit('result', pngData)
        }

        // load pen functions and background image
        onMounted(() => {

            /* -------------------------------------------------------------------- */
            if(!canvasPen.value) canvasPen.value = new CanvasPen(overlayCanvas.value)
            /* -------------------------------------------------------------------- */
            
            if(props.bgImgData) {

                const img = new Image()
                img.src = props.bgImgData

                img.onload = () => {

                    //resize display canvas
                    const canvas1 = submissionCanvas.value
                    canvas1.width = img.width;
                    canvas1.height = img.height;
                    
                    //resize annotation canvas
                    const canvas2 = overlayCanvas.value
                    canvas2.width = img.width;
                    canvas2.height = img.height;

                    // draw display image
                    const context1 = canvas1.getContext('2d');
                    context1.drawImage(img, 0, 0, canvas1.width, canvas1.height);
                    canvas1.style = "display: block;" 
                }

            }
        })

        return { 
            submissionCanvas, overlayCanvas,
            penColor, penWidth, 
            switchPenColor, switchPenWidth,
            editPrevImage, editNextImage,
            confirmImageEdit
        }
    },
})
</script>


<style scoped>
.batch-annotation-container {
    /* background: #ccc; */
    z-index: 1;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr;
}
.batch-annotation-container #submissionCanvas {
    grid-row-start: 1;
    grid-column-start: 1;
    z-index: 2;
    width: 100vw;
    border: #eee solid .5rem;
    display: none;
}
.batch-annotation-container #overlayCanvas {
    z-index: 3;
    grid-row-start: 1;
    grid-column-start: 1;
    width: calc(100vw - 1rem);
    margin:  .5rem auto 0 auto;
    /* debug */
    /* background: rgba(255,0,0, 0.5); */
    /* border: rgba(0,128,0, 0.5) solid 1rem;  */
}
.batch-annotation-container .savebtn {
    z-index: 10;
    position: absolute;
    bottom: 1rem;
    width: 7rem;
    right: calc(50% - (7rem / 2));
}
.batch-annotation-container .prevbtn {
    z-index: 10;
    position: absolute;
    left: .5rem;
    top: 1rem;
}
.batch-annotation-container .nextbtn {
    z-index: 10;
    position: absolute;
    right: .5rem;
    top: 1rem;
}


.batch-annotation-container .pens-buttons-container {
    position: absolute;
    bottom: .5rem;
    left: .5rem;
    z-index: 10;
    /* display: flex; */
}
.pens-buttons-container .pen-width-control-container {
    padding: .5rem;
    /* margin-left: 2rem; */
    /* display: flex; */
}

/* portrait orientation - all sizes */
@media (orientation: portrait) {
    .batch-annotation-container .savebtn {
        bottom: 1rem;
        right: 1rem;
    }
}

/* portrait orientation - iPads */
@media (orientation: portrait) and (min-width: 800px) {
    .batch-annotation-container #submissionCanvas {
        width: 800px;
        margin: auto;
    }
    .batch-annotation-container #overlayCanvas {
        width: calc(800px - 1rem);
        margin: auto;
        /* debug */
        /* background: rgba(0,255,0, 0.5); */
    }    
}

/* landscape orientation - all sizes */
@media (orientation: landscape) {
    /* .batch-annotation-container .pens-buttons-container {
        bottom: .5rem;
        left: .5rem;
    }     */
    .batch-annotation-container #submissionCanvas {
        height: 90vh;
        width: auto;
        margin: auto;
    }
    .batch-annotation-container #overlayCanvas {
        height: 90vh;
        width: auto;
        margin: auto;
        /* debug */
        /* background: rgba(0,255,0, 0.5); */
    }
    .batch-annotation-container .savebtn {
        position: absolute;
        right: 1rem;
        bottom: 0;
    }
    .batch-annotation-container .prevbtn {
        top: 40%;
    }
    .batch-annotation-container .nextbtn {
        top: 40%;
    }

}

/* landscape orientation - desktop/laptop */
@media (orientation: landscape) and (min-height: 800px) {
    .batch-annotation-container .pens-buttons-container {
        bottom: 1rem;
        left: 1rem;
    }
    .batch-annotation-container #submissionCanvas {
        margin: 5vh auto;
    }
    .batch-annotation-container #overlayCanvas {
        margin: 5vh auto;
    }
}
</style>