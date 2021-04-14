
// set up SVG for D3
const width = window.screen.width;
const height = window.screen.height;

$("#sharebutton").on('click' , function(){
  // console.log('gggg');
  $("#sharesheet").addClass("show")
})

$("#share img").on('click', function(evt){
  $("#sharesheet").removeClass("show")  
  // console.log('share closed'); 
  evt.stopPropagation();                                                                        
}) 

$('<div/>', {
  class: 'canvastools'
}).appendTo('body')

$('<img/>',{
  src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48cGF0aCBkPSJNMjU2LDQ4QzE0MS4xLDQ4LDQ4LDE0MS4xLDQ4LDI1NnM5My4xLDIwOCwyMDgsMjA4YzExNC45LDAsMjA4LTkzLjEsMjA4LTIwOFMzNzAuOSw0OCwyNTYsNDh6IE0zODQsMjY1SDI2NHYxMTloLTE3VjI2NSAgIEgxMjh2LTE3aDExOVYxMjhoMTd2MTIwaDEyMFYyNjV6Ii8+PC9nPjwvc3ZnPg==",
  onclick: "addnodes()",
  class: 'addNodes'
}).appendTo('.canvastools');

$('<img/>',{
  src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGlkPSJHbHlwaCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xMywxNmMwLDEuNjU0LDEuMzQ2LDMsMywzczMtMS4zNDYsMy0zcy0xLjM0Ni0zLTMtM1MxMywxNC4zNDYsMTMsMTZ6IiBpZD0iWE1MSURfMjk0XyIvPjxwYXRoIGQ9Ik0xMywyNmMwLDEuNjU0LDEuMzQ2LDMsMywzczMtMS4zNDYsMy0zcy0xLjM0Ni0zLTMtM1MxMywyNC4zNDYsMTMsMjZ6IiBpZD0iWE1MSURfMjk1XyIvPjxwYXRoIGQ9Ik0xMyw2YzAsMS42NTQsMS4zNDYsMywzLDNzMy0xLjM0NiwzLTNzLTEuMzQ2LTMtMy0zUzEzLDQuMzQ2LDEzLDZ6IiBpZD0iWE1MSURfMjk3XyIvPjwvc3ZnPg==",
  class: 'handle'
}).appendTo('.canvastools');

$( function() {
  $( ".canvastools" ).draggable();
} );


var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function() {
          // path
          //  .attr('transform', d3.event.transform);
          // circle.selectAll("circle, text")
          //  .attr('transform', d3.event.transform);
          svg.selectAll('g').attr('transform', d3.event.transform)
});

var groupColor = {
  "1": 'black',
  "2": 'darkgray',
  "3": 'lightgray'
}

let btn3d = $("#3dtoggle")
btn3d.on('click', function() {
  console.log('button clicked');
  // alert(JSON.stringify(capture));
  // location.href = window.location.pathname + '/3d'
})

const svg = d3.select('body')
  .append('svg')
//   .on('contextmenu', () => { d3.event.preventDefault(); })
  .attr('width', width)
  .attr('height', height);

  // svg
  // .call(zoom);



// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [];
// let lastNodeId = 0;
var links = [];

// init D3 force layout
const force = d3.forceSimulation()
  .force('link', d3.forceLink().id((d) => d.id).distance(120))
  .force('charge', d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width/2, height/2))
  .force('x', d3.forceX(width / 2))
  .force('y', d3.forceY(height / 2))
  .on('tick', tick);




// init D3 drag support
const drag = d3.drag()
  // Mac Firefox doesn't distinguish between left/right click when Ctrl is held... 
  .filter(() => d3.event.button === 0 || d3.event.button === 2)
  .on('start', (d) => {
    if (!d3.event.active) force.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  })
  .on('end', (d) => {
    if (!d3.event.active) force.alphaTarget(0);

    d.fx = null;
    d.fy = null;
  });



// line displayed when dragging new nodes
const dragLine = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0');

// handles to link and node element groups
let path = svg.append('svg:g').selectAll('path');
let circle = svg.append('svg:g').selectAll('g');

// mouse event vars
let selectedNode = null;
let selectedLink = null;
let mousedownLink = null;
let mousedownNode = null;
let mouseupNode = null;

function resetMouseVars() {
  mousedownNode = null;
  mouseupNode = null;
  mousedownLink = null;
}

// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  path.attr('d', (d) => {
    const deltaX = d.target.x - d.source.x;
    const deltaY = d.target.y - d.source.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / dist;
    const normY = deltaY / dist;
    const sourcePadding = d.left ? 17 : 12;
    const targetPadding = d.right ? 17 : 12;
    const sourceX = d.source.x + (sourcePadding * normX);
    const sourceY = d.source.y + (sourcePadding * normY);
    const targetX = d.target.x - (targetPadding * normX);
    const targetY = d.target.y - (targetPadding * normY);

    return `M${sourceX},${sourceY}L${targetX},${targetY}`;
  });

  circle
  .attr('transform', (d) => `translate(${d.x},${d.y})`);


}

let lastpass = []

function getNotesBoxv2(d,node){
  //save and close existing open box
  closeOpenBox()
  d3.event.preventDefault();

  //give notesName to the notesBox
  d3.select("#notes").text(d.name)

  //Display the Notes Box
  d3.select("#tbox").node().classList.add('selected')

  //Change the clicked node color
  d3.select(node).select('circle').node().classList.add('context')

  //Populate text in textbox
  $("textarea").val(d.notes || "")
}

function closeOpenBox(){
  //Removing duplicate/existing colours in nodes on click
  d3.selectAll('circle')._groups[0].forEach(element => {
    element.classList.remove('context')
  });

  //get notesName and update text to nodes by notesName
  let notesName = $("#notes").text()
  nodes.filter(function(element){ 
    if(element.name == notesName) {
    element.notes = $("#textarea").val();
  }
})
  d3.select("#tbox").node().classList.remove('selected')
}


$("#close").on("click", closeOpenBox)



function getNotesBoxv1(d, node) {
  console.log(d, d.notes);
  let tbox = $("#tbox")[0]

  //if textbox is already open then we need see this as a stack event and update the color of the elements existing to black and then the one being selected to a custom color

  if(tbox.classList.value === "selected"){
    console.log('stack invoke');

    //decolourise duplicate calls
    d3.selectAll('circle')._groups[0].forEach(element => {
      element.classList.remove('context')
    });

    //apply previous message to previous id
    let id = lastpass[0],
    message = lastpass[1]
    console.log("n-1 Click " + id + " " + message);

    nodes.filter(function(element){ 
      if(element.id == id) {
      element.notes = message
    }
  })
  }



  d3.event.preventDefault();
  d3.select("#notes").text(d.name)
  d3.select("#tbox").node().classList.add('selected')
  d3.select(node).select('circle').node().classList.add('context')

  // let instance = d
  $('#textarea').on('input', function(d) {
    // d.notes = d3.select("textarea").node().value;
    d.notes = $(this).val();
    // console.log(d.notes);
  })

  // var intervalId = window.setInterval(function(){
  //   /// call your function here
  //   d.notes = d3.select("textarea").node().value
  //   console.log(`Data ${d.notes} written to ${d.name}`);
  //   clearInterval(intervalId)
  // }, 300);

  $("textarea").val(d.notes || "")

  d3.select("#close").on("click", function() {
  d.notes = d3.select("textarea").node().value;
  d3.select(node).select('circle').node().classList.remove('context')
  d3.select("#tbox").node().classList.remove('selected')


})
return [d.id, d.notes]

}


var local = d3.local()

// update graph (called when needed)
function restart() {
  // path (link) group
  // var documentTitle = $('.canvasbuttons #docname')[0]
  // documentTitle.innerHTML =  nodes[0].id
  path = path.data(links);


  // remove old links
  path.exit().remove();

  // add new links
  path = path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', (d) => d === selectedLink)
    // .on('click', function(d){ singleSelect(d,  this);  })
    // .on('blur', function(d){ singleDeSelect(d, this); })

    .on('mousedown', (d) => {

      // select link
      mousedownLink = d;
      selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
      selectedNode = null;
      restart();
    })
    .merge(path);

  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, (d) => d.id)
  .on("dblclick", function(d) { editNodeName(d, this); })
  // .on("contextmenu", function(d) { return getNotesBox(d, this) });
  .on("contextmenu", function(d) {  getNotesBoxv2(d,this) })  ;

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    .on('click', function(){
      d3.select(this).node().classList.add('selected')
      // d3.select(this).data().parentNode
    })
    .on('blur', function(){
      // d3.select(this).node().classList.remove('context')
      d3.select(this).node().classList.remove('selected')
    })
    ;
  // circle.selectAll('circle')
  //   .on("contextmenu", function(d) { getNotesBox(d, this) });

  // remove old nodes
  circle.exit().remove();

  // add new nodes
  const g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 5)
    .attr('fill', d => groupColor[d.group])

    .classed('reflexive', (d) => d.reflexive)
    .on('mouseover', function (d) {
      if (!mousedownNode || d === mousedownNode) return;
      // enlarge target node

      d3.select(this).attr('transform', 'scale(1.1)');
    })
    .on('mouseout', function (d) {
      if (!mousedownNode || d === mousedownNode) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', (d) => {
      if (d3.event.ctrlKey) return;

      // select node
      mousedownNode = d;
      selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
      selectedLink = null;

      // reposition drag line
      dragLine
        .classed('hidden', false)
        .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

      restart();
    })
    .on('mouseup', function (d) {
      if (!mousedownNode) return;

      // needed by FF
      dragLine
        .classed('hidden', true)

      // check for drag-to-self
      mouseupNode = d;
      if (mouseupNode === mousedownNode) {
        resetMouseVars();
        return;
      }


    // add link
    var link = {source: mousedownNode, target: mouseupNode};
    links.push(link);
    console.log("Connecting existing Node from source " + JSON.stringify(mousedownNode) + " target " + JSON.stringify(mouseupNode))



    // enable zoom
    // vis.call(d3.behavior.zoom().on("zoom"), rescale);


      // unenlarge target node
      d3.select(this).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans

      restart();
    })
    .transition(d3.easeQuad)
    .duration(200)
    // .ease(d3.easeElastic())
    .attr("r", 30);


  // show node IDs
  g.append('svg:text')
    .attr('x', 0)
    .attr('y', 4)
    .attr('class', 'id')
    .attr("contenteditable", "true")

    .text((d) => d.name)
    // .call(make_editable, "id");



  circle = g.merge(circle);



  // set the graph in motion
  force
    .nodes(nodes)
    .force('link').links(links);

  force.alphaTarget(0.3).restart();

  sessionStorage.setItem('current', prepareFile(nodes, links))
  // console.log("updated to sessionS");
}

function make_editable(d, field)
{
    console.log("make_editable", arguments);

    this
      .on("mouseover", function() {
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function() {
        d3.select(this).style("fill", null);
      })
      .on("click", function(d) {
        var p = this.parentNode;
        console.log(this, arguments);

        // inject a HTML form to edit the content here...

        // bug in the getBBox logic here, but don't know what I've done wrong here;
        // anyhow, the coordinates are completely off & wrong. :-((
        var xy = this.getBBox();
        var p_xy = p.getBBox();

        xy.x -= p_xy.x;
        xy.y -= p_xy.y;

        var el = d3.select(this);
        var p_el = d3.select(p);

        var frm = p_el.append("foreignObject");

        var inp = frm
            .attr("x", xy.x)
            .attr("y", xy.y)
            .attr("width", 300)
            .attr("height", 25)
            .append("xhtml:form")
                    .append("input")
                        .attr("value", function() {
                            // nasty spot to place this call, but here we are sure that the <input> tag is available
                            // and is handily pointed at by 'this':
                            this.focus();

                            return d[field];
                        })
                        .attr("style", "width: 294px;")
                        // make the form go away when you jump out (form looses focus) or hit ENTER:
                        .on("blur", function() {
                            console.log("blur", this, arguments);

                            var txt = inp.node().value;

                            d[field] = txt;
                            el
                                .text(function(d) { return d[field]; });

                            // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
                            p_el.select("foreignObject").remove();
                        })
                        .on("keypress", function() {
                            console.log("keypress", this, arguments);

                            // IE fix
                            if (!d3.event)
                                d3.event = window.event;

                            var e = d3.event;
                            if (e.keyCode == 13)
                            {
                                if (typeof(e.cancelBubble) !== 'undefined') // IE
                                  e.cancelBubble = true;
                                if (e.stopPropagation)
                                  e.stopPropagation();
                                e.preventDefault();

                                var txt = inp.node().value;

                                d[field] = txt;
                                el
                                    .text(function(d) { return d[field]; });

                                // odd. Should work in Safari, but the debugger crashes on this instead.
                                // Anyway, it SHOULD be here and it doesn't hurt otherwise.
                                p_el.select("foreignObject").remove();
                            }
                        });
      });
}

function mousedown() {

    if (!mousedownNode && !mousedownLink) {
        // allow panning if nothing is selected
        // vis.call(d3.zoom().on("zoom"), rescale);
        return;
      }
  // because :active only works in WebKit?
  path.classed('selected', (d) => d === selectedLink)

//   if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;


}

function mousemove() {
  if (!mousedownNode) return;

  // update drag line
  dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
}



async function editNodeName(d, node){
  console.log(d);
  console.log(node);
  // d3.select(node).select('circle').attr('transform', 'scale(4)')
  // d3.select(node).select('text').attr('contenteditable:true')


  await waitingKeypress();
  if( nodename !== "NAN"){
  console.log(nodename)
  d.name = nodename
  console.log('edited json ' + JSON.stringify(d))
  d3.select(node).select("text").text(d.name);
  restart();

  }   
}


let nodename ;
async function waitingKeypress() {
  return new Promise((resolve) => {
    document.addEventListener('keydown', onKeyHandler);
    let textfield = document.getElementById("nodename")
    textfield.setAttribute("style","display:block;")
    textfield.value = '';
    textfield.focus();
    function onKeyHandler(e) {
      // console.log("keypressed!")
      
      if (e.keyCode === 13) {
        nodename = textfield.value
        document.removeEventListener('keydown', onKeyHandler);
        textfield.setAttribute("style","display:none;")
        resolve();
      }

      else if(e.key === "Escape") {
        nodename = "NAN";
        document.removeEventListener('keydown', onKeyHandler);
        textfield.setAttribute("style","display:none;")
        resolve();
    } 
  }
  });
}

async function mouseup() {
  if (mousedownNode) {
    // hide drag line
    dragLine
      .classed('hidden', true)

    if (!mouseupNode) {
    // add node
    const point = d3.mouse(this);

    // console.log('waiting keypress..')
    // await waitingKeypress();
    // console.log(waitingKeypress())
    // console.log(nodename)

    // if(nodename !== "NAN" ){
    const node = { id: getNextIndex(), name: 'X', x: point[0], y: point[1],notes: "",group: "1" };
    nodes.push(node);
        // dex++;
        // nodetest.push(node);



    // select new link
    selectedLink = null;
    selectedNode = node;
    console.log("Adding New Node from source " + JSON.stringify(mousedownNode) + " target " + JSON.stringify(node))



    links.push({ source: mousedownNode, target:node });
      
    }
    restart();
        
    }
    // because :active only works in WebKit?
  svg.classed('active', false);
    resetMouseVars();
  }



  // clear mouse event vars

function spliceLinksForNode(node) {
  const toSplice = links.filter((l) => l.source === node || l.target === node);
  for (const l of toSplice) {
    links.splice(links.indexOf(l), 1);
  }
}

// only respond once per keydown
let lastKeyDown = -1;

function keydown() {
//   d3.event.preventDefault();

  if (lastKeyDown !== -1) return;
  lastKeyDown = d3.event.keyCode;

  // ctrl


  if (!selectedNode && !selectedLink) return;

  switch (d3.event.keyCode) {
    case 46: // delete
    case 8: // backspace
    // console.log(d3.event.keyCode);
      if (selectedNode) {
        nodes.splice(nodes.indexOf(selectedNode), 1);
        spliceLinksForNode(selectedNode);
      } else if (selectedLink) {
        links.splice(links.indexOf(selectedLink), 1);
      }
      selectedLink = null;
      selectedNode = null;
      restart();
      break;
  }
}

function keyup() {
  lastKeyDown = -1;

  // ctrl
    circle.on('.drag', null);
    svg.classed('ctrl', false);
}


$(document).keyup(function(event) {
  if ($("#searchbox").is(":focus") && event.key == "Enter") {
      displaySearch()
  }
});

async function displaySearch() {
let searchValue =   $('#searchbox')[0].value;
  console.log(searchValue);
  let url = '/search/' + searchValue
  console.log(url);
  location.href = url
}

function prepareFile(n, l) {
  var nodeOnly = [],linkOnly = [];
  for(var i=0;i<n.length;i++){
      var set = { "id": n[i].id, "name" : n[i].name, "notes" : n[i].notes, "group": n[i].group}
      nodeOnly.push(set)
  }
  for(var i=0;i<l.length;i++){
      var set = { "source" : l[i].source.id, "target" : l[i].target.id}
      linkOnly.push(set)
  }
  var fin = {
    "nodes": nodeOnly,
    "links": linkOnly
  }

  let createdData = JSON.stringify(fin);
  // await waitingKeypress();
  nodename = $('#docname')[0].innerHTML
  let data = {"name":nodename,"value":createdData}
  // console.log(createdData + "\nFilename: " + nodename )

  return JSON.stringify(data)
}

function fadeInOut(){
  let savedNotif = $('.canvasbuttons #saved')
  savedNotif.fadeIn('slow', function(){
  savedNotif.delay(1500).fadeOut(); 
})
}

function getNextIndex(){
  let current = 0
  nodes.forEach(element => {
    if(element.id > current) {
      current = element.id
    }
  })

  return current + 1
}

async function addnodes(){
  const node = { id: getNextIndex(), name: 'X', x: width/2, y: height/2,notes: "",group: "1" };
  nodes.push(node);
  console.log("Adding New Node " + JSON.stringify(node))
  restart();
}

async function saveNodes(){
    let data = prepareFile(nodes, links)
    let currentURL = window.location.pathname;
      $.post(window.location.href,data,function(data, status){
        // alert("Data: " + data + "\nStatus: " + status);
        // fs.writeFileSync(json.stringify(data) + ".json", data);
        console.log('File Saved Successfully!')
        // console.log(data, status);
        fadeInOut()

        if(currentURL === '/newDots'){
          window.location = 'loadDots/' + $('#docname')[0].innerHTML 
        }

      });
      fadeInOut()
 
}

var interval;
$(document).on('mousemove keyup keypress',function(){
    clearTimeout(interval);//clear it as soon as any event occurs
  //do any process and then call the function again
    settimeout();//call it again
})

function settimeout(){
    interval=setTimeout(function(){
    saveNodes();
  },2000)
}

function newDoc(){

  lastNodeId = 0;

    nodes = [
        { id: lastNodeId, name: 'X', notes: "", group: "1" }
      ];
    links = [];
  
    console.log(nodes,links)
    restart();
  }

let c;

function loadDoc(userJSON){

    
        // var links = [];
        // var nodes = [];
        c = userJSON
        console.log(c)
        console.log(c.nodes)
        console.log('Load from file')
        nodes = c.nodes
        links = c.links
        lastNodeId = nodes.length-1
    
        restart();    

}
// function loadDoc(){
//     document.getElementById("myBtn").addEventListener("click", function() {
    
//       var reader = new FileReader();
//       reader.addEventListener('load', function() {
//         // var links = [];
//         // var nodes = [];
//         c = JSON.parse(this.result)
//         console.log(c.nodes)
//         console.log('Load from file')
//         nodes = c.nodes
//         links = c.links
//         lastNodeId = nodes.length-1
    
//         restart();
//       });
//       reader.readAsText(document.querySelector('input').files[0]);
    
//     });
// }





// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
restart();