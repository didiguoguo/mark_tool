import Editor from './editor.js'

const editor = new Editor()
$(document).ready(function (e) {
    let canvas = document.getElementById('canvas')
    let container = document.getElementsByClassName('work_area')[0]
    let tools = {
        reset_tool: document.getElementsByClassName('reset_tool')[0],
        action_tool: document.getElementsByClassName('action_tool')[0],
        color_tool: document.getElementsByClassName('color_tool')[0],
        rect_tool: document.getElementsByClassName('rect_tool')[0],
        circle_tool: document.getElementsByClassName('circle_tool')[0],
        polygon_tool: document.getElementsByClassName('polygon_tool')[0],
        point_tool: document.getElementsByClassName('point_tool')[0],
        enlarge_tool: document.getElementsByClassName('enlarge_tool')[0],
        narrow_tool: document.getElementsByClassName('narrow_tool')[0],
        move_left_tool: document.getElementsByClassName('move_left_tool')[0],
        move_right_tool: document.getElementsByClassName('move_right_tool')[0],
        move_up_tool: document.getElementsByClassName('move_up_tool')[0],
        move_down_tool: document.getElementsByClassName('move_down_tool')[0],
    }
    let img = new Image()
    img.src = './test.png'
    img.onload = function () {
        let w = this.width
        let h = this.height
        let containerWidth = container.offsetWidth
        let containerHeight = container.offsetHeight - 100
        if (w > containerWidth) {
            canvas.width = containerWidth
        } else {
            canvas.width = w
        }
        if (h > containerHeight) {
            canvas.height = containerHeight
        } else {
            canvas.height = h
        }
        editor.init(canvas, tools, img)
    }
})