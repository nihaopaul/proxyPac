

var deleteProxy = function(self) {
  this.$parent = self;
  this.$target = this.$parent.$target.find('button.addProxy-delete');

  this.init();

};

deleteProxy.prototype = {
  init: function() {
    var self = this;


    //delete one
    this.$target.on( "click", function( event ) {
      var proxySettings = self.$parent.proxySettings.get();
      event.preventDefault();

      if (!proxySettings.$loki) {
        return false;
      }
      var id = proxySettings.$loki;

      $.delete( "/api/servers/delete/"+id, function( status ) {
        if (status != false) {
          location.reload(true);
        }
      });

    });

  }
};


