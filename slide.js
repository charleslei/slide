﻿$(function(){
  function slide(cfg){
    var me = this;
    me.EFFECTS = {SLIDE: 'slide', NORMAL: 'normal', SCROLL: 'scroll'}; // normal: no slide effect;
    me.DIR = {RTL: 'rtl', LTR: 'ltr'};//rtl: right to left; ltr: left to right;
	
    var configs = {
      index: 0, //默认显示的索引
      dir: me.DIR.RTL, //默认播放的方向; 
      effect: me.EFFECTS.SLIDE,
      auto: true, //自动播放；true/false;
      interval: '5000',  //设置自动播放间隔；默认5000ms；
      beforeChange: function(idx){},
      afterChange: function(idx){}
    }

    $.extend(configs, cfg);
    me.configs = configs;
    me._init();
  }
  slide.prototype = {
    _init: function(){
      var me = this;
      var component = {
        slideCtn: '.slide',
        bigLists: '.slide .big > .item',
        bigListsCtn: '.slide .big',
        smlLists: '.sml > .item',
        smlListsCtn: '.sml',
        left: '.ctl .left',
        right: '.ctl .right'
      };
      var cfgs = me.configs;
      var target = cfgs.tar;
      var doms = {};
      doms.slideCtn = target.find(component.slideCtn);
      doms.bigLists = target.find(component.bigLists);
      doms.bigListsCtn = target.find(component.bigListsCtn);
      doms.smlLists = target.find(component.smlLists);
      doms.smlListsCtn = target.find(component.smlListsCtn);
      doms.left = target.find(component.left);
      doms.right = target.find(component.right);
      me.doms = doms;

      //获取数量
      me.length = doms.bigLists.length;
      var w = doms.slideCtn.width();
      var h = doms.slideCtn.height();
      me.shownRect = {width: w, height: h};


      //初始化动画；
      me._initPosition();

      //注册事件
      me._addEvent();
    },

    _addEvent: function(){
      var me = this;
      me.doms.left.bind('click.slide', function(e){
        me.left();
        e.preventDefault();
      });
      me.doms.right.bind('click.slide', function(e){
        me.right();
		e.preventDefault();
      });

      me.configs.tar.find('.slide').bind('mouseover.slide', function(e){
        clearTimeout(me.timeout);
        e.preventDefault();
      }).bind('mouseout', function(e){
        me._initAutoSwitch();
        e.preventDefault();
      });

      if(me.configs.effect === me.EFFECTS.SCROLL){
        me.doms.bigLists.bind('click.slide', function(e){
        });
      };
	  
      me.doms.smlLists.bind('click', function(e){
        var $this = $(this);
        var idx = me.doms.smlLists.index($this);
        me.jump(idx);
        e.preventDefault();
      })
    },

    _initPosition: function(){
      var me = this;
      var cfgs = me.configs;
      var width = me.shownRect.width;
      var len = me.length;
      var defIdx = cfgs.index;
      var lists = me.doms.bigLists;
      var doms = me.doms;
      var target = cfgs.tar;

      if(defIdx >= len){
        me.currentEleIdx = len - 1;
      }else if(defIdx < 0){
        me.currentEleIdx = 0;
      }else{
        me.currentEleIdx = defIdx;
      }

      //设置默认显示索引
      me.configs.beforeChange(me.currentEleIdx);

      var effect = cfgs.effect;
      if(effect === me.EFFECTS.NORMAL){
        lists.hide();
        $(lists.get(me.currentEleIdx)).show();
      }else if(effect === me.EFFECTS.SLIDE){
        doms.bigListsCtn.append($(lists.get(0)).clone()).width(width * (len+1));
        me.doms.bigListsCtn.css('left', -me.currentEleIdx * width + 'px');
      }

      //启动自动播放
      me._initAutoSwitch();
    },

    _next: function(curIdx, flag){//true: go ahead; false: go back;
      var me = this;
      var len = me.length;
      var nIdx = flag > 0 ? ((curIdx + 1) >= len ? 0 : (curIdx + 1)) : (curIdx - 1 < 0 ? len -1 : curIdx - 1);
      return nIdx;
    },

    _go: function(dir){
      var me = this, doms = me.doms, cfgs = me.configs;
      var cIdx = me.currentEleIdx;
      var next;
      var effect = cfgs.effect;
      var len = me.length;

      if(me.isAnimal){return;}

      me.isAnimal = true;
      clearTimeout(me.timeout);

      var nIdx = next = me._next(cIdx,dir);
      if (effect === me.EFFECTS.SLIDE) {
        var width = me.shownRect.width;
        if(dir < 0){
          (nIdx == len - 1) && doms.bigListsCtn.css('left', -len * width + 'px');
        }else{
          (next == 0) ? (next = len) : ( (next ==1) ? doms.bigListsCtn.css('left', "0px") : '');
        }
      }

      me._beginAnimal(cIdx, next, nIdx);
      me.currentEleIdx = nIdx;
    },
	//public，外部可以访问；
    jump: function(idx){
      var me = this, cIdx = me.currentEleIdx;
      if(me.isAnimal){return;}
      me.isAnimal = true;
      me._beginAnimal(cIdx, idx, idx);
      me.currentEleIdx = idx;
    },

    _switch: function(){
      var me = this, doms = me.doms, cfgs = me.configs;
      var dir = cfgs.dir;
      var effect = cfgs.effect;
      var len = me.length;
      var cIdx = me.currentEleIdx;
      var next;
      me.isAnimal = true;

      var width = me.shownRect.width;
      if (dir === me.DIR.RTL) {
        var nIdx = next = me._next(cIdx, 1);
        (effect === me.EFFECTS.SLIDE) && (next == 0) ? (next = len) : ((next == 1) ? doms.bigListsCtn.css('left', "0px") : '');
      } else if (dir === me.DIR.LTR) {
        var nIdx = next = me._next(cIdx, -1);
        (effect === me.EFFECTS.SLIDE) && (nIdx === len - 1) && doms.bigListsCtn.css('left', -len * width + 'px');
      }

      me._beginAnimal(cIdx, next, nIdx);
      me.currentEleIdx = nIdx;
    },

    _beginAnimal: function(cur, next, nIdx, callback){
      var me = this;
      var effect = me.configs.effect;
      var width = me.shownRect.width;
      me._beforeChange(nIdx);
      if(effect === me.EFFECTS.NORMAL){
        var lists = me.doms.bigLists;
        $(lists.get(cur)).hide();
        $(lists.get(next)).show();
        me.isAnimal = false;
        me._afterChange(nIdx);
        me._initAutoSwitch();
      }else if(effect === me.EFFECTS.SLIDE){
        me.doms.bigListsCtn.animate({ left: -next * width + "px" }, function(p) {
          me.isAnimal = false;
          me._afterChange(nIdx);
          me._initAutoSwitch();
          callback && callback();
        });
      }
    },

    _initAutoSwitch: function() {
      var me = this, cfgs = me.configs;
      var auto = cfgs.auto, interval = cfgs.interval, dir = cfgs.dir;

      if (auto && interval) {
        clearTimeout(me.timeout);
        me.timeout = setTimeout(function() {
          me._switch();
        }, interval);
      }
    },

    left: function(){
      this._go(-1);
    },

    right: function(){
      this._go(1);
    },

    _beforeChange: function(idx){
      var me = this;
      me.configs.beforeChange(idx);
    },

    _afterChange: function(idx){
      var me = this;
      me.configs.afterChange();
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
