export default class Editor {
    constructor() {
        this.paintType = 0 // 图形格式：0代表操作模式 1代表矩形 2代表圆形 3代表多边形 4代表点 
        this.startPoint = {
            x: 0,
            y: 0
        }

        this.canvasWidth = 0 //canvas宽度
        this.canvasHeight = 0 //canvas高度

        this.imgWidth = 0 //img宽度
        this.imgHeight = 0 //img高度

        this.isPainting = false //绘图状态
        this.isDragging = false //拖动状态
        this.isSizeChanging = false //矩形或圆形处于变形状态
        this.isPositionChanging = false //拖动图形中
        this.selectedShape = null //被选中形状
        this.shapes = [] //图形数据
        this.scaleSize = 1 //当前缩放比例
        this.currentStrokeStyle = '#000' //当前描边色
        this.scrollSpeed = 50
        this.sourceX = 0 //canvas 绘制图像时取原图像像素点位置的X坐标
        this.sourceY = 0 //canvas 绘制图像时取原图像像素点位置的Y坐标

        this.temporaryData = [] //拖拽临时数据
    }

    init(canvas, tools, img) {
        this.canvas = canvas
        this.img = img
        this.ctx = canvas.getContext('2d')
        this.imgWidth = img.width
        this.imgHeight = img.height
        this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height

        this.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, this.canvasWidth, this.canvasHeight)

        $(canvas).on('mousedown', this.onMouseDown.bind(this))
        $(canvas).on('mouseup', this.onMouseUp.bind(this))
        $(canvas).on('mouseout', this.onMouseOut.bind(this))
        $(canvas).on('mousemove', this.onMouseMove.bind(this))

        $(tools.reset_tool).on('click', this.reset.bind(this))
        $(tools.color_tool).on('change', this.onColorChange.bind(this))
        $(tools.action_tool).on('click', function () {
            this.toggleActionMode(0)
        }.bind(this))
        $(tools.rect_tool).on('click', function () {
            this.toggleActionMode(1)
        }.bind(this))
        $(tools.circle_tool).on('click', function () {
            this.toggleActionMode(2)
        }.bind(this))
        $(tools.polygon_tool).on('click', function () {
            this.toggleActionMode(3)
        }.bind(this))
        $(tools.point_tool).on('click', function () {
            this.toggleActionMode(4)
        }.bind(this))
        $(tools.enlarge_tool).on('click', function () {
            this.zoom('enlarge')
        }.bind(this))
        $(tools.narrow_tool).on('click', function () {
            this.zoom('narrow')
        }.bind(this))
        $(tools.move_left_tool).on('click', this.moveLeft.bind(this))
        $(tools.move_right_tool).on('click', this.moveRight.bind(this))
        $(tools.move_up_tool).on('click', this.moveUp.bind(this))
        $(tools.move_down_tool).on('click', this.moveDown.bind(this))

        $(document).on('keydown', this.onKeyDown.bind(this))
        $(document).on('touchMove', function (e) {
            e.preventDefault()
        })

    }

    //重置
    reset() {
        this.paintType = 0 // 图形格式：0代表操作模式 1代表矩形 2代表圆形 3代表多边形 4代表点 
        this.startPoint = {
            x: 0,
            y: 0
        }
        this.isPainting = false //绘图状态
        this.isDragging = false //拖动状态
        this.isSizeChanging = false //矩形或圆形处于变形状态
        this.isPositionChanging = false //拖动图形中
        this.selectedShape = null //被选中形状
        this.shapes = [] //图形数据
        this.scaleSize = 1 //当前缩放比例
        this.currentStrokeStyle = '#000' //当前描边色
        this.scrollSpeed = 50
        this.sourceX = 0 //canvas 绘制图像时取原图像像素点位置的X坐标
        this.sourceY = 0 //canvas 绘制图像时取原图像像素点位置的Y坐标

        this.temporaryData = [] //拖拽临时数据
        this.draw()
    }

    //鼠标按下事件
    onMouseDown(e) {
        this.isPainting = true
        let x = e.offsetX
        let y = e.offsetY
        let len = this.shapes.length;
        this.startPoint = { // 当前点在画布上的坐标
            x,
            y
        }
        const currentPoint = { // 当前点在img上的坐标
            x: this.sourceX + x / this.scaleSize,
            y: this.sourceY + y / this.scaleSize,
        }

        //操作模式
        if (this.paintType === 0) {
            let {
                checkInShapeResult,
                checkInShapeBorderResult
            } = this.checkCurrentPoint(this.shapes, currentPoint)
            if (checkInShapeBorderResult) {
                this.selectedShape = checkInShapeBorderResult
                this.shapes = this.shapes.map(item => item.id === this.selectedShape.shapeId ? { ...item,
                    selected: true
                } : item)
                this.isSizeChanging = true
            } else if (checkInShapeResult) {
                this.selectedShape = checkInShapeResult
                this.shapes = this.shapes.map(item => item.id === this.selectedShape.shapeId ? { ...item,
                    selected: true
                } : item)
                this.isPositionChanging = true
            } else {
                this.isDragging = true
            }
            this.draw()
            this.temporaryData.push({
                x,
                y
            })
        }

        //绘制矩形
        if (this.paintType === 1) {
            this.shapes.push({
                id: len,
                x,
                y,
                w: 0,
                h: 0,
                color: this.currentStrokeStyle,
                paintType: this.paintType,
            })
        }

        //绘制圆形
        if (this.paintType === 2) {
            this.shapes.push({
                id: len,
                x,
                y,
                r: 0,
                color: this.currentStrokeStyle,
                paintType: this.paintType,
            })
        }

        //绘制多边形
        if (this.paintType === 3) {
            const INIT = { // 初始数据
                id: len,
                points: [currentPoint],
                paintType: this.paintType,
                isCompleted: false,
                color: this.currentStrokeStyle
            }
            if (len === 0 || this.shapes[len - 1].paintType !== 3 || (this.shapes[len - 1].paintType === 3 && this.shapes[len - 1].isCompleted)) {
                this.shapes.push(INIT)
            } else {
                const polygon = this.shapes[len - 1]
                if (this.isPainting) {
                    let points = polygon.points
                    const sPoint = points[0]
                    const distance = Math.sqrt(Math.pow(sPoint.x - currentPoint.x, 2) + Math.pow(sPoint.y - currentPoint.y, 2)) * this.scaleSize
                    if (points.length > 2 && distance < 30) {
                        polygon.isCompleted = true
                        this.isPainting = false
                        points = points.slice(0, -1)
                    }
                    this.shapes[len - 1] = {
                        ...polygon,
                        points
                    }
                }
            }
            this.draw()
        }

        //绘制点
        if (this.paintType === 4) {
            this.shapes.push({
                id: len,
                ...currentPoint,
                color: this.currentStrokeStyle,
                paintType: this.paintType,
            })
            this.draw()
        }
    }

    //鼠标移动事件
    onMouseMove(e) {
        const paintType = this.paintType
        const startPoint = this.startPoint
        const canvasWidth = this.canvasWidth
        const canvasHeight = this.canvasHeight
        const imgWidth = this.imgWidth
        const imgHeight = this.imgHeight
        const isPainting = this.isPainting
        const isDragging = this.isDragging
        const isSizeChanging = this.isSizeChanging
        const isPositionChanging = this.isPositionChanging
        const selectedShape = this.selectedShape
        const shapes = this.shapes
        const scaleSize = this.scaleSize
        const sourceX = this.sourceX
        const sourceY = this.sourceY
        const temporaryData = this.temporaryData
        if (isPainting && this.paintType !== 0) {
            const width = Math.abs(e.offsetX - startPoint.x)
            const height = Math.abs(e.offsetY - startPoint.y)
            const lastShape = shapes[shapes.length - 1]
            if (paintType === 3) { //多边形
                if (lastShape.paintType === 3 && !lastShape.isCompleted) {
                    lastShape.points[lastShape.points.length - 1] = {
                        x: sourceX + e.offsetX / scaleSize,
                        y: sourceY + e.offsetY / scaleSize,
                    }
                    this.shapes[shapes.length - 1] = {
                        ...lastShape
                    }
                }
            } else if (paintType === 1) { //矩形
                const x = e.offsetX < startPoint.x ? e.offsetX : startPoint.x
                const y = e.offsetY < startPoint.y ? e.offsetY : startPoint.y
                this.shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: sourceX + x / scaleSize,
                    y: sourceY + y / scaleSize,
                    w: width / scaleSize,
                    h: height / scaleSize,
                }
            } else if (paintType === 2) { //圆形
                let radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
                this.shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: sourceX + startPoint.x / scaleSize,
                    y: sourceY + startPoint.y / scaleSize,
                    r: radius / scaleSize,
                }
            } else if (paintType === 4) { //点
                this.shapes[shapes.length - 1] = {
                    ...shapes[shapes.length - 1],
                    x: sourceX + e.offsetX / scaleSize,
                    y: sourceY + e.offsetY / scaleSize,
                }
            }
            this.draw()
        } else if (paintType === 0) {
            let {
                checkInShapeBorderResult
            } = this.checkCurrentPoint(shapes, {
                x: sourceX + e.offsetX / scaleSize,
                y: sourceY + e.offsetY / scaleSize
            })
            if (isDragging && !selectedShape) { //拖动整体
                let distanceX = (e.offsetX - temporaryData[temporaryData.length - 1].x) / scaleSize
                let distanceY = (e.offsetY - temporaryData[temporaryData.length - 1].y) / scaleSize
                this.sourceX = sourceX - distanceX
                this.sourceY = sourceY - distanceY

                // 临界点控制
                if (this.sourceX < 0) {
                    this.sourceX = 0
                }
                if (this.sourceY < 0) {
                    this.sourceY = 0
                }
                if (this.sourceX > imgWidth - canvasWidth / scaleSize) {
                    this.sourceX = imgWidth - canvasWidth / scaleSize
                }
                if (this.sourceY > imgHeight - canvasHeight / scaleSize) {
                    this.sourceY = imgHeight - canvasHeight / scaleSize
                }
                this.draw()
                this.temporaryData.push({
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
                            this.shapes[index] = {
                                ...item,
                                x: item.x + distanceX,
                                y: item.y + distanceY,
                            }
                        } else {
                            for (let i = 0; i < item.points.length; i++) {
                                let p = item.points[i]
                                if (i === selectedShape.pointId) {
                                    this.shapes[index].points[i] = {
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
                this.draw()
                this.temporaryData.push({
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
                        this.isSizeChanging = false
                        this.canvas.style.cursor = 'auto'
                    }
                    if (Math.abs(distanceY) < sShape.h) {
                        if (u || ul || ur) {
                            sShape.y = sShape.y + distanceY
                            sShape.h = sShape.h - distanceY
                        } else if (d || dl || dr) {
                            sShape.h = sShape.h + distanceY
                        }
                    } else {
                        this.isSizeChanging = false
                        this.canvas.style.cursor = 'auto'
                    }
                } else if (sShape.paintType === 2) {
                    const distance1 = Math.sqrt(Math.pow(sourceX + (currentPoint.x / scaleSize) - sShape.x, 2) + Math.pow(sourceY + (currentPoint.y / scaleSize) - sShape.y, 2))
                    const distance2 = Math.sqrt(Math.pow(sourceX + (lastPoint.x / scaleSize) - sShape.x, 2) + Math.pow(sourceY + (lastPoint.y / scaleSize) - sShape.y, 2))
                    sShape.r = sShape.r + distance1 - distance2
                }
                this.shapes = shapes.map(item => item.id === sShape.id ? sShape : item)
                this.draw()
                this.temporaryData.push({
                    x: e.offsetX,
                    y: e.offsetY
                })
            }
        }
    }

    //鼠标弹起事件
    onMouseUp(e) {
        if (this.paintType !== 3) {
            let cPoint = {
                x: e.offsetX,
                y: e.offsetY
            }
            // console.log(cPoint, startPoint)
            if ((this.paintType === 1 || this.paintType === 2) && this.isPainting && (cPoint.x === this.startPoint.x && cPoint.y === this.startPoint.y)) {
                this.shapes.pop()
                console.log(this.shapes)
            }
            this.isPainting = false
            this.isDragging = false
            if (this.paintType != 0) {
                this.temporaryData = []
            }
        } else {
            const lastShape = this.shapes[this.shapes.length - 1]
            if (this.isPainting && !lastShape.isCompleted) {
                this.shapes[this.shapes.length - 1].points.push({
                    x: this.sourceX + e.offsetX / this.scaleSize + 1,
                    y: this.sourceY + e.offsetY / this.scaleSize + 1,
                })
            }
        }
        this.isPositionChanging = false
        this.isSizeChanging = false
        this.selectedShape = null
        this.shapes = this.shapes.map(item => ({ ...item,
            selected: false
        }))
        this.draw()

    }

    //鼠标离开区域事件
    onMouseOut(e) {
        // console.log(e.offsetX,e.offsetY)
        if (this.paintType !== 3) {
            this.isPainting = false
        }
        this.isDragging = false
        this.isPositionChanging = false
        // temporaryData = []
    }

    //键盘按下事件
    onKeyDown(e) {
        console.log(e.keyCode, this)
        switch (e.keyCode) {
            case 32: //空格 切换操作模式
                this.toggleActionMode(0)
                break
            case 37: //←
                this.moveLeft()
                break
            case 38: //↑
                this.moveUp()
                break
            case 39: //→
                this.moveRight()
                break
            case 40: //↓
                this.moveDown()
                break
            case 46: //delete
                this.reset()
                break
            case 69: //E 切换为多边形
                this.toggleActionMode(3)
                break
            case 81: //Q 切换为矩形
                this.toggleActionMode(1)
                break
            case 82: //R 切换为点
                this.toggleActionMode(4)
                break
            case 87: //W  切换为圆形
                this.toggleActionMode(2)
                break
            case 187: //＋
            case 107: //＋
                this.zoom('enlarge')
                break
            case 189: //－
            case 109: //－
                this.zoom('narrow')
                break
        }
    }

    //切换操作模式
    toggleActionMode(mode) {
        this.paintType = mode
        this.canvas.style.cursor = 'crosshair'
        if (mode !== 3) {
            this.isPainting = false
            this.filterUncompletedPolygon()
        }
    }

    //过滤未完成多边形
    filterUncompletedPolygon() {
        this.shapes = this.shapes.filter(item => item.paintType !== 3 || (item.paintType === 3 && item.isCompleted))
    }


    // 绘制多边形时  检查当前线段是否与已有线段交叉
    // toggleActionMode  (points, point) {

    // }

    // 动态设置鼠标样式
    checkCurrentPoint(points, cPoint) {
        let checkInShapeResult = false
        let checkInShapeBorderResult = false
        for (let i = points.length - 1; i >= 0; i--) {
            if (this.checkInShapeBorder(points[i], cPoint)) {
                checkInShapeBorderResult = this.checkInShapeBorder(points[i], cPoint)
                break
            }
            if (this.checkInShape(points[i], cPoint)) {
                checkInShapeResult = this.checkInShape(points[i], cPoint)
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
                this.canvas.style.cursor = 'nw-resize'
            }
            if (dl) {
                this.canvas.style.cursor = 'ne-resize'
            }
            if (ur) {
                this.canvas.style.cursor = 'nesw-resize'
            }
            if (dr) {
                this.canvas.style.cursor = 'nwse-resize'
            }
            if (l) {
                this.canvas.style.cursor = 'w-resize'
            }
            if (r) {
                this.canvas.style.cursor = 'e-resize'
            }
            if (u) {
                this.canvas.style.cursor = 'n-resize'
            }
            if (d) {
                this.canvas.style.cursor = 's-resize'
            }
            if (aroundBorder) {
                this.canvas.style.cursor = 'all-scroll'
            }
        } else if (checkInShapeResult) {
            this.canvas.style.cursor = 'all-scroll'
        } else {
            this.canvas.style.cursor = 'auto'
        }
        return {
            checkInShapeResult,
            checkInShapeBorderResult
        }
    }

    // 检查当前点是否在形状内
    checkInShape(shape, point) {
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
                if (distance * this.scaleSize <= 20) {
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
            if (distance * this.scaleSize <= 10) {
                return {
                    paintType: shape.paintType,
                    shapeId: shape.id,
                }
            }
        }
    }

    // 检查是否在图形边缘
    checkInShapeBorder(shape, point) {
        let x1 = shape.x
        let x2 = point.x
        let y1 = shape.y
        let y2 = point.y
        let w = shape.w
        let h = shape.h
        const scaleSize = this.scaleSize
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

    //切换颜色
    onColorChange(e) {
        const v= e.target.value
        this.isPainting = false
        this.filterUncompletedPolygon()
        this.currentStrokeStyle = v
    }

    //缩放
    zoom(tag) {
        const currentWidth = this.canvasWidth / this.scaleSize
        const currentHeight = this.canvasHeight / this.scaleSize
        if (tag === 'enlarge') { //放大
            this.scaleSize = this.scaleSize * 1.2
        }
        if (tag === 'narrow') { //缩小
            this.scaleSize = this.scaleSize / 1.2
            if (this.scaleSize < 1) {
                this.scaleSize = 1
            }
        }
        const ss = this.scaleSize
        const cw = this.canvasWidth
        const ch = this.canvasHeight
        const iw = this.imgWidth
        const ih = this.imgHeight
        this.sourceX = this.sourceX + (currentWidth - cw / ss) / 2
        this.sourceY = this.sourceY + (currentHeight - ch / ss) / 2
        const sx = this.sourceX
        const sy = this.sourceY
        if (sx > iw - cw / ss) {
            this.sourceX = iw - cw / ss
        }
        if (sy > ih - ch / ss) {
            this.sourceY = ih - ch / ss
        }
        if (sx < 0) {
            this.sourceX = 0
        }
        if (sy < 0) {
            this.sourceY = 0
        }
        this.draw()
    }

    //图片右移
    moveRight() {
        const ss = this.scaleSize
        const cw = this.canvasWidth
        const iw = this.imgWidth
        const speed = this.scrollSpeed
        let sx = this.sourceX - speed / ss
        if (0 <= sx && sx <= (iw - cw / ss)) {
            this.sourceX = sx
        } else {
            this.sourceX = 0
        }
        this.draw()
    }

    //图片左移
    moveLeft() {
        const ss = this.scaleSize
        const cw = this.canvasWidth
        const iw = this.imgWidth
        const speed = this.scrollSpeed
        let sx = this.sourceX + speed / ss
        if (0 <= sx && sx <= (iw - cw / ss)) {
            this.sourceX = sx
        } else {
            this.sourceX = iw - cw / ss
        }
        this.draw()
    }

    //图片上移
    moveUp() {
        const ss = this.scaleSize
        const ch = this.canvasHeight
        const ih = this.imgHeight
        const speed = this.scrollSpeed
        let sy = this.sourceY + speed / ss
        if (0 <= sy && sy <= (ih - ch / ss)) {
            this.sourceY = sy
        } else {
            this.sourceY = ih - ch / ss
        }
        this.draw()
    }

    //图片下移
    moveDown() {
        const ss = this.scaleSize
        const ch = this.canvasHeight
        const ih = this.imgHeight
        const speed = this.scrollSpeed
        let sy = this.sourceY - speed / ss
        if (0 <= sy && sy <= (ih - ch / ss)) {
            this.sourceY = sy
        } else {
            this.sourceY = 0
        }
        this.draw()
    }

    //绘制矩形
    drawRect(rect) {
        let {
            x,
            y,
            w,
            h,
            color,
            selected,
        } = rect
        if (selected) {
            this.ctx.setLineDash([5, 5])
        } else {
            this.ctx.setLineDash([1, 0])
        }
        x = (x - this.sourceX) * this.scaleSize
        y = (y - this.sourceY) * this.scaleSize
        w = w * this.scaleSize
        h = h * this.scaleSize
        this.ctx.beginPath()
        this.ctx.strokeStyle = selected ? this.selectedStyle : color
        this.ctx.strokeRect(x, y, w, h)
    }

    //绘制圆形
    drawCircle(circle) {
        let {
            x,
            y,
            r,
            color,
            selected
        } = circle
        if (selected) {
            this.ctx.setLineDash([5, 5])
        } else {
            this.ctx.setLineDash([1, 0])
        }
        x = (x - this.sourceX) * this.scaleSize
        y = (y - this.sourceY) * this.scaleSize
        r = r * this.scaleSize
        this.ctx.beginPath()
        this.ctx.strokeStyle = selected ? this.selectedStyle : color
        this.ctx.moveTo(x + r, y)
        this.ctx.arc(x, y, r, 0, Math.PI * 2)
        this.ctx.stroke()
    }

    //绘制线段
    drawLine(sPoint, ePoint, color, selected) {
        sPoint = {
            ...sPoint,
            x: (sPoint.x - this.sourceX) * this.scaleSize,
            y: (sPoint.y - this.sourceY) * this.scaleSize,
        }
        ePoint = {
            ...ePoint,
            x: (ePoint.x - this.sourceX) * this.scaleSize,
            y: (ePoint.y - this.sourceY) * this.scaleSize,
        }
        if (selected) {
            this.ctx.setLineDash([5, 5])
        } else {
            this.ctx.setLineDash([1, 0])
        }
        this.ctx.beginPath()
        this.ctx.strokeStyle = selected ? this.selectedStyle : color
        this.ctx.moveTo(sPoint.x, sPoint.y)
        this.ctx.lineTo(ePoint.x, ePoint.y)
        this.ctx.stroke()
    }

    //绘制多边形
    drawBrokenLine(polygon) {
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
            this.drawCircle({
                x,
                y,
                r,
                selected,
                color
            })
            if (index > 0 && index < points.length) {
                this.drawLine(points[index - 1], point, color, selected)
            }
        })
        if (isCompleted) {
            this.drawLine(points[points.length - 1], points[0], color, selected)
        }
    }

    //绘制全部
    draw() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.drawOwnImage()
        this.ctx.beginPath()
        this.drawShapes()
    }

    //绘制当前图形
    drawOwnImage() {
        this.ctx.drawImage(this.img, this.sourceX, this.sourceY, this.canvasWidth / this.scaleSize, this.canvasHeight / this.scaleSize, 0, 0, this.canvasWidth, this.canvasHeight)
    }

    //绘制所有图形
    drawShapes() {
        if (this.shapes.length > 0) {
            for (let index = 0; index < this.shapes.length; index++) {
                let item = this.shapes[index]
                if (item.paintType === 1) {
                    this.drawRect(item)
                }
                if (item.paintType === 2) {
                    this.drawCircle(item)
                }
                if (item.paintType === 3) {
                    this.drawBrokenLine({
                        ...item,
                        r: 3
                    })
                }
                if (item.paintType === 4) {
                    this.drawCircle({
                        ...item,
                        r: 3,
                    })
                }
            }
        } else {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.drawOwnImage()
        }
    }

}