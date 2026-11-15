function color(owner) {
  if (/TUFTS/i.test(owner)) {
    return "#417dc1"
  } else if (/WALNUT/i.test(owner)) {
    return "#F03A47"
  } else {
    return "none"
  }
}

// MassGIS fiscal-year vintages available for each city. Medford and
// Somerville don't publish every year, so a year missing for one city
// falls back to that city's closest earlier (or else later) vintage.
var vintages = {
  medford:    [2012, 2019, 2020, 2023, 2024, 2025, 2026],
  somerville: [2013, 2019, 2020, 2021, 2023, 2024, 2025],
};
var years = Array.from(new Set([].concat(vintages.medford, vintages.somerville)))
  .sort((a, b) => b - a);

function vintageFor(city, year) {
  var list = vintages[city];
  var earlier = list.filter(y => y <= year);
  return earlier.length ? Math.max.apply(null, earlier) : Math.min.apply(null, list);
}

var height = 1000,
    width = 2000;

var controls = d3.select("div#map").append("div")
    .style("position", "absolute")
    .style("top", "10px")
    .style("left", "10px")
    .style("font", "14px sans-serif")
    .style("background", "rgba(255,255,255,0.9)")
    .style("padding", "6px 10px");

controls.append("label").text("Fiscal year ");
var select = controls.append("select")
    .on("change", function () { load(+this.value); });
select.selectAll("option")
    .data(years)
    .enter().append("option")
      .attr("value", d => d)
      .text(d => "FY" + d);
var note = controls.append("div").style("font-size", "12px");

var svg = d3.select("div#map").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMid');

var projection = d3.geoAlbers()
    .rotate([71.118,0])
    .center([0, 42.4067])
    .scale(5700000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var layer = svg.append("g");

function load(year) {
  var cities = ["medford", "somerville"];
  var used = cities.map(c => vintageFor(c, year));
  note.text(cities
    .map((c, i) => used[i] != year ? `${c[0].toUpperCase() + c.slice(1)}: FY${used[i]} data` : null)
    .filter(x => x)
    .join(", "));
  Promise.all(cities.map((c, i) => d3.json(`data/${used[i]}/tufts-${c}.json`)))
    .then(render);
}

function render(data) {
  map = [].concat.apply([], data.map(x => x.features));
  var paths = layer.selectAll("path").data(map);
  paths.exit().remove();
  paths.enter().append("path")
      .attr("stroke", "black")
    .merge(paths)
      .attr("fill", function (d) {return color(d.properties.OWNER1)})
      .attr("d", path);

  console.log(map
    .filter(x => color(x.properties.OWNER1) != "none")
    .map(x => (x.properties.TOTAL_VAL))
    .reduce((x, y) => x + y));
}

load(years[0]);
