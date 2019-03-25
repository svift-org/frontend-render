SVIFT.render = {};

SVIFT.render.state = {
  init: false,
  setup: false,
  default: null,
  vis: null,
  width: 500, 
  height: 500
};

console.log("0.0.4");

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
        .style("position", "absolute");
    
    // set default width/height 
    SVIFT.render.resizeSVG(SVIFT.render.state.width, SVIFT.render.state.height, 0, 0);

  }
};

/*
 * Setup visualisation in the offscreen svg, based on the data's configuration info
 */
SVIFT.render.setupVis = function(data){
  SVIFT.render.state.setup = true;

  SVIFT.render.state.default = data;

  SVIFT.render.container.select('svg').remove();

  SVIFT.render.state.vis = SVIFT.vis[data.vis.type](SVIFT.render.state.default, SVIFT.render.container);
  SVIFT.render.state.vis.setScale(true);
  SVIFT.render.state.vis.init();
  //SVIFT.render.state.vis.start();
  SVIFT.render.state.vis.setScale(false);

};

/*
 * Move the playhead in the visualisation to the designated keyFrame (integer >= 0)
 */
SVIFT.render.drawSVG = function(keyFrame){
  SVIFT.render.state.vis.goTo(keyFrame);
  //v.reset();
};

/*
 * Resize svg pixelWidth/pixelHeight for output size, renderWidth/renderHeight for internal size
 */
SVIFT.render.resizeSVG = function(pixelWidth, pixelHeight, renderWidth, renderHeight){
  if(SVIFT.render.state.setup){
    SVIFT.render.state.vis.setScale(true);

    SVIFT.render.container
      .style('width', renderWidth + "px")
      .style('height', renderHeight + "px");
    
    SVIFT.render.state.vis.setScale(false);

    SVIFT.render.container
      .style('width', pixelWidth + "px")
      .style('height', pixelHeight + "px");


  } else {
    SVIFT.render.container
      .style('width', pixelWidth + "px")
      .style('height', pixelHeight + "px");
  }
};


/*
 * Copy the current SVG to the PNG
 */
SVIFT.render.drawPNG = function(){
  SVIFT.render.toDataURL(function(data) {

    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = data;
    link.click();

  });
};

/*
 * Returns the content of the offscreen SVG as a PNG
 */
SVIFT.render.toDataURL = function(callback) {
  toDataURL(document.getElementById('offscreen-svg'), "image/png", {
    callback: callback
  });
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

var canvas = document.getElementById("mcanvas");
  image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "my-image.png";
  link.href = image;
  link.click();

*/

/*
 * Generate a gif
 */
SVIFT.render.buildGif = function(){
  var gif = new GIF({
    workers: 3,
    quality: 0.5,
    repeat: 0,
    width: 500,
    height: 500
  }).on("progress", function (p) {
    console.log("progress", p);
  }).on("finished", function (blob) {
    console.log("finished");
    d3.select('#container').append('img')
      .attr("src",URL.createObjectURL(blob))
      .style('width', 500)
      .style('height', 500);
  });

  /*let img = new Image();
    img.crossOrigin = "*";
    
    img.onload = function(){
      gif.addFrame(img, {
        delay: 1,
        copy: true
      });

      added++;
      if(added == 9){
        gif.render();
      }else{
        addFrame();
      }
    };

    img.src = data; */
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

SVIFT.render.config = {
	"video":{
		"size":{
			"width":500,
			"height":500
		},
		"output":{
			"width":500,
			"height":500
		}
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