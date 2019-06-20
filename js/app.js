var OlympicResults;
var chartGroup;
var width;
var height;

// convert results into seconds
function magic(time) {
  if (typeof time == "number") {
    return time;
  }

  // strip wind factors
  var lastcomma = time.lastIndexOf(",");
  if (lastcomma >= 0) {
    time = time.slice(0, lastcomma)
  }

  var lastcolon = time.lastIndexOf(":");
  var sec = parseFloat(time.slice(lastcolon + 1));
  if (lastcolon < 0) {
    return sec
  }

  time = time.slice(0, lastcolon);

  var min = parseFloat(time.slice(-2));
  if (!isNaN(min)) {
    sec += (min * 60)
  }

  var hrs = parseFloat(time.slice(0, -3));
  if (!isNaN(hrs)) {
    sec += (hrs * 3600)
  }
  return sec;
}

// get distance in m from the event name
function dist(name) {
  var firstspace = name.indexOf(" ");
  name = name.slice(0, firstspace);
  if (name == "Marathon") {
    return 42195
  }
  var distance = parseFloat(name);
  if (name.indexOf("K") > 0) {
    distance *= 1000
  }
  return distance
}

// The buildPlot 1 function doesn't work yet
// Plot for ALL years of a specified event
// GOAL  var list = [{year, location, medal, name, nationality, result, speed}, {}, {}]
function buildPlot1(event) {
  var plotData = [];

  var a = OlympicResults.find(e => e.name == event);
  a.games.forEach(g => {
    var year = g.year;
    var location = g.location;
    g.results.forEach(r => {
      var medal = r.medal;
      var name = r.name;
      var nationality = r.nationality;
      var result = r.result;
      var speed = r.speed;

      plotData.push({
        'year': year,
        'location': location,
        'medal': medal,
        'name': name,
        'nationality': nationality,
        'result': result,
        'speed': speed
      })
    })
  });
  console.log(plotData)
// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.year)-5, d3.max(plotData, d => d.year)+5])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.speed)*0.9, d3.max(plotData, d => d.speed)*1.1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles and Text
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(plotData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.year))
    .attr("cy", d => yLinearScale(d.speed))
    .attr("r", "10")
    .attr("opacity", ".5")
    .attr("class", "stateCircle");

    var textGroup = chartGroup.selectAll()
    .data(plotData)
    .enter()
    .append("text")
    .text(d => d.medal)
    .attr("x", d => xLinearScale(d.year))
    .attr("y", d => yLinearScale(d.speed)+5)
    .attr("fill", "white")
    .attr("opacity", "0.8")
    .attr("class", "stateText")
    ;

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.location} ${d.year}<br>${d.name}<br>result: ${d.result}<br>speed: ${d.speed} m/s`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Speed");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Smokers");







  // });
};

// Year range: 1896 - 2016


// init put the svg in the right html id, 
// cleans the data (removes field-type events and called magic function to change results/times to matching format)
// sets eventselector and calls eventChanged
function init() {
  var eventSelector = d3.select("#selEvent");

  var svgWidth = 785;
  var svgHeight = 500;
  var margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 15
  };

  width = svgWidth - margin.left - margin.right;
  height = svgHeight - margin.top - margin.bottom;

  var svg = d3
    .select("#plot")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    ;

  chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    ;

  var exclusions = ["Hurdles", "Relay", "Shot", "Pole", "Jump", "Throw", "Steeplechase", "Decathlon", "Heptathlon"];

  d3.json("data/results.json").then((data) => {
    OlympicResults = data

      // remove events that are in my "exclusions" list
      .filter(event => !exclusions.find(n => event.name.includes(n)))

      // add a distance field, remove where results is NONE, change time to seconds, add speed field (m/s)
      .map(event => {
        event.distance = dist(event.name);
        event.games = event.games.map(game => {
          game.results = game.results
            .filter(result => result.result)
            .map(result => {
              result.result = magic(result.result);
              result.speed = event.distance / result.result;
              return result
            })
          return game
        })
        return event
      });

    console.log(OlympicResults);

    OlympicResults.forEach((o) => {
      eventSelector
        .append("option")
        .text(o.name)
        .property("value", o.name);
    });

    const firstEvent = data[0];

    eventChanged(firstEvent.name);
  });
}

// changes what options appear in the yearSelector when the event is changed.
// calls yearChanged
function eventChanged(newEvent) {
  var yearSelector = d3.select("#selYear");
  yearSelector.html('<option value="all">ALL</option>');
  d3.json("data/results.json").then((data) => {
    data
      .find((o) => o.name == newEvent)
      .games
      .map(g => g.year)
      .sort((a, b) => a - b)
      .forEach((year) => {
        yearSelector
          .append("option")
          .text(year)
          .property("value", year);
      });

    yearChanged(newEvent, 'all');
  });
}

// This doesn't work yet
// need to add concept of "ALL"
// calls buildPlot
function yearChanged(event, year) {
  if (year == 'all') {
    buildPlot1(event)
  }
  else {
    buildPlot2(event, year)
  }
}

init();
