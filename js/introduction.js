var canvasWidth = 1300;
var canvasHeight = 650;

var svg = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", canvasHeight)

svg.append("text")
    .attr("x", width/2)
    .attr("font-size", "24px")
    .text("Eminem is getting old")