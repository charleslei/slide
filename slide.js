$(function(){
    function slide(){
        console.log('slide');
        var me = this;
        me._init();
    }
    slide.prototype = {
        _init: function(){
                   var component = {
                        bigLists: '.slide .big > .item',
                        left: '.left',
                        right: '.right',
                        smlLists: '.sml > .item'
                   }

                   var me = this;
                   var target = me.configs.tar;
                   var me.doms.bigLists = $(component.bigLists);
                   var me.doms.left = $(component.left);
                   var me.doms.right = $(component.right);
                   var me.doms.smlLists = $(component.smlLists);
               },

        _next: function(ele, flag){//true: go ahead; false: go back;
                   var me = this;
                   var bLis = me.doms.bigLists;
                   var curIdx = bLis.index(ele);
                   var len = bLis.length;
                   var nIdx = curIdx + 1;
                   nIdx = nIdx >= len ? 0 : nIdx;
                   return bLis.get(nIdx);
               },

        _go: function(){
             },

        _left: function(){
                 },

        _right: function(){
                }

    }

    $.fn.Slide = function(cfg){
        var $this = $(this);
        $this.each(function(k, v){
            var $item = $(v);
            var config = {};
            $.extend(config, cfg, {tar: $item});
            var obj = new slide();
            $item.data('SLIDE', obj);
        });
    }
})
