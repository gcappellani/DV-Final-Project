var canvasWidth = 1000;
var canvasHeight = 180;
var margin = { top: 5, right: 40, bottom: 20, left: 180 };

var svg = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", 50)

var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.top - margin.bottom;

svg.append("text")
    .attr("x", width/3)
    .attr("y", 30)
    .attr("font-size", "24px")
    .attr("font-family", "sans-serif")
    .text("Eminem productivity and relation with his public overtime")

var xScale = d3.scaleBand().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var parseTime = d3.timeParse("%m/%d/%y")
var formatYear = d3.timeFormat("%Y")

d3.csv("https://raw.githubusercontent.com/gcappellani/DV-Final-Project/main/data/eminem.csv",
    function(d) {
        return {
            date: d['album_released'],
            ntracks: +d['number_of_songs'],
            liveness: +d['liveness'],
            sales: +d['total_sales_US'].replace(/,/g, "")
        }
    }).then( function(data) {

    for (d of data) { d.date = formatYear(parseTime(d.date)) }


    var releasing_dates = [...new Set(data.map(d => d.date))]
    releasing_dates.sort()
    xScale.domain(releasing_dates)

    function showLinechart(feature, featurename) {
        temp = {}
        maxCount = 0
        for (d of data) {
            if (feature(d) > maxCount) { maxCount = feature(d) }
            temp[d.date] = feature(d)
        }
        grouped_data = []
        for (date of releasing_dates) { grouped_data.push([date, temp[date]])}

        yScale.domain([0, maxCount])

        var svg = d3.select("body").append("svg")
            .attr("width",  canvasWidth)
            .attr("height", canvasHeight)

        var container_g = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

        // Display the X-axis
        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", 50)
            .attr("x", width/2)


        // Display the Y-axis
        container_g.append("g")
            .call(d3.axisLeft(yScale).ticks(5))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x", -50)
            .attr("stroke", "black")
            .attr("fill", "black")
            .attr("font-size", "15px")
            .text(featurename)


        var line = d3.line()
            .x(function(d) { return xScale(d[0]) + xScale.bandwidth()/2; })
            .y(function(d) { return yScale(d[1]); })
            .curve(d3.curveMonotoneX)


        svg.append("path")
            .datum(grouped_data)
            .attr("class", "line")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "rgb(184,72,72)")
            .style("stroke-width", "2")
    }

    showLinechart(d => d.ntracks, 'Tracks per album')
    showLinechart(d => d.liveness, 'Liveness')
    showLinechart(d => d.sales, 'Sales in the US')


})

