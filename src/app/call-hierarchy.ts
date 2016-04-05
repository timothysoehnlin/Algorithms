import * as _ from "lodash";
import * as d3 from "d3";

export let CallHierarchyDirective = ['$timeout', function($timeout) {
  let margin = 20;
  let delay = 500;
  let diagonal = d3.svg.diagonal()
  
  function update(root:any, frameId:string, svg:d3.Selection<any>, tree:d3.layout.Tree<any>) {
    // Compute the new tree layout.
    let nodes = root ? tree.nodes(root).reverse() : [];
    
    let links = tree.links(nodes);

    // Declare the nodesâ€¦
    let node = svg.selectAll("g.node").data(nodes, d => d.id);

    // Enter the nodes.
    let nodeEnter = node.enter().append("g")  
      .attr("class", "node")
      
    nodeEnter
      .attr("transform", d => `translate(${(d.parent || d).x0},${(d.parent || d).y0})`)

    nodeEnter
      .append("circle").attr("r", 3);
            
    nodeEnter
      .append("text");

    node
      .select('circle')
      .transition().duration(delay)
      .attr("r", 10)
      .style("fill-opacity", d => d.frameId === frameId ? 1 : .7)          
      .style("fill", d => d.frameId === frameId ? "#008" : (d.done ?  "#080" : "#800"));
        
    node
      .transition().duration(delay)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      
    node.select("text")
      .attr("y", 20)
      .attr("dx", ".5em")
      .text(d => d.done ? d.ret : d.args)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("fill-opacity", 1);
      
    node.exit()
      .transition().duration(delay)
      .remove()

    // Declare the links
    let link = svg.selectAll("path.link")
      .data(links, d => d.target.id);

    // Enter the links.
    let linkEnter = link
      .enter().insert("path", "g")
      .attr("class", "link")
        
    linkEnter
      .attr("d", d => {
        var o = {x: d.source.x0, y: d.source.y0};
        return diagonal({source:o, target:o})
      })
      .transition().duration(delay)          
      .attr("d", d => diagonal(d))
        
    link
      .transition().duration(delay)    
      .attr("d", d => diagonal(d))        
        
    link.exit()
      .transition().duration(delay)
      .remove();
      
    nodes.forEach(d => {
	    d.x0 = d.x;
	    d.y0 = d.y;
    });
  }
  
  return {
    restrict : 'E',
    scope : {
      root : '=',
      frameId : '=',
    },
    link : function(scope, el:ng.IAugmentedJQuery, attrs) {
      
      $timeout(() => {        
        let w = el.width();
        let h = el.height();
              
        let tree = d3.layout.tree()
          .size([w-margin*2, w-margin*2])
          .nodeSize([50,50]);
                    
        let svg = d3.select(el[0].tagName.toLowerCase())
          .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
              .attr("transform", `translate(${margin + w/2},${margin})`);
        
        scope.$watch('root + "||" + root.updated', function(r) {
          update(scope.root, scope.frameId, svg, tree);
        });
      }, 100);
    }
  }
}];