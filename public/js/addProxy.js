/*
  by default we only care about one form.
*/
var Proxy = function(data) {
  this.data = data || {};
  this.set(this.data);
};
Proxy.prototype = {
  set: function(data) {

    if (data.type) {
      this.data.type = String(data.type) || '';
    }

    if (data.address) {
      if (!this.validIp(data.address)) {
        return false;
      }
      this.data.address = String(data.address) ;
    }
    if (data.port) {
      if (!this.validPort(data.port)) {
        return false;
      }
      this.data.port = Number(data.port) ;
    }

    if (typeof(data.test) != "undefined" && this.data.test !== data.test) {
      this.data.test = data.test;
    }
    if (data.$loki) {
      this.data.$loki = Number(data.$loki) || null;
    }

    if (this.data.type =="DIRECT") {
      this.data.address = '';
      this.data.port = null;
      this.data.test = false;
    }

    return this.data;


  },
  get: function() {

    var data = {
      type: String(this.data.type) || '',
      address: String(this.data.address) || '',
      port: Number(this.data.port) || null,
      test: this.data.test || "false",
      $loki: Number(this.data.$loki) || null
    };
    //cleanup the data
    if (data.$loki == null) {
      delete data.$loki;
    }

    console.log(data.test);
    return data;

  },
  validIp: function(address) {

    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) {
      return true;
    }
    return false;

  },
  validPort: function(portNumber) {
    var port = Number(portNumber);

    if (port > 0 && port <= 65535) {
      return true;
    }
    return false;
  }
};

var addProxy = function() {

  this.$target = $('form.addProxy');
  this.proxySettings = new Proxy();
  this.watch();

  //additional functions
  this.editproxy = new editProxy(this);
  this.deleteproxy = new deleteProxy(this);

};

addProxy.prototype = {
  proxyType: function() {

    var value = this.$target.find('.addProxy-type select :selected').attr('name');

    switch (value) {
      case 'DIRECT':
        this.disableOptions();
        break;
      default:
        this.enableOptions();
    }
    this.proxySettings.set({type: value});


  },
  disableOptions: function() {
    this.$target.find('.addProxy-address').hide();
    this.$target.find('.addProxy-port').hide();
    this.$target.find('.addProxy-test').hide();
    this.proxySettings.set({
      address: '',
      port: null,
      test: false
    });

  },
  enableOptions: function() {
    this.$target.find('.addProxy-address').show();
    this.$target.find('.addProxy-port').show();
    this.$target.find('.addProxy-test').show();
    this.proxyAddress();
    this.proxyPort();
    this.proxyTest();
  },
  proxyAddress: function() {
    var value = this.$target.find('.addProxy-address input').val();
    var test = this.proxySettings.set({address: value});
    if (test == false) {
      this.$target.find('.addProxy-address').removeClass("has-success").addClass("has-error").find('input').focus();
      return false;
    } else {
      this.$target.find('.addProxy-address').removeClass("has-error").addClass('has-success');
    }
  },
  proxyPort: function() {
    var value = this.$target.find('.addProxy-port input').val();
    var test = this.proxySettings.set({port: value});
    if (test == false) {
      this.$target.find('.addProxy-port').removeClass("has-success").addClass("has-error").find('input').focus();
      return false;
    } else {
      this.$target.find('.addProxy-port').removeClass("has-error").addClass('has-success');
    }

  },
  proxyTest: function() {
    var value = this.$target.find('.addProxy-test input').prop('checked');
    this.proxySettings.set({test: value});
  },
  save: function(callback) {
    var self = this;


    // var pa = this.proxyAddress();
    // var pp = this.proxyPort();
    // this.proxyTest();

    // if (pa == false || pp == false) {
    //   return false;
    // }

    var proxySettings = this.proxySettings.get();

    if (proxySettings.type == '') {
      callback(false);
    }

    $.post( "/api/servers/save", proxySettings, function( data ) {
      console.log("response", data);
      callback(data);

    });
  },

  load: function($payload) {


    if (!$payload) {
      console.log('error with the payload', $payload);
      return false;
    }
    var ps = new Proxy($payload);
    proxySettings = ps.get();

    this.$target.find('.addProxy-type select').val(proxySettings.type).trigger('change');
    this.$target.find('.addProxy-address input').val(proxySettings.address);
    this.$target.find('.addProxy-port input').val(proxySettings.port);
    this.$target.find('.addProxy-test input').prop('checked', JSON.parse(proxySettings.test));

    this.proxySettings = new Proxy($payload);

    this.$target.find('.hidden-delete').removeClass('hidden-delete');
  },
  watch: function() {
    var self = this;
    //watch for change of proxy type
    this.$target.find('.addProxy-type select').on('change', function() {
      self.proxyType();
    });

    this.$target.find('.addProxy-address input').on('change', function() {
      self.proxyAddress();
    });

    this.$target.find('.addProxy-port input').on('input', function() {
      self.proxyPort();
    });

    this.$target.find('.addProxy-test input').on('click', function() {
      self.proxyTest();
    });

    //initialize all objects.

    this.proxyAddress();
    this.proxyPort();
    this.proxyTest();
    this.proxyType();

    //save one
    this.$target.find('button.addProxy-submit').on( "click", function( event ) {
      event.preventDefault();
      self.save(function(state) {
        if (state != false) {
          location.reload(true);
        }
      });


    });



  }
};


$(function() {
  var proxyControl = new addProxy();
});