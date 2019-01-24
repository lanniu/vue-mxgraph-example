<template>
    <div ref="graph_container"></div>
</template>

<script>
import {
    mxGraph
} from 'mxgraph/javascript/mxClient';

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    mounted() {
        // Creates the graph inside the given container
        var graph = new mxGraph(this.$refs.graph_container);

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
            let v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
            let v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);

            graph.insertEdge(parent, null, '', v1, v2);
        } finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
