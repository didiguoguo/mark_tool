let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const scrollSpeed = 50 //滚动速度
const containerWidth = window.innerWidth //容器宽度
const containerHeight = window.innerHeight - 100 //容器高度
const selectedStyle = 'gray'
let paintType = 0 // 图形格式：0代表操作模式 1代表矩形 2代表圆形 3代表多边形 4代表点 
let startPoint = {
    x: 0,
    y: 0
}

let canvasWidth = 0 //canvas宽度
let canvasHeight = 0 //canvas高度

let imgWidth = 0 //img宽度
let imgHeight = 0 //img高度

let isPainting = false //绘图状态
let isDragging = false //拖动状态
let isSizeChanging = false //矩形或圆形处于变形状态
let isPositionChanging = false //拖动图形中
let selectedShape = null //被选中形状
let shapes = [] //图形数据
let scaleSize = 1 //当前缩放比例
let currentStrokeStyle = '#000' //当前描边色
let sourceX = 0 //canvas 绘制图像时取原图像像素点位置的X坐标
let sourceY = 0 //canvas 绘制图像时取原图像像素点位置的Y坐标

let temporaryData = [] //拖拽临时数据

let img = new Image()
img.src = './test.png'
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

// 绘制多边形时  检查当前线段是否与已有线段交叉
function checkIntersect(points, point) {

}

// 动态设置鼠标样式
function checkCurrentPoint(points, cPoint) {
    let checkInShapeResult = false
    let checkInShapeBorderResult = false
    for (let i = points.length - 1; i >= 0; i--) {
        if (checkInShapeBorder(points[i], cPoint)) {
            checkInShapeBorderResult = checkInShapeBorder(points[i], cPoint)
            break
        }
        if (checkInShape(points[i], cPoint)) {
            checkInShapeResult = checkInShape(points[i], cPoint)
            break
        }
    }
    if (checkInShapeBorderResult) {
        const {
            l,
            r,
            u,
            d,
            ur,
            ul,
            dr,
            dl,
            aroundBorder,
        } = checkInShapeBorderResult
        if (ul) {
            canvas.style.cursor = 'nw-resize'
        }
        if (dl) {
            canvas.style.cursor = 'ne-resize'
        }
        if (ur) {
            canvas.style.cursor = 'nesw-resize'
        }
        if (dr) {
            canvas.style.cursor = 'nwse-resize'
        }
        if (l) {
            canvas.style.cursor = 'w-resize'
        }
        if (r) {
            canvas.style.cursor = 'e-resize'
        }
        if (u) {
            canvas.style.cursor = 'n-resize'
        }
        if (d) {
            canvas.style.cursor = 's-resize'
        }
        if (aroundBorder) {
            canvas.style.cursor = 'all-scroll'
        }
    } else if (checkInShapeResult) {
        canvas.style.cursor = 'all-scroll'
    } else {
        canvas.style.cursor = 'auto'
    }
    return {
        checkInShapeResult,
        checkInShapeBorderResult
    }
}

// 检查当前点是否在形状内
function checkInShape(shape, point) {
    let distance
    if (shape.paintType === 1) {
        if (shape.x <= point.x && point.x <= shape.x + shape.w && shape.y <= point.y && point.y <= shape.y + shape.h) {
            return {
                paintType: shape.paintType,
                shapeId: shape.id,
            }
        }
    }
    if (shape.paintType === 2) {
        distance = Math.sqrt(Math.pow(shape.x - point.x, 2) + Math.pow(shape.y - point.y, 2))
        if (distance <= shape.r) {
            return {
                paintType: shape.paintType,
                shapeId: shape.id,
            }
        }
    }
    if (shape.paintType === 3) {
        for (let i = 0; i < shape.points.length; i++) {
            let item = shape.points[i]
            distance = Math.sqrt(Math.pow(item.x - point.x, 2) + Math.pow(item.y - point.y, 2))
            if (distance * scaleSize <= 20) {
                return {
                    paintType: shape.paintType,
                    shapeId: shape.id,
                    pointId: i
                }
            }
        }
    }
    if (shape.paintType === 4) {
        distance = Math.sqrt(Math.pow(shape.x - point.x, 2) + Math.pow(shape.y - point.y, 2))
        if (distance * scaleSize <= 10) {
            return {
                paintType: shape.paintType,
                shapeId: shape.id,
            }
        }
    }
}

// 检查是否在图形边缘
function checkInShapeBorder(shape, point) {
    let x1 = shape.x
    let x2 = point.x
    let y1 = shape.y
    let y2 = point.y
    let w = shape.w
    let h = shape.h
    if (shape.paintType === 1) {
        let l = false
        let r = false
        let u = false
        let d = false
        let ul = false
        let ur = false
        let dr = false
        let dl = false
        if (-10 / scaleSize < x2 - x1 && x2 - x1 <= 10 / scaleSize) {
            if (-10 / scaleSize < y2 - y1 && y2 - y1 <= 10 / scaleSize) {
                ul = true
            } else if (-10 / scaleSize < y2 - y1 - h && y2 - y1 - h <= 10 / scaleSize) {
                dl = true
            } else if (10 / scaleSize < y2 - y1 && y2 - y1 < -10 / scaleSize + h) {
                l = true
            }
        } else if (-10 / scaleSize < x2 - x1 - w && x2 - x1 - w <= 10 / scaleSize) {
            if (-10 / scaleSize < y2 - y1 && y2 - y1 <= 10 / scaleSize) {
                ur = true
            } else if (-10 / scaleSize < y2 - y1 - h && y2 - y1 - h <= 10 / scaleSize) {
                dr = true
            } else if (10 / scaleSize < y2 - y1 && y2 - y1 < -10 / scaleSize + h) {
                r = true
            }
        } else if (-10 / scaleSize < y2 - y1 && y2 - y1 <= 10 / scaleSize) {
            if (10 / scaleSize < x2 - x1 && x2 - x1 < -10 / scaleSize + w) {
                u = true
            }
        } else if (-10 / scaleSize < y2 - y1 - h && y2 - y1 - h <= 10 / scaleSize) {
            if (10 / scaleSize < x2 - x1 && x2 - x1 < -10 / scaleSize + w) {
                d = true
            }
        }
        if (l || r || u || d || ur || ul || dr || dl) {
            return {
                shapeId: shape.id,
                u,
                l,
                d,
                r,
                ur,
                ul,
                dr,
                dl,
                paintType: shape.paintType,
            }
        } else {
            return false
        }
    }
    if (shape.paintType === 2) {
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        if (-10 / scaleSize <= shape.r - distance && shape.r - distance <= 10) {
            return {
                shapeId: shape.id,
                paintType: shape.paintType,
                aroundBorder: true
            }
        } else {
            return false
        }
    }
}

//过滤未完成多边形
function filterUncompletedPolygon(_shapes) {
    return _shapes.filter(item => item.paintType !== 3 || (item.paintType === 3 && item.isCompleted))
}

//清除所有操作
function reset() {
    canvas.style.cursor = 'auto'
    paintType = 0
    startPoint = {
        x: 0,
        y: 0
    }
    isPainting = false
    isSizeChanging = false
    isPositionChanging = false
    shapes = []
    scaleSize = 1
    selectedShape = null
    currentStrokeStyle = '#000'
    sourceX = 0
    sourceY = 0
    drawShapes()
}

//切换为操作模式
function toggleToAction() {
    isPainting = false
    shapes = filterUncompletedPolygon(shapes)
    paintType = 0
    canvas.style.cursor = 'pointer'
}

//切换矩形
function toggleToRect() {
    isPainting = false
    shapes = filterUncompletedPolygon(shapes)
    paintType = 1
    canvas.style.cursor = 'crosshair'
}

//切换圆形
function toggleToCircle() {
    isPainting = false
    shapes = filterUncompletedPolygon(shapes)
    paintType = 2
    canvas.style.cursor = 'crosshair'
}

//切换多边形
function toggleToBrokenLine() {
    isPainting = false
    paintType = 3
    canvas.style.cursor = 'crosshair'
}

//切换点
function toggleToPoint() {
    isPainting = false
    shapes = filterUncompletedPolygon(shapes)
    paintType = 4
    canvas.style.cursor = 'crosshair'
}


// //切换虚线
// function toggleToDashLine(v) {
//     isPainting = false
//     shapes = filterUncompletedPolygon(shapes)
//     if (v == 0) {
//         dashLine = false
//     }
//     if (v == 1) {
//         dashLine = true
//     }
// }

//切换颜色
function onColorChange(v) {
    isPainting = false
    shapes = filterUncompletedPolygon(shapes)
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
function drawRect(rect) {
    let {
        x,
        y,
        w,
        h,
        color,
        selected,
    } = rect
    if (selected) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    x = (x - sourceX) * scaleSize
    y = (y - sourceY) * scaleSize
    w = w * scaleSize
    h = h * scaleSize
    ctx.beginPath()
    ctx.strokeStyle = selected ? selectedStyle : color
    ctx.strokeRect(x, y, w, h)
}

//绘制圆形
function drawCircle(circle) {
    let {
        x,
        y,
        r,
        color,
        selected
    } = circle
    if (selected) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    x = (x - sourceX) * scaleSize
    y = (y - sourceY) * scaleSize
    r = r * scaleSize
    ctx.beginPath()
    ctx.strokeStyle = selected ? selectedStyle : color
    ctx.moveTo(x + r, y)
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
}

//绘制线段
function drawLine(sPoint, ePoint, color, selected) {
    sPoint = {
        ...sPoint,
        x: (sPoint.x - sourceX) * scaleSize,
        y: (sPoint.y - sourceY) * scaleSize,
    }
    ePoint = {
        ...ePoint,
        x: (ePoint.x - sourceX) * scaleSize,
        y: (ePoint.y - sourceY) * scaleSize,
    }
    if (selected) {
        ctx.setLineDash([5, 5])
    } else {
        ctx.setLineDash([1, 0])
    }
    ctx.beginPath()
    ctx.strokeStyle = selected ? selectedStyle : color
    ctx.moveTo(sPoint.x, sPoint.y)
    ctx.lineTo(ePoint.x, ePoint.y)
    ctx.stroke()
}

//绘制多边形
function drawBrokenLine(polygon) {
    let {
        points,
        color,
        isCompleted,
        selected,
        r
    } = polygon
    points.forEach((point, index) => {
        const {
            x,
            y
        } = point
        drawCircle({
            x,
            y,
            r,
            selected,
            color
        })
        if (index > 0 && index < points.length) {
            drawLine(points[index - 1], point, color, selected)
        }
    })
    if (isCompleted) {
        drawLine(points[points.length - 1], points[0], color, selected)
    }
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
    console.log(shapes, paintType)
    if (shapes.length > 0) {
        shapes.forEach(function (item, index) {
            if (item.paintType === 1) {
                drawRect(item)
            }
            if (item.paintType === 2) {
                drawCircle(item)
            }
            if (item.paintType === 3) {
                drawBrokenLine({
                    ...item,
                    r: 3
                })
            }
            if (item.paintType === 4) {
                drawCircle({
                    ...item,
                    r: 3,
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
    isPainting = true
    let x = e.offsetX
    let y = e.offsetY
    let len = shapes.length;
    startPoint = { // 当前点在画布上的坐标
        x,
        y
    }
    const currentPoint = { // 当前点在img上的坐标
        x: sourceX + x / scaleSize,
        y: sourceY + y / scaleSize,
    }



    //操作模式
    if (paintType === 0) {
        let {
            checkInShapeResult,
            checkInShapeBorderResult
        } = checkCurrentPoint(shapes, currentPoint)
        if (checkInShapeBorderResult) {
            selectedShape = checkInShapeBorderResult
            shapes = shapes.map(item => item.id === selectedShape.shapeId ? { ...item,
                selected: true
            } : item)
            isSizeChanging = true
        } else if (checkInShapeResult) {
            selectedShape = checkInShapeResult
            shapes = shapes.map(item => item.id === selectedShape.shapeId ? { ...item,
                selected: true
            } : item)
            isPositionChanging = true
        } else {
            isDragging = true
        }
        draw()
        temporaryData.push({
            x,
            y
        })
    }

    //绘制矩形
    if (paintType === 1) {
        shapes.push({
            id: len,
            x,
            y,
            w: 0,
            h: 0,
            color: currentStrokeStyle,
            paintType,
        })
    }

    //绘制圆形
    if (paintType === 2) {
        shapes.push({
            id: len,
            x,
            y,
            r: 0,
            color: currentStrokeStyle,
            paintType,
        })
    }

    //绘制多边形
    if (paintType === 3) {
        const INIT = { // 初始数据
            id: len,
            points: [currentPoint],
            paintType,
            isCompleted: false,
            color: currentStrokeStyle
        }
        if (len === 0 || shapes[len - 1].paintType !== 3 || (shapes[len - 1].paintType === 3 && shapes[len - 1].isCompleted)) {
            shapes.push(INIT)
        } else {
            const polygon = shapes[len - 1]
            if (isPainting) {
                let points = polygon.points
                const sPoint = points[0]
                const distance = Math.sqrt(Math.pow(sPoint.x - currentPoint.x, 2) + Math.pow(sPoint.y - currentPoint.y, 2)) * scaleSize
                if (points.length > 2 && distance < 30) {
                    polygon.isCompleted = true
                    isPainting = false
                    points = points.slice(0, -1)
                }
                shapes[len - 1] = {
                    ...polygon,
                    points
                }
            }
        }
        draw()
    }

    //绘制点
    if (paintType === 4) {
        shapes.push({
            id: len,
            x,
            y,
            color: currentStrokeStyle,
            paintType,
        })
        draw()
    }
})

//鼠标移动事件
$(canvas).on('mousemove', function (e) {
    if (isPainting && paintType !== 0) {
        const width = Math.abs(e.offsetX - startPoint.x)
        const height = Math.abs(e.offsetY - startPoint.y)
        const lastShape = shapes[shapes.length - 1]
        if (paintType === 3) { //多边形
            if (lastShape.paintType === 3 && !lastShape.isCompleted) {
                lastShape.points[lastShape.points.length - 1] = {
                    x: sourceX + e.offsetX / scaleSize,
                    y: sourceY + e.offsetY / scaleSize,
                }
                shapes[shapes.length - 1] = {
                    ...lastShape
                }
            }
        } else if (paintType === 1) { //矩形
            const x = e.offsetX < startPoint.x ? e.offsetX : startPoint.x
            const y = e.offsetY < startPoint.y ? e.offsetY : startPoint.y
            shapes[shapes.length - 1] = {
                ...shapes[shapes.length - 1],
                x: sourceX + x / scaleSize,
                y: sourceY + y / scaleSize,
                w: width / scaleSize,
                h: height / scaleSize,
            }
        } else if (paintType === 2) { //圆形
            let radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
            shapes[shapes.length - 1] = {
                ...shapes[shapes.length - 1],
                x: sourceX + startPoint.x / scaleSize,
                y: sourceY + startPoint.y / scaleSize,
                r: radius / scaleSize,
            }
        } else if (paintType === 4) { //点
            shapes[shapes.length - 1] = {
                ...shapes[shapes.length - 1],
                x: sourceX + e.offsetX / scaleSize,
                y: sourceY + e.offsetY / scaleSize,
            }
        }
        draw()
    } else if (paintType === 0) {
        let {
            checkInShapeBorderResult
        } = checkCurrentPoint(shapes, {
            x: sourceX + e.offsetX / scaleSize,
            y: sourceY + e.offsetY / scaleSize
        })
        if (isDragging && !selectedShape) { //拖动整体
            let distanceX = (e.offsetX - temporaryData[temporaryData.length - 1].x) / scaleSize
            let distanceY = (e.offsetY - temporaryData[temporaryData.length - 1].y) / scaleSize
            sourceX = sourceX - distanceX
            sourceY = sourceY - distanceY

            // 临界点控制
            if (sourceX < 0) {
                sourceX = 0
            }
            if (sourceY < 0) {
                sourceY = 0
            }
            if (sourceX > imgWidth - canvasWidth / scaleSize) {
                sourceX = imgWidth - canvasWidth / scaleSize
            }
            if (sourceY > imgHeight - canvasHeight / scaleSize) {
                sourceY = imgHeight - canvasHeight / scaleSize
            }
            draw()
            temporaryData.push({
                x: e.offsetX,
                y: e.offsetY
            })
        } else if (isPositionChanging) { //拖动图形
            let distanceX = (e.offsetX - temporaryData[temporaryData.length - 1].x) / scaleSize
            let distanceY = (e.offsetY - temporaryData[temporaryData.length - 1].y) / scaleSize
            for (let index = 0; index < shapes.length; index++) {
                let item = shapes[index]
                if (item.id === selectedShape.shapeId) {
                    if (selectedShape.paintType !== 3) {
                        shapes[index] = {
                            ...item,
                            x: item.x + distanceX,
                            y: item.y + distanceY,
                        }
                    } else {
                        for (let i = 0; i < item.points.length; i++) {
                            let p = item.points[i]
                            if (i === selectedShape.pointId) {
                                shapes[index].points[i] = {
                                    x: p.x + distanceX,
                                    y: p.y + distanceY,
                                }
                                break
                            }
                        }
                    }
                    break
                }
            }
            draw()
            temporaryData.push({
                x: e.offsetX,
                y: e.offsetY
            })
        } else if (isSizeChanging) { //改变形状大小
            const currentPoint = { //鼠标当前位置
                x: e.offsetX,
                y: e.offsetY
            }
            const lastPoint = { //鼠标上一个位置
                x: temporaryData[temporaryData.length - 1].x,
                y: temporaryData[temporaryData.length - 1].y
            }
            let distanceX = (currentPoint.x - lastPoint.x) / scaleSize
            let distanceY = (currentPoint.y - lastPoint.y) / scaleSize
            const {
                shapeId,
                l,
                r,
                u,
                d,
                ul,
                ur,
                dl,
                dr
            } = selectedShape
            let sShape = shapes.filter(item => item.id === shapeId)[0]
            if (sShape.paintType === 1) {
                if (Math.abs(distanceX) < sShape.w) {
                    if (l || dl || ul) {
                        sShape.x = sShape.x + distanceX
                        sShape.w = sShape.w - distanceX
                    } else if (r || dr || ur) {
                        sShape.w = sShape.w + distanceX
                    }
                } else {
                    isSizeChanging = false
                    canvas.style.cursor = 'auto'
                }
                if (Math.abs(distanceY) < sShape.h) {
                    if (u || ul || ur) {
                        sShape.y = sShape.y + distanceY
                        sShape.h = sShape.h - distanceY
                    } else if (d || dl || dr) {
                        sShape.h = sShape.h + distanceY
                    }
                } else {
                    isSizeChanging = false
                    canvas.style.cursor = 'auto'
                }
            } else if (sShape.paintType === 2) {
                const distance1 = Math.sqrt(Math.pow(sourceX + (currentPoint.x / scaleSize) - sShape.x, 2) + Math.pow(sourceY + (currentPoint.y / scaleSize) - sShape.y, 2))
                const distance2 = Math.sqrt(Math.pow(sourceX + (lastPoint.x / scaleSize) - sShape.x, 2) + Math.pow(sourceY + (lastPoint.y / scaleSize) - sShape.y, 2))
                sShape.r = sShape.r + distance1 - distance2
            }
            shapes = shapes.map(item => item.id === sShape.id ? sShape : item)
            draw()
            temporaryData.push({
                x: e.offsetX,
                y: e.offsetY
            })
        }
    }
})

//鼠标弹起事件
$(canvas).on('mouseup', function (e) {
    if (paintType !== 3) {
        let cPoint = {
            x: e.offsetX,
            y: e.offsetY
        }
        // console.log(cPoint, startPoint)
        if ((paintType === 1 || paintType === 2) && isPainting && (cPoint.x === startPoint.x && cPoint.y === startPoint.y)) {
            shapes.pop()
            console.log(shapes)
        }
        isPainting = false
        isDragging = false
        if (paintType != 0) {
            temporaryData = []
        }
    } else {
        const lastShape = shapes[shapes.length - 1]
        if (isPainting && !lastShape.isCompleted) {
            shapes[shapes.length - 1].points.push({
                x: sourceX + e.offsetX / scaleSize + 1,
                y: sourceY + e.offsetY / scaleSize + 1,
            })
        }
    }
    isPositionChanging = false
    isSizeChanging = false
    selectedShape = null
    shapes = shapes.map(item => ({ ...item,
        selected: false
    }))
    draw()

})

//鼠标离开区域事件
$(canvas).on('mouseout', function (e) {
    // console.log(e.offsetX,e.offsetY)
    if (paintType !== 3) {
        isPainting = false
    }
    isDragging = false
    isPositionChanging = false
    // temporaryData = []
})

$(document).on('keydown', function (e) {
    console.log(e.keyCode)
    switch (e.keyCode) {
        case 32: //空格 切换操作模式
            toggleToAction()
            break
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
        case 69: //E 切换为多边形
            toggleToBrokenLine()
            break
        case 81: //Q 切换为矩形
            toggleToRect()
            break
        case 82: //R 切换为点
            toggleToPoint()
            break
        case 87: //W  切换为圆形
            toggleToCircle()
            break
        case 187: //＋
        case 107: //＋
            enlarge()
            break
        case 189: //－
        case 109: //－
            narrow()
            break
    }
})

$(document).on('touchMove',function(e){
    e.preventDefault()
})