App.NodesController = Ember.ArrayController.extend({
  currentNode: null,
  currentNewNode: null,

  add: function(kind, x, y) {
    // clear unsaved new node
    this.clearCurrentNewNode();

    // create node
    var node = App.Node.createRecord({
      name: "", kind: kind, x: x, y: y
    });

    selectedFamily = this.get('socialNetwork.selectedFamily');
    if (selectedFamily != null) {
      node.get('families').pushObject(selectedFamily);
    }

    // set as current node and current new node
    this.set('currentNode', node);
    this.set('currentNewNode', node);
    
    // add node to the nodes lists
    this.get('content').pushObject(node);

    // unlink from current new node if node was saved
    controller = this;
    node.on('didCreate', function () {
      controller.set('currentNewNode', null);        
    });
  },

  delete: function (node) {
    kind = node.get('kind').toLowerCase();
    message = "Are you sure to delete the "+kind
              +" "+node.get('name')+"?";
    if (confirm(message)) {
      console.log("deleting an node");
      this.set('currentNode', null);
      node.get('roles').toArray().forEach(function(role){
        role.deleteRecord();
      });
      node.deleteRecord();
      this.get('store').commit();
    }
  },

  cancel: function() {
    this.set('currentNode', null);
    this.clearCurrentNewNode(); 
  },

  clearCurrentNewNode: function () {
    if (this.get('currentNewNode') != null) {
      this.get('currentNewNode').deleteRecord();
      this.set('currentNewNode', null);
    }
  },
});
