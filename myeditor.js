let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const scrollSpeed = 50 //滚动速度
const containerWidth = window.innerWidth //容器宽度
const containerHeight = window.innerHeight - 100 //容器高度

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
let sourceX = 0 //canvas 绘制图像时取原图像像素点位置的X坐标
let sourceY = 0 //canvas 绘制图像时取原图像像素点位置的Y坐标

let img = new Image()
img.src = './分析选项.png'
img.onload = function () {
    let w = this.width
    let h = this.height
    imgWidth = this.width
    imgHeight = this.height
    let sourceWidth = 0
    let sourceHeight = 0
    if (w > containerWidth) {
        canvas.width = containerWidth
        canvasWidth = containerWidth
    } else {
        canvas.width = w
        canvasWidth = w
    }
    if (h > containerHeight) {
        canvas.height = containerHeight
        canvasHeight = containerHeight
    } else {
        canvas.height = h
        canvasHeight = h
    }
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
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

//放大
function enlarge() {
    const currentWidth = canvasWidth / scaleSize
    const currentHeight = canvasHeight / scaleSize
    scaleSize = scaleSize * 1.2
    sourceX = sourceX + (currentWidth - canvasWidth / scaleSize) / 2
    sourceY = sourceY + (currentHeight - canvasHeight / scaleSize) / 2
    if (sourceX > imgWidth - canvasWidth / scaleSize) {
        sourceX = imgWidth - canvasWidth / scaleSize
    }
    if (sourceY > imgHeight - canvasHeight / scaleSize) {
        sourceY = imgHeight - canvasHeight / scaleSize
    }
    draw()
}

//缩小
function narrow() {
    const currentWidth = canvasWidth / scaleSize
    const currentHeight = canvasHeight / scaleSize
    scaleSize = scaleSize / 1.2
    if (scaleSize < 1) {
        scaleSize = 1
    }
    sourceX = sourceX - (canvasWidth / scaleSize - currentWidth) / 2
    sourceY = sourceY - (canvasHeight / scaleSize - currentHeight) / 2
    if (sourceX > imgWidth - canvasWidth / scaleSize) {
        sourceX = imgWidth - canvasWidth / scaleSize
    }
    if (sourceY > imgHeight - canvasHeight / scaleSize) {
        sourceY = imgHeight - canvasHeight / scaleSize
    }
    if (sourceX < 0) {
        sourceX = 0
    }
    if (sourceY < 0) {
        sourceY = 0
    }
    draw()
}

//图片右移
function moveRight() {
    if (0 <= sourceX && sourceX <= (imgWidth - canvasWidth / scaleSize)) {
        sourceX = sourceX - scrollSpeed / scaleSize
        if (sourceX < 0) {
            sourceX = 0
        }
        draw()
    }
}

//图片左移
function moveLeft() {
    if (0 <= sourceX && sourceX <= (imgWidth - canvasWidth / scaleSize)) {
        sourceX = sourceX + scrollSpeed / scaleSize
        if (sourceX > (imgWidth - canvasWidth / scaleSize)) {
            sourceX = imgWidth - canvasWidth / scaleSize
        }
        draw()
    }
}

//图片上移
function moveUp() {
    if (0 <= sourceY && sourceY <= (imgHeight - canvasHeight / scaleSize)) {
        sourceY = sourceY + scrollSpeed / scaleSize
        if (sourceY > (imgHeight - canvasHeight / scaleSize)) {
            sourceY = imgHeight - canvasHeight / scaleSize
        }
        draw()
    }
}

//图片下移
function moveDown() {
    if (0 <= sourceY && sourceY <= (imgHeight - canvasHeight / scaleSize)) {
        sourceY = sourceY - scrollSpeed / scaleSize
        if (sourceY < 0) {
            sourceY = 0
        }
        draw()
    }
}

//绘制矩形
function drawRect({
    x,
    y,
    w,
    h,
    color,
    dashLine
}) {
    let c = color
    let d = dashLine
    if (d) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    x = (x - sourceX) * scaleSize
    y = (y - sourceY) * scaleSize
    w = w * scaleSize
    h = h * scaleSize
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
function drawCircle({
    x,
    y,
    r,
    color,
    dashLine
}) {
    let c = color
    let d = dashLine
    if (d) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    x = (x - sourceX) * scaleSize
    y = (y - sourceY) * scaleSize
    r = r * scaleSize
    ctx.beginPath()
    ctx.strokeStyle = c
    ctx.moveTo(x + r, y)
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
}

//绘制线段
function drawLine(startPoint, endPoint, color) {
    startPoint = {
        ...startPoint,
        x: (startPoint.x - sourceX) * scaleSize,
        y: (startPoint.y - sourceY) * scaleSize,
    }
    endPoint = {
        ...endPoint,
        x: (endPoint.x - sourceX) * scaleSize,
        y: (endPoint.y - sourceY) * scaleSize,
    }
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
}

//绘制折线
function drawBrokenLine({
    points,
    color
}) {
    points.forEach((point, index) => {
        drawCircle({
            ...point,
            r: 3
        })
        if (index > 0 && index < points.length) {
            drawLine(points[index - 1], point, color)
        }
    })
}

//绘制全部
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    drawOwnImage()
    ctx.beginPath()
    drawShapes()
}

//绘制当前图形
function drawOwnImage() {
    ctx.drawImage(img, sourceX, sourceY, canvasWidth / scaleSize, canvasHeight / scaleSize, 0, 0, canvasWidth, canvasHeight)
}

//绘制所有图形
function drawShapes() {
    // console.log(shapes, paintType)
    if (shapes.length > 0) {
        shapes.forEach(function (item, index) {
            if (item.paintType === 1) {
                drawRect({
                    ...item
                })
            }
            if (item.paintType === 2) {
                drawCircle({
                    ...item
                })
            }
            if (item.paintType === 3) {
                drawBrokenLine({
                    ...item
                })
            }
        })
    } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        drawOwnImage()
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
                    x: sourceX + x / scaleSize,
                    y: sourceY + y / scaleSize,
                }],
                paintType,
                color: currentStrokeStyle
            })
        } else {
            if (shapes[shapes.length - 1].paintType === 3) {
                shapes[shapes.length - 1].points.push({
                    x: sourceX + x / scaleSize,
                    y: sourceY + y / scaleSize,
                })
            } else {
                shapes.push({
                    id: len,
                    points: [{
                        x: sourceX + x / scaleSize,
                        y: sourceY + y / scaleSize,
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
            dashLine,
        })
    } else if (paintType === 2) {
        shapes.push({
            x,
            y,
            r: 0,
            color: currentStrokeStyle,
            dashLine,
        })
    }
    draw()
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
                    x: sourceX + x / scaleSize,
                    y: sourceY + y / scaleSize,
                    w: width / scaleSize,
                    h: height / scaleSize,
                    paintType,
                    color: currentStrokeStyle
                }
            }
            if (paintType === 2) {
                shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: sourceX + x / scaleSize,
                    y: sourceY + y / scaleSize,
                    r: radius / scaleSize,
                    paintType,
                    color: currentStrokeStyle
                }
            }
        }
        draw()
    }
})

//鼠标弹起事件
$(canvas).on('mouseup', function (e) {
    if (paintType !== 3) {
        isPainting = false
    }
})

//鼠标离开区域事件
$(canvas).on('mouseout', function (e) {
    // console.log(e.offsetX,e.offsetY)
    isPainting = false
})

$(document).on('keydown', function (e) {
    isPainting = false
    console.log(e.keyCode)
    switch (e.keyCode) {
        case 37: //←
            moveLeft()
            break
        case 38: //↑
            moveUp()
            break
        case 39: //→
            moveRight()
            break
        case 40: //↓
            moveDown()
            break
        case 46: //delete
            reset()
            break
        case 65: //A
            toggleToAction()
            break
        case 67: //C
            toggleToCircle()
            break
        case 80: //P
            toggleToBrokenLine()
            break
        case 82: //R
            toggleToRect()
            break
        case 187: //＋
            enlarge()
            break
        case 189: //－
            narrow()
            break
    }
})