SVIFT.render = function(){

  console.log("0.0.5");

  var module = {};

  var state = {
    init: false,
    setup: false,
    gif: false,
    gifStep: 0
  },
  width = 500, 
  height = 500,
  container,
  data, vis, gif, storage = {};

  var css = [
    ["fill","fill"],
    ["font-family","fontFamily"],
    ["font-size","fontSize"],
    ["font-weight","fontWeight"],
    ["text-anchor","textAnchor"],
    ["stroke","stroke"],
    ["stroke-width","strokeWidth"]
  ];

  var config = {
    "video":{
      "size":{
        "width":500,
        "height":500
      },
      "scale":{
        "width":500,
        "height":500
      },
      frames: 100
    },
    "sizes":[
      {
        "file": "instagram",
        "name": "Instagram",
        "size":{
          "width":540,
          "height":540
        },
        "scale":{
          "width":1080,
          "height":1080
        }
      },
      {
        "file": "linkedin",
        "name":"LinkIn",
        "size":{
          "width":700,
          "height":400
        },
        "scale":{
          "width":1400,
          "height":800
        }
      },
      {
        "file": "google",
        "name":"Google+",
        "size":{
          "width":497,
          "height":373
        },
        "scale":{
          "width":994,
          "height":746
        }
      },
      {
        "file": "tumblr",
        "name":"Tumblr",
        "size":{
          "width":640,
          "height":960
        },
        "scale":{
          "width":1280,
          "height":1920
        }
      },
      {
        "file": "pinterest",
        "name":"Pinterest",
        "size":{
          "width":600,
          "height":600
        },
        "scale":{
          "width":1200,
          "height":1200
        }
      },
      {
        "file": "twitter",
        "name":"Twitter",
        "size":{
          "width":512,
          "height":256
        },
        "scale":{
          "width":1024,
          "height":512
        }
      },
      {
        "file": "snapchat",
        "name":"Snapchat",
        "size":{
          "width":476,
          "height":810
        },
        "scale":{
          "width":952,
          "height":1620
        }
      },
      {
        "file": "facebook",
        "name":"Facebook",
        "size":{
          "width":600,
          "height":315
        },
        "scale":{
          "width":1200,
          "height":630
        }
      },
      {
        "file": "horizontal",
        "name":"Horizontal / Landscape",
        "size":{
          "width":1024,
          "height":512
        },
        "scale":{
          "width":2048,
          "height":1024
        }
      },
      {
        "file": "vertical",
        "name":"Vertical / Portrait",
        "size":{
          "width":800,
          "height":1200
        },
        "scale":{
          "width":1600,
          "height":2400
        }
      },
      {
        "file": "square",
        "name":"Square",
        "size":{
          "width":512,
          "height":512
        },
        "scale":{
          "width":1024,
          "height":1024
        }
      }
    ]
  };

  var configKeys = {};

  config.sizes.forEach(function(size, i){
    configKeys[size.file] = i;
  });

 /*
  * This function sets up an offscreen rendering canvas and svg
  */

  module.init = function(){
    if(!state.running){
      state.running = true;
  
      container = d3.select("body")
        .append("div")
          .attr("id", "offscreen-svg")
          //.style("display", "none");
          .style("visibility", "hidden")
          .style("pointer-events", "none")
          .style("top", 0)
          .style("left", 0)
          .style("z-index", 999)
          .style("position", "absolute");
      
      // set default width/height 
      module.resizeSVG(width, height, 0, 0);
    }
  };

  /*
 * Setup visualisation in the offscreen svg, based on the data's configuration info
 */
  module.setupVis = function(_data){
    state.setup = true;
    data = _data;

    container.select('svg').remove();

    // if(custom){
    //   data["custom"] = custom;
    // }

    vis = SVIFT.vis[data.vis.type](data, container);
    vis.setScale(true);
    vis.init();
    //vis.start();
    vis.setScale(false);
  };

  /*
  * Move the playhead in the visualisation to the designated keyFrame (integer >= 0)
  */
  module.drawSVG = function(keyFrame){
    vis.goTo(keyFrame);
    //v.reset();
  };

  /*
  * Resize svg pixelWidth/pixelHeight for output size, renderWidth/renderHeight for internal size
  */
  module.resizeSVG = function(renderWidth, renderHeight, pixelWidth, pixelHeight){
    if(state.setup){

      vis.setScale(false);

      container.select('svg')
        .style('width', renderWidth + "px")
        .style('height', renderHeight + "px");
      
      vis.preResize();
      
      vis.setScale(true);

      container.select('svg')
        .style('width', pixelWidth + "px")
        .style('height', pixelHeight + "px");
      
      vis.preResize();

    } else {
      container.select('svg')
        .style('width', renderWidth + "px")
        .style('height', renderHeight + "px");
    }
  };

  module.inlineCSS = function() {
    d3.select('#offscreen-svg svg')
      .style('visibility', 'visible');

    d3.selectAll('#offscreen-svg svg g, #offscreen-svg svg text, #offscreen-svg svg path, #offscreen-svg svg rect, #offscreen-svg svg circle, #offscreen-svg svg line, #offscreen-svg svg ellipse, #offscreen-svg svg tspan, #offscreen-svg svg title').each(function(d,i){
      var that = d3.select(this);
      var styles = window.getComputedStyle(that.node());

      css.forEach(function(c){
        var value = styles[c[1]];
        if(that.attr(c[0]) !== null){
          value = that.attr(c[0]);
        }
        that.style(c[0], value);
      });
    });
  };

  /*
  * provide a filename from the config and a download will be created
  */
  module.downloadPNG = function(type){
    if (state.setup && state.running && !state.gif) {

      var tConfig = config.sizes[configKeys[type]];
      module.resizeSVG(tConfig.size.width, tConfig.size.height, tConfig.scale.width, tConfig.scale.height);
      module.drawSVG(1);
      module.inlineCSS();

      module.toDataURL(function(data) {

        //.replace("image/png", "image/octet-stream")
        var link = document.createElement('a');
        link.download = type + ".png";
        link.href = data;
        link.click();

      });
    } else {
      console.log('Either render not initialised or currently rendering a GIF.');
    }
  };

  /*
  * Returns the content of the offscreen SVG as a PNG
  */
  module.toDataURL = function(callback) {
    toDataURL(document.getElementById('offscreen-svg').children[0], "image/png", {
      callback: callback
    });
  };

  /*
  * Generate a gif
  */
  module.buildGif = function(){
    if (state.setup && state.running && !state.gif) {

      state.gif = true;
      state.gifStep = 0;

      module.resizeSVG(config.video.size.width, config.video.size.height, config.video.scale.width, config.video.scale.height);
      vis.reset();

      gif = new GIF({
        workers: 3,
        quality: 0.5,
        repeat: 0,
        width: config.video.size.width,
        height: config.video.size.height
      }).on("progress", function (p) {
        console.log("progress", p);
      }).on("finished", function (blob) {
        console.log("finished");
        
        var link = document.createElement('a');
        link.download = "animation.gif";
        link.href = URL.createObjectURL(blob);
        link.click();

        state.gif = false;

      });

      module.addFrame();
    }
  };

  module.addFrame = function() {
    module.drawSVG(state.gifStep/config.video.frames);
    module.inlineCSS();

    module.toDataURL(function(data) {

      var img = new Image();
      img.crossOrigin = "*";
        
      img.onload = function() {
        gif.addFrame(img, {
          delay: 1,
          copy: true
        });

        state.gifStep++;

        if(state.gifStep >= config.video.frames){
          gif.render();
        }else{
          module.addFrame();
        }
      };

      img.src = data;

    });
  };

  /*
  * Generate a download request for the GIF
  */
  module.downloadGIF = function(){
  };

  /*
  * Returns the current render status for progress display
  */
  module.getStatus = function(){
  };

  /*

  DOWNLOAD SVG

  var svg_root = document.getElementById('your_svg_root_element_here');
var svg_source = svg_root.outerHTML;
var svg_data_uri = 'data:image/svg+xml;base64,' + btoa(svg_source);
var link = document.getElementById('anchor_element');
link.setAttribute('href', svg_data_uri);

  */

  return module;

}();

/*

  var v;

  function resize(){
    v.preResize();
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
