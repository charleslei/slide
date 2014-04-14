$(function(){
  function slide(cfg){
    console.log('slide');
    var configs = {}
    var me = this;
    $.extend(configs, cfg);
    me.configs = configs;
    me._init();
  }
  slide.prototype = {
    _init: function(){
      var component = {
        bigLists: '.slide .big > .item',
        left: '.left',
        right: '.right',
        smlLists: '.sml > .item'
      };

      var me = this;
      var target = me.configs.tar;
      me.doms = {};
      me.doms.bigLists = $(component.bigLists);
      me.doms.left = $(component.left);
      me.doms.right = $(component.right);
      me.doms.smlLists = $(component.smlLists);


      //注册事件
      me._addEvent();
      me.doms.bigLists.filter(':gt(0)').hide();

      me.currentEle = $(me.doms.bigLists.get(0));
    },

    _addEvent: function(){
      var me = this;
      me.doms.left.bind('click.slide', function(e){
        me._left();
      });
      me.doms.right.bind('click.slide', function(e){
        me._right();
      });
    },

    _next: function(flag){//true: go ahead; false: go back;
      var me = this;
      var bLis = me.doms.bigLists;
      var curIdx = bLis.index(me.currentEle);
      var len = bLis.length;
      var nIdx = flag > 0 ? ((curIdx + 1) >= len ? 0 : (curIdx + 1)) : (curIdx - 1 < 0 ? len -1 : curIdx - 1);
      return $(bLis.get(nIdx));
    },

    _go: function(dir){
      var me = this;
      var cEle = me.currentEle;
      var nEle = me._next(dir);
      me._switch(cEle, nEle);
      me.currentEle = nEle;
    },

    _switch: function(one, two){
      var me = this;
      //one.hide();
      //two.show();

    },

    _left: function(){
      this._go(-1);
    },

    _right: function(){
      this._go(1);
    }
  }

  $.fn.Slide = function(cfg){
    var $this = $(this);
    $this.each(function(k, v){
      var $item = $(v);
      var config = {};
      $.extend(config, cfg, {tar: $item});
      var obj = new slide(config);
      $item.data('SLIDE', obj);
    });
  }
})
