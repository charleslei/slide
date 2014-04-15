$(function(){
  function slide(cfg){
    var configs = {
      index: 0, //默认显示的索引
      dir: 'rtl', //默认播放的方向; rtl: right to left; ltr: left to right;
      effect: 'animal', // normal: no slide effect;
      auto: true, //自动播放；true/false;
      interval: '5000',  //设置自动播放间隔；默认5000ms；
	  beforeChange: function(){},
	  afterChange: function(){}
    }

    var me = this;
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
	  
      var effect = cfgs.effect;
      if(effect === 'normal'){
        doms.bigLists.filter(':gt(0)').hide();
      }

      var effect = cfgs.effect;
      if(effect !== 'normal'){
        doms.bigListsCtn.append($(doms.bigLists.get(0)).clone()).width(target.width() * (me.length+1));
      }

      //设置默认显示索引
      me.currentEleIdx = cfgs.index;

      //启动自动播放
      me._autoSwitch();

      //注册事件
      me._addEvent();
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

      me.doms.smlLists.bind('click', function(e){
          var $this = $(this);
          var idx = me.doms.smlLists.index($this);
          me._jump(idx);
          me.currentEleIdx = idx;
          e.preventDefault();
      })
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
      if (effect !== 'normal') {
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

    _jump: function(idx){
       var me = this, cIdx = me.currentEleIdx;
       if(me.isAnimal){return;}
       me.isAnimal = true;
       me._beginAnimal(cIdx, idx, idx);
    },

    _autoSwitch1: function(){
      var me = this, doms = me.doms, cfgs = me.configs;
      var dir = cfgs.dir;
      var effect = cfgs.effect;
      var len = me.length;
      var cIdx = me.currentEleIdx;
      var next;
      me.isAnimal = true;

      var width = me.shownRect.width;
      if (dir === 'rtl') {
        var nIdx = next = me._next(cIdx, 1);
        (effect !== 'normal') && (next == 0) ? (next = len) : ((next == 1) ? doms.bigListsCtn.css('left', "0px") : '');
      } else if (dir === 'ltr') {
        var nIdx = next = me._next(cIdx, -1);
        (effect !== 'normal') && (nIdx === len - 1) && doms.bigListsCtn.css('left', -len * width + 'px');
      }
        
      me._beginAnimal(cIdx, next, nIdx);
      me.currentEleIdx = nIdx;
    },

    _beginAnimal: function(cur, next, nIdx, callback){
      var me = this;
      var effect = me.configs.effect;
      var width = me.shownRect.width;
      me._beforeChange(next);
      if(effect === 'normal'){
        var lists = me.doms.bigLists;
          $(lists.get(cur)).hide();
          $(lists.get(next)).show();
          me.isAnimal = false;
          me._afterChange(nIdx);
          me._autoSwitch();
      }else{
          me.doms.bigListsCtn.animate({ left: -next * width + "px" }, function(p) {
              me.isAnimal = false;
              me._afterChange(nIdx);
              me._autoSwitch();
              callback && callback();
          });
      }
    },

    _autoSwitch: function() {
      var me = this, cfgs = me.configs;
      var auto = cfgs.auto, interval = cfgs.interval, dir = cfgs.dir;

      if (auto && interval) {
        clearTimeout(me.timeout);
        me.timeout = setTimeout(function() {
          me._autoSwitch1();
        }, interval);
      }
    },

    _left: function(){
      this._go(-1);
    },

    _right: function(){
      this._go(1);
    },
	
	_beforeChange: function(idx){
		var me = this;
		me.configs.beforeChange();
	},
	
	_afterChange: function(idx){
		var me = this;
        me.doms.smlLists.removeClass('active');
        $(me.doms.smlLists.get(idx)).addClass('active');
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
