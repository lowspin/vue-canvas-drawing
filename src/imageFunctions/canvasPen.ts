export class CanvasPen {

    canvas: HTMLCanvasElement;
    penPos = {x:-1, y:-1}
    penColor = "#FF0000";
    penWidth = 4;
    penDown = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.init()
    }

    // add event listeners
    init = (): void => {
        this.canvas.addEventListener("mousedown", this.doPenDown, false);
        this.canvas.addEventListener("mouseup", this.doPenUp, false);
        this.canvas.addEventListener("mousemove", this.doPenMove, false);

        this.canvas.addEventListener("touchstart", this.doTouchStart, false);
        this.canvas.addEventListener("touchend", this.doTouchEnd, false);
        this.canvas.addEventListener("touchmove", this.doTouchMove, false);
    }
    
    // change pen color
    changePenColor = (newcolor: string): void => {
        this.penColor = newcolor
    }

    // change pen color
    changePenWidth = (newWidth: number): void => {
        this.penWidth = newWidth
    }

    // draw on overlay canvas
    doPenDraw = (pos: {x: number; y: number}): void => {

        const ctx = this.canvas.getContext('2d');

        if(ctx && this.penColor === "eraser") {
            // canvas2.style.cursor = "crosshair"
            if(this.penDown) {
                this.penPos = pos
                const erasesize = 14;
                const x = Math.max(this.penPos.x, 0) - 0.5*erasesize;
                const y = Math.max(this.penPos.y, 0) - 0.5*erasesize;
                ctx.clearRect(x, y, erasesize, erasesize)
            } 

        } else {

            if(ctx && this.penDown) {                
                ctx.lineWidth = this.penWidth;
                ctx.strokeStyle = this.penColor;
                ctx.lineCap = 'round';
                
                if(this.penPos.x < 0) {
                    // new path
                    ctx.beginPath();
                    this.penPos = pos

                } else {
                    // continue path
                    ctx.moveTo( this.penPos.x, this.penPos.y ) // from
                    this.penPos = pos
                    ctx.lineTo( this.penPos.x, this.penPos.y ) // to

                    ctx.stroke();
                }
            }

        }

    }

    // translate mouse events
    doPenMove = (event: MouseEvent): void => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width
        const scaleY = this.canvas.height / rect.height
        const x = scaleX * (event.offsetX)
        const y = scaleY * (event.offsetY)
        this.doPenDraw( {x: x, y: y} )
    }

    // mouse click and pen down
    doPenDown = (event: MouseEvent): void => {
        console.log("doPenDown - penWidth", this.penWidth)
        this.penDown = true
        this.doPenMove(event)
    }

    // mouse release and pen up
    doPenUp = (): void => {
        this.penPos = {x:-1, y:-1}
        this.penDown = false
    }

    // translate touch events
    doTouchMove = (ev: TouchEvent): void => {
        // console.log("Touch Move")
        if(ev.touches.length == 1) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width
            const scaleY = this.canvas.height / rect.height
            const x = scaleX * (ev.touches[0].clientX - rect.left)
            const y = scaleY * (ev.touches[0].clientY - rect.top)
            this.doPenDraw( {x: x, y: y} )
        }
    }

    // touch start
    doTouchStart = (ev: TouchEvent): void => {
        this.penDown = true
        this.doTouchMove(ev)
    }

    // touch end
    doTouchEnd = (): void => {
        this.penPos = {x:-1, y:-1}
        this.penDown = false
    }
        
}
