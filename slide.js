$(function(){
  function slide(cfg){
    var configs = {
      index: 0, //默认显示的索引
      effect: 'rtl', //默认播放的方向; rtl: right to left; ltr: left to right; normal: no slide effect;
      auto: 'true', //自动播放；true/false;
      interval: '5000'  //设置自动播放间隔；默认5000ms；
    }

    var me = this;
    $.extend(configs, cfg);
    me.configs = configs;
    me._init();
  }
  slide.prototype = {
    _init: function(){
      var component = {
        slideCtn: '.slide',
        bigLists: '.slide .big > .item',
        bigListsCtn: '.slide .big',
        smlLists: '.sml > .item',
        smlListsCtn: '.sml',
        left: '.left',
        right: '.right'
      };

      var me = this;
      var target = me.configs.tar;
      me.doms = {};
      me.doms.slideCtn = target.find(component.slideCtn);
      me.doms.bigLists = target.find(component.bigLists);
      me.doms.bigListsCtn = target.find(component.bigListsCtn);
      me.doms.smlLists = target.find(component.smlLists);
      me.doms.smlListsCtn = target.find(component.smlListsCtn);
      me.doms.left = $(component.left);
      me.doms.right = $(component.right);

      //获取长度
      me.configs.length = me.doms.bigLists.length;
      var w = me.doms.slideCtn.width();
      var h = me.doms.slideCtn.height();
      me.configs.shownRect = {width: w, height: h};

      //注册事件
      me._addEvent();
	  
      var effect = me.configs.effect;
      var doms = me.doms;
      if(effect === 'normal'){
        me.doms.bigLists.filter(':gt(0)').hide();
      }else if(effect === 'rtl' || effect === 'ltr'){
        doms.bigListsCtn.append($(me.doms.bigLists.get(0)).clone()).width(target.width() * (me.configs.length+1));
      }

      //设置默认显示索引
      me.currentEleIdx = me.configs.index;

      //启动自动播放
      me._autoSwitch();
    },

    _addEvent: function(){
      var me = this;
      me.doms.left.bind('click.slide', function(e){
        me._left();
      });
      me.doms.right.bind('click.slide', function(e){
        me._right();
      });

      me.configs.tar.find('.slide').bind('mouseover', function(e){
        clearTimeout(me.timeout);
      }).bind('mouseout', function(e){
        me._autoSwitch();
      });
    },

    _next: function(curIdx, flag){//true: go ahead; false: go back;
      var me = this;
      var len = me.configs.length;
      var nIdx = flag > 0 ? ((curIdx + 1) >= len ? 0 : (curIdx + 1)) : (curIdx - 1 < 0 ? len -1 : curIdx - 1);
      return nIdx;
    },

    _go: function(dir){
      var me = this;
      if(me.configs.isAnimal){return;}
      var cIdx = me.currentEleIdx;
      var nIdx = me._next(cIdx,dir);
      me._switch(cIdx, nIdx, dir);
      me.currentEleIdx = nIdx;
    },

    _switch: function(cur, next, dir){
      var me = this;
      var effect = me.configs.effect;
      var lists = me.doms.bigLists;
      var len = me.configs.length;
      if(effect === 'normal'){
        $(lists.get(cur)).hide();
        $(lists.get(next)).show();
        me._autoSwitch();
      }else if(effect === 'rtl' || effect === 'ltr'){ //right to left;
        var idx = me.currentEleIdx;
        var width = me.configs.shownRect.width;
        me.configs.isAnimal = true;
        if(next == len - 1 && dir < 0){
          me.doms.bigListsCtn.css('left', -len * width + 'px');
        }else if(next == 0 && dir > 0){
          next = len;
        } else if(next == 1 && dir > 0){
          me.doms.bigListsCtn.css('left', "0px");
        }

        me.doms.bigListsCtn.animate({left: - next * width + "px"}, function(p){
          me.configs.isAnimal = false;
          me._autoSwitch();
        });
      }        
    },

    _autoSwitch: function(){
      var me = this;
      if(me.configs.auto && me.configs.interval){
      var interval = me.configs.interval;
      var dir = me.configs.effect;
      clearTimeout(me.timeout);
      me.timeout = setTimeout(function() {
        if(dir === 'rtl'){
          me._go(1);
        }else if (dir === 'ltr'){
          me._go(-1);
        }
      }, interval);

      }
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
});