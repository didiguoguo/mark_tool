let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let paintType = 0 // 图形格式：0代表操作图形 1代表矩形 2代表圆形 3代表折线 4代表放大 5代表缩小
let startPoint = {
    x: 0,
    y: 0
}

let canvasWidth = 0 //canvas宽度
let canvasHeight = 0 //canvas高度

let imgWidth = 0 //img宽度
let imgHeight = 0 //img高度

let currentShapeId = -1;
let isPainting = false //绘图状态
let shapes = [] //图形数据
let scaleSize = 1 //当前缩放比例
let currentStrokeStyle = '#000' //当前描边色
let dashLine = false //是否虚线
let temporaryData = [] //临时数据数组

let img = new Image()
img.src = './wlop1.jpg'
img.onload = function () {
    let w = this.width
    let h = this.height
    imgWidth = this.width
    imgHeight = this.height
    let W = window.innerWidth
    let H = window.innerHeight
    if (w > W) {
        canvas.width = W
        canvasWidth = W
    } else {
        canvas.width = w
        canvasWidth = W
    }
    if (h > H - 100) {
        canvas.height = H - 100
        canvasHeight = H - 100
    } else {
        canvas.height = h
        canvasHeight = H - 100
    }
    ctx.drawImage(img, 0, 0)
}

//清除所有操作
function reset() {
    canvas.style.cursor = 'auto'
    currentShapeId = -1;
    paintType = 0
    startPoint = {
        x: 0,
        y: 0
    }
    isPainting = false
    shapes = []
    scaleSize = 1
    currentStrokeStyle = '#000'
    temporaryData = []
    dashLine = false
    drawShapes()
}

//切换为操作模式
function toggleToAction() {
    paintType = 0
    canvas.style.cursor = 'pointer'
}

//切换矩形
function toggleToRect() {
    paintType = 1
    canvas.style.cursor = 'crosshair'
}

//切换圆形
function toggleToCircle() {
    paintType = 2
    canvas.style.cursor = 'crosshair'
}

//切换折线
function toggleToBrokenLine() {
    paintType = 3
    canvas.style.cursor = 'crosshair'
}

//切换虚线
function toggleToDashLine(v) {
    if (v == 0)
        dashLine = false
    if (v == 1)
        dashLine = true
}

//切换颜色
function onColorChange(v) {
    console.log(v)
    currentStrokeStyle = v
}

//切换为放大模式
function toggleToZoomIn() {
    paintType = 4
    canvas.style.cursor = 'zoom-in'
}

//切换为放大模式
function toggleToZoomOut() {
    paintType = 5
    canvas.style.cursor = 'zoom-out'
}

//放大
function enlarge() {
    scaleSize = scaleSize * 1.2
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, 0, 0)
    ctx.beginPath()
    drawShapes()
}

//缩小
function narrow() {
    if (scaleSize < 1.2 && scaleSize > 1) {
        ctx.scale(1 / scaleSize, 1 / scaleSize)
        scaleSize = 1
    } else if (scaleSize >= 1.2) {
        scaleSize = scaleSize / 1.2
        ctx.scale(1 / 1.2, 1 / 1.2)
    }
    console.log(scaleSize)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, 0, 0)
    ctx.beginPath()
    drawShapes()
}

//绘制矩形
function drawRect(x, y, w, h, c, d) {
    if (d) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    ctx.beginPath()
    ctx.strokeStyle = c
    ctx.moveTo(x, y)
    ctx.lineTo(x + w, y)
    ctx.moveTo(x + w, y)
    ctx.lineTo(x + w, y + h)
    ctx.moveTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.moveTo(x, y + h)
    ctx.lineTo(x, y)
    ctx.stroke()
}

//绘制圆形
function drawCircle(x, y, r, c, d) {
    if (d) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    ctx.beginPath()
    ctx.strokeStyle = c
    ctx.moveTo(x + r, y)
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
}

//绘制线段
function drawLine(startPoint, endPoint, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
}

//绘制折线
function drawBrokenLine(points, color) {
    points.forEach((point, index) => {
        drawCircle(point.x, point.y, 3, color)
        if (index > 0 && index < points.length) {
            drawLine(points[index - 1], point, color)
        }
    })
}

//绘制所有图形
function drawShapes() {
    // console.log(shapes, paintType)
    if (shapes.length > 0) {
        shapes
            .forEach(function (item, index) {
                if (item.paintType === 1) {
                    drawRect(item.x, item.y, item.w, item.h, item.color, item.dashLine)
                }
                if (item.paintType === 2) {
                    drawCircle(item.x, item.y, item.r, item.color, item.dashLine)
                }
                if (item.paintType === 3) {
                    drawBrokenLine(item.points, item.color)
                }
            })
    } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img, 0, 0)
    }
}

//鼠标按下事件
$(canvas).on('mousedown', function (e) {
    let x = e.offsetX
    let y = e.offsetY
    let len = shapes.length;
    startPoint = {
        x,
        y
    }
    isPainting = true
    if (paintType === 3) { //绘制折线图
        if (len === 0) {
            shapes.push({
                id: len,
                points: [{
                    x,
                    y
                }],
                paintType,
                color: currentStrokeStyle
            })
        } else {
            let existed = false;
            shapes.forEach((item, index) => {
                if (item.paintType === 3 && index === shapes.length - 1) {
                    existed = true
                    shapes[index]
                        .points
                        .push({
                            x,
                            y
                        })
                    // if (shapes[index].points.length > 2 && shapes[index].points[0].x ===
                    // startPoint.x && shapes[index].points[0].y === startPoint.y) {
                    // ctx.clearRect(0, 0, canvasWidth, canvasHeight)     ctx.drawImage(img, 0, 0) ctx.beginPath()
                    // drawShapes()     isPainting = false }
                }
            })
            if (!existed) {
                shapes.push({
                    id: len,
                    points: [{
                        x,
                        y
                    }],
                    paintType,
                    color: currentStrokeStyle
                })
            }
        }
    } else if (paintType === 1) {
        shapes.push({
            x,
            y,
            w: 0,
            h: 0,
            color: currentStrokeStyle,
            dashLine
        })
    } else if (paintType === 2) {
        shapes.push({
            x,
            y,
            r: 0,
            color: currentStrokeStyle,
            dashLine
        })
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, 0, 0)
    ctx.beginPath()
    drawShapes()
})

//鼠标移动事件
$(canvas).on('mousemove', function (e) {
    let width,
        height,
        x,
        y
    if (e.offsetX > startPoint.x) {
        x = startPoint.x
        width = e.offsetX - startPoint.x
    } else {
        x = e.offsetX
        width = startPoint.x - e.offsetX
    }
    if (e.offsetY > startPoint.y) {
        y = startPoint.y
        height = e.offsetY - startPoint.y
    } else {
        y = e.offsetY
        height = startPoint.y - e.offsetY
    }
    let radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    if (isPainting) {
        if (paintType === 3) {
            // shapes.forEach((item, index) => {     if (item.id === currentShapeId) {   let
            // len = shapes[index].points.length         shapes[index].points[len - 1] = {
            // x: startPoint.x,             y: startPoint.y,         }     } })
        } else {
            if (paintType === 1) {
                shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: x,
                    y: y,
                    w: width,
                    h: height,
                    paintType,
                    color: currentStrokeStyle
                }
            }
            if (paintType === 2) {
                shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: startPoint.x,
                    y: startPoint.y,
                    r: radius,
                    paintType,
                    color: currentStrokeStyle
                }
            }
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img, 0, 0)
        ctx.beginPath()
        drawShapes()
    }
})

//鼠标弹起事件
$(canvas).on('mouseup', function (e) {
    if (paintType !== 3) {
        isPainting = false
        temporaryData = []
    }
})

//鼠标离开区域事件
$(canvas).on('mouseout', function (e) {
    // console.log(e.offsetX,e.offsetY)
    isPainting = false
    temporaryData = []
})