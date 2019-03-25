SVIFT.render = {};

SVIFT.render.state = {
  running: false,
  default: {
    vis: {},
    data: {},
    style: {}
  },
  vis: null
};

/*
 * This function sets up an offscreen rendering canvas and svg
 */
SVIFT.render.init = function(){
  if(!SVIFT.render.state.running){
    SVIFT.render.state.running = true;

    SVIFT.render.container = d3.select("body")
      .append("div")
        .attr("id", "offscreen-svg")
        //.style("display", "none");
    
    SVIFT.render.canvas = d3.select("body")
      .append("div")
        .attr("id", "offscreen-svg")
        //.style("display", "none");

  }
};

/*
 * Setup visualisation in the offscreen svg, based on the data's configuration info
 */
SVIFT.render.setupVis = function(data){

  SVIFT.render.state.default.vis.type = data.vis.type;
  SVIFT.render.state.default.data.format = data.data.format;
  SVIFT.render.state.default.data.data = data.data.data;
  SVIFT.render.state.default.data.lables = data.data.lables;
  SVIFT.render.state.default.data.colors = data.data.colors || null; 
  SVIFT.render.state.default.style.theme = data.style.theme;
  SVIFT.render.state.default.style.color.main = data.style.color.main;

  SVIFT.render.container.select('svg').remove();

  SVIFT.render.state.vis = SVIFT.vis[data.vis.type](SVIFT.render.state.default, SVIFT.render.container);
  SVIFT.render.state.vis.setScale(false);
  SVIFT.render.state.vis.init();
  SVIFT.render.state.vis.start();
  SVIFT.render.state.vis.setScale(true);
};

/*
 * Move the playhead in the visualisation to the designated keyFrame (integer >= 0)
 */
SVIFT.render.drawSVG = function(keyFrame){
};

/*
 * Resize svg pixelWidth/pixelHeight for output size, renderWidth/renderHeight for internal size
 */
SVIFT.render.resizeSVG = function(pixelWidth, pixelHeight, renderWidth, renderHeight){
  SVIFT.render.container
    .style('width', pixelWidth)
    .style('height', pixelHeight);
};


/*
 * Copy the current SVG to the PNG
 */
SVIFT.render.drawPNG = function(){
};

/*
 * Store the PNG data in the SVIFT.render.state object for quick download access
 */
SVIFT.render.storePNG = function(key){
};

/*
 * Generate a download request for the data, returns false if image does not exist
 */
SVIFT.render.downloadPNG = function(key){
};

/*
 * Generate a gif
 */
SVIFT.render.buildGif = function(){
};

/*
 * Generate a download request for the GIF
 */
SVIFT.render.downloadGIF = function(){
};

/*
 * Returns the current render status for progress display
 */
SVIFT.render.getStatus = function(){
};


/*

function clear(){
    d3.select('#container').selectAll('*').remove();
    return true;
  }

  var custom = false;

  // CUSTOMJSON

  var v;

  function vis(data){
    clear();
    if(custom){
      data["custom"] = custom;
    }
    v = SVIFT.vis[data.vis.type](data, d3.select('#container'));
    v.init();
    return true;
  }

  function init(step){
    console.log('vis.html:init:'+step);
    v.goTo(step);
    return true;
  }

  function play(){
    v.play();
    return true;
  }

  function reset(){
    v.reset();
    return true;
  }

  function goto(t){
    v.goTo(t);
    return true;
  }

  function setScale(s){
    v.setScale(s);
    return true;
  }

  function resize(){
    v.preResize();
    return true;
  }

  function callback(){
    return true;
  }

  function getSVG(){

    // javascript:javascript: (function () { 
    //   var e = document.createElement('script'); 
    //   e.setAttribute('src', 'https://nytimes.github.io/svg-crowbar/svg-crowbar-2.js'); 
    //   e.setAttribute('class', 'svg-crowbar'); 
    //   document.body.appendChild(e); 
    // })();

    var axis_groups = d3.selectAll('g[text-anchor="middle"]');
    axis_groups.selectAll('text').attr('text-anchor','middle');
    reCalcD(axis_groups);

    axis_groups = d3.selectAll('g[text-anchor="end"]');
    axis_groups.selectAll('text').attr('text-anchor','end');
    reCalcD(axis_groups);

    return d3.select('#container').html();
  }

  function reCalcD(axis){
    axis.each(function(d){
      var axis = d3.select(this);
      var size = axis.attr('font-size');
      axis.selectAll('text').each(function(d){
        var obj = d3.select(this);
        ['y','x'].forEach(function(attr){
          var val = obj.attr('d'+attr);
          if(val){
            if(val.indexOf('em')>=0){
              val = parseFloat(val.substr(0,val.length-2))*size;
            }
            obj.attr('d'+attr, 0);
            var tval = obj.attr(attr);
            if(tval){
              val += parseFloat(tval);
            }
            obj.attr(attr, val);
          }
        })
      });
    });
    return true;
  }

*/