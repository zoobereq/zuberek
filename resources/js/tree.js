function init() {
    // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
      $(go.Diagram, "syntaxTree",
        {
          allowCopy: false,
          allowDelete: false,
          allowMove: false,
          initialAutoScale: go.Diagram.Uniform,
          layout:
            $(FlatTreeLayout,  // custom Layout, defined below
              {
                angle: 90,
                compaction: go.TreeLayout.CompactionNone
              }),
          "undoManager.isEnabled": true
        });

    myDiagram.nodeTemplate =
      $(go.Node, "Vertical",
        { selectionObjectName: "BODY" },
        $(go.Panel, "Auto", { name: "BODY" },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill"),
            new go.Binding("stroke")),
          $(go.TextBlock,
            { font: "1vw ui-monospace, sans-serif", margin: new go.Margin(4, 2, 2, 2) },
            new go.Binding("text"))
        ),
        $(go.Panel,  // this is underneath the "BODY"
          { height: 17 },  // always this height, even if the TreeExpanderButton is not visible
          $("TreeExpanderButton")
        )
      );

    myDiagram.linkTemplate =
      $(go.Link,
        $(go.Shape, { strokeWidth: 1.5 }));

    // set up the nodeDataArray, describing each part of the sentence
    var nodeDataArray = [
      { key: 1, text: "Sentence", fill: "darkorange", stroke: "slategray" },
      { key: 2, text: "DP", fill: "darkorange", stroke: "slategray", parent: 1 },
      { key: 3, text: "D'", fill: "gray", stroke: "slategray", parent: 2 },
      { key: 4, text: "D", fill: "lightgray", stroke: "slategray", parent: 3 },
      { key: 5, text: "ø", fill: "snow", stroke: "slategray", parent: 4 },
      { key: 6, text: "NP", fill: "darkorange", stroke: "slategray", parent: 3 },
      { key: 7, text: "AP", fill: "darkorange", stroke: "slategray", parent: 6 },
      { key: 8, text: "A'", fill: "gray", stroke: "slategray", parent: 7 },
      { key: 9, text: "A", fill: "lightgray", stroke: "slategray", parent: 8 },
      { key: 10, text: "Colorless", fill: "#f8f8f8", stroke: "slategray", parent: 9 },
      { key: 11, text: "NP", fill: "darkorange", stroke: "slategray", parent: 6 },
      { key: 12, text: "AP", fill: "darkorange", stroke: "slategray", parent: 11 },
      { key: 13, text: "A'", fill: "gray", stroke: "slategray", parent: 12 },
      { key: 14, text: "A", fill: "lightgray", stroke: "slategray", parent: 13 },
      { key: 15, text: "green", fill: "snow", stroke: "slategray", parent: 14 },
      { key: 16, text: "NP", fill: "darkorange", stroke: "slategray", parent: 11 },
      { key: 17, text: "N'", fill: "gray", stroke: "slategray", parent: 16 },
      { key: 18, text: "N", fill: "lightgray", stroke: "slategray", parent: 17 },
      { key: 19, text: "ideas", fill: "snow", stroke: "slategray", parent: 18 },
      { key: 20, text: "T'", fill: "gray", stroke: "slategray", parent: 1 },
      { key: 21, text: "T", fill: "lightgray", stroke: "slategray", parent: 20 },
      { key: 22, text: "ø", fill: "#f8f8f8", stroke: "slategray", parent: 21 },
      { key: 23, text: "VP", fill: "darkorange", stroke: "slategray", parent: 20 },
      { key: 24, text: "VP", fill: "darkorange", stroke: "slategray", parent: 23 },
      { key: 25, text: "V'", fill: "gray", stroke: "slategray", parent: 24 },
      { key: 26, text: "V", fill: "lightgray", stroke: "slategray", parent: 25 },
      { key: 27, text: "sleep", fill: "#f8f8f8", stroke: "slategray", parent: 26 },
      { key: 28, text: "AdvP", fill: "darkorange", stroke: "slategray", parent: 23 },
      { key: 29, text: "Adv'", fill: "gray", stroke: "slategray", parent: 28 },
      { key: 30, text: "Adv", fill: "lightgray", stroke: "slategray", parent: 29 },
      { key: 31, text: "furiously", fill: "snow", stroke: "slategray", parent: 30 }
    ]

    // create the Model with data for the tree, and assign to the Diagram
    myDiagram.model =
      $(go.TreeModel,
        { nodeDataArray: nodeDataArray });
  }

  // Customize the TreeLayout to position all of the leaf nodes at the same vertical Y position.
  function FlatTreeLayout() {
    go.TreeLayout.call(this);  // call base constructor
  }
  go.Diagram.inherit(FlatTreeLayout, go.TreeLayout);

  // This assumes the TreeLayout.angle is 90 -- growing downward
  FlatTreeLayout.prototype.commitLayout = function() {
    go.TreeLayout.prototype.commitLayout.call(this);  // call base method first
    // find maximum Y position of all Nodes
    var y = -Infinity;
    this.network.vertexes.each(function(v) {
      y = Math.max(y, v.node.position.y);
    });
    // move down all leaf nodes to that Y position, but keeping their X position
    this.network.vertexes.each(function(v) {
      if (v.destinationEdges.count === 0) {
        // shift the node down to Y
        v.node.position = new go.Point(v.node.position.x, y);
        // extend the last segment vertically
        v.node.toEndSegmentLength = Math.abs(v.centerY - y);
      } else {  // restore to normal value
        v.node.toEndSegmentLength = 10;
      }
    });
  };