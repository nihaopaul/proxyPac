/*
  by default we only care about one form.
*/

var editProxy = function(self) {
  this.$parent = self;
  this.$target = $('button.proxy-server');

  this.init();

};

editProxy.prototype = {
  init: function() {
    var self = this;
    this.$target.on('click', function() {
      var id = $(this).data('id');
      self.$target.closest('.btn-warning').removeClass('btn-warning');
      $(this).addClass('btn-warning');
      $.get('/api/servers/get/'+id, function(data) {
        self.$parent.load(data);
      });
    });
  }
};


