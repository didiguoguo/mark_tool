let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let img = new Image()
img.src = './images/pic.png'
img.onload = function () {
    let w = this.width
    let h = this.height
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.height = h
    if (w > W) {
        canvas.width = W
    } else {
        canvas.width = w
    }
    ctx.drawImage(img, 0, 0)
}

let paintType = 0 // 图形格式：0代表矩形 1代表圆形 2代表折线
let startPoint = {
    x: 0,
    y: 0
}
let currentShapeId = -1;
let isPainting = false //绘图状态
let isDraggable = false //拖动状态
let shapes = [] //存放图形数据的数据
let scaleSize = 1 //当前缩放比例
let currentStrokeStyle = '#000' //当前描边色

let temporaryData = [] //临时数据数组

//清除所有操作
function reset() {
    currentShapeId = -1;
    paintType = 0
    startPoint = {
        x: 0,
        y: 0
    }
    isPainting = false
    isDraggable = false
    shapes = []
    scaleSize = 1
    currentStrokeStyle = '#000'
    temporaryData = []
    drawShapes()
}

//切换矩形
function toggleToRect() {
    paintType = 0
}

//切换圆形
function toggleToCircle() {
    paintType = 1
}

//切换折线
function toggleToBrokenLine() {
    paintType = 2
}

function onColorChange(v) {
    console.log(v)
    currentStrokeStyle = v
}

function enlarge() {
    scaleSize = scaleSize * 1.2
    ctx.scale(scaleSize, scaleSize)
    ctx.clearRect(0, 0, 1200, 800)
    ctx.drawImage(img, 0, 0)
    ctx.setLineDash([5, 15]);
    ctx.beginPath()
    drawShapes()
}

function narrow() {
    if (scaleSize <= 1) {
        return
    } else {
        scaleSize = scaleSize / 1.2
        ctx.scale(1 / 1.2, 1 / 1.2)
        ctx.clearRect(0, 0, 1000, 800)
        ctx.drawImage(img, 0, 0)
        ctx.beginPath()
        drawShapes()
    }
}

function drawRect(x, y, w, h, c) {
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

function drawCircle(x, y, r, c) {
    ctx.beginPath()
    ctx.strokeStyle = c
    ctx.moveTo(x + r, y)
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
}

function drawLine(startPoint, endPoint, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()
}

function drawBrokenLine(points, color) {
    points.forEach((point, index) => {
        drawCircle(point.x, point.y, 3, color)
        if (index > 0 && index < points.length) {
            drawLine(points[index - 1], point, color)
        }
    })
}

function drawShapes() {
    console.log(shapes, paintType)
    if (shapes.length > 0) {
        shapes.forEach(function (item, index) {
            if (item.paintType === 0) {
                drawRect(item.x, item.y, item.w, item.h, item.color)
            }
            if (item.paintType === 1) {
                drawCircle(item.x, item.y, item.r, item.color)
            }
            if (item.paintType === 2) {
                drawBrokenLine(item.points, item.color)
            }
        })
    } else {
        ctx.clearRect(0, 0, 1000, 800)
        ctx.drawImage(img, 0, 0)
    }
}

$(canvas).on('mousedown', function (e) {
    let len = shapes.length;
    startPoint.x = e.offsetX
    startPoint.y = e.offsetY
    isPainting = true
    if (paintType === 2) { //绘制折线图
        if (len === 0) {
            shapes.push({
                id: len,
                points: [{
                    x: startPoint.x,
                    y: startPoint.y
                }],
                paintType,
                color: currentStrokeStyle
            })
        } else {
            let existed = false;
            shapes.forEach((item, index) => {
                if (item.paintType === 2 && index === shapes.length - 1) {
                    existed = true
                    shapes[index].points.push({
                        x: startPoint.x,
                        y: startPoint.y
                    })
                    // if (shapes[index].points.length > 2 && shapes[index].points[0].x === startPoint.x && shapes[index].points[0].y === startPoint.y) {
                    //     ctx.clearRect(0, 0, 1000, 800)
                    //     ctx.drawImage(img, 0, 0)
                    //     ctx.beginPath()
                    //     drawShapes()
                    //     isPainting = false
                    // }
                }
            })
            if (!existed) {
                shapes.push({
                    id: len,
                    points: [{
                        x: startPoint.x,
                        y: startPoint.y
                    }],
                    paintType,
                    color: currentStrokeStyle
                })
            }
        }
        ctx.clearRect(0, 0, 1000, 800)
        ctx.drawImage(img, 0, 0)
        ctx.beginPath()
        drawShapes()
    }
})

$(canvas).on('mousemove', function (e) {
    let width, height, x, y
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
        if (paintType === 2) {
            // shapes.forEach((item, index) => {
            //     if (item.id === currentShapeId) {
            //         let len = shapes[index].points.length
            //         shapes[index].points[len - 1] = {
            //             x: startPoint.x,
            //             y: startPoint.y,
            //         }
            //     }
            // })
        } else {
            if (paintType === 0) {
                if (shapes.length === 0) {
                    shapes.push({
                        id: shapes.length,
                        x: x,
                        y: y,
                        w: width,
                        h: height,
                        paintType,
                        color: currentStrokeStyle
                    })
                } else {
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
            }
            if (paintType === 1) {
                if (shapes.length === 0) {
                    shapes.push({
                        id: shapes.length,
                        x: startPoint.x,
                        y: startPoint.y,
                        r: radius,
                        paintType,
                        color: currentStrokeStyle
                    })
                } else {
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
            ctx.clearRect(0, 0, 1000, 800)
            ctx.drawImage(img, 0, 0)
            ctx.beginPath()
            drawShapes()
        }
    }
})
$(canvas).on('mouseup', function (e) {
    if (paintType !== 2) {
        isPainting = false
        temporaryData = []
    }
})
$(canvas).on('mouseout', function (e) {
    // console.log(e.offsetX,e.offsetY)
    isPainting = false
    temporaryData = []
})