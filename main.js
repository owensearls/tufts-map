function color(owner) {
  if (owner == null) {
    return "none"
  }
  else if (owner.search('TUFTS') != -1) {
    return "blue"
  } else if (owner.search('WALNUT') != -1) {
    return "red"
  } else {
    return "none"
  }
}

var width = 700,
    height = 700;

var svg = d3.select("div#map").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr('viewBox', `0 0 700 700`)
            .attr('preserveAspectRatio', 'xMinYMid');

var projection = d3.geoAlbers()
    .rotate([71.118,0])
    .center([0, 42.406])
    .scale(2700000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

Promise.all([
  d3.json("data/tufts-medford.geojson"),
  d3.json("data/tufts-somerville.geojson"),
]).then(render);

function render(data) {
  let test = data.map(x => x.features)
  svg.append("g")
    .selectAll("path")
    .data([].concat.apply([], data.map(x => x.features)))
    .enter().append("path")
      .attr("stroke", "black")
      .attr("fill", function (d) {return color(d.properties.OWNER1)})
      .attr("d", path);
}
