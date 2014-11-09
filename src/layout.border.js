/**
 * by sam@qunee.com
 */
;(function ($){
  'use strict';
  $.fn.borderLayout = function() {
    var setBounds = function(element, bounds){
      element.style.position = 'absolute';
      element.style.boxSizing = 'border-box';
      for(var name in bounds){
        element.style[name] = bounds[name];
      }
    };
    var calculateLength = function(sNumber, sum, min, max){
      var n;
      if(sNumber[sNumber.length - 1] === '%'){
        n = sum * parseInt(sNumber) / 100;
      }else{
        n = parseInt(sNumber) || sum * 0.1;
      }
      if(min && n < min){
        return min;
      }
      if(max && n > max){
        return max;
      }
      return n;
    };
    return this.each(function() {
      this.style.boxSizing = 'border-box';
      this.style.overflow = 'hidden';
      if(this == document.body || $(this).hasClass('layout--body')){
        setBounds(this, {top: '0px', bottom: '0px', left: '0px', right: '0px'})
      }
      var isH = $(this).hasClass('layout--h');

      var width = this.clientWidth;
      var height = this.clientHeight;
      console.log(this.className + ', ' + height);
      var i = 0;
      var children = this.children;
      var center, north, south, east, west;
      while(i < children.length){
        var child = children[i++];
        var data = child.getAttribute('data-options');
        if(!data){
          continue;
        }
        //http://stackoverflow.com/questions/4210160/safely-parsing-a-json-string-with-unquoted-keys
        data = data.replace(/(['"])?([a-zA-Z0-9\-]+)(['"])?:/g, '"$2":');
        data = data.replace(/'/g, '"');
        data = '{' + data + '}';
        try{
          data = JSON.parse(data);
        }catch(error){
          continue;
        }
        var region = data.region;
        if(!region){
          continue;
        }
        child._data = data;
        if(/center/i.test(region)){
          center = child;
          continue;
        }
        if(/north/i.test(region)){
          north = child;
          continue;
        }
        if(/south/i.test(region)){
          south = child;
          continue;
        }
        if(/east/i.test(region)){
          east = child;
          continue;
        }
        if(/west/i.test(region)){
          west = child;
        }
      }
      var widthRest = width, heightRest = height, top = 0, left = 0, temp, temp2;
      function setWestAndEast(){
        if(west){
          temp = west._data.width;
          if(temp){
            temp = calculateLength(temp, width, west._data['min-width'], west._data['max-width']);
            left = temp;
            temp2 = parseInt(west._data.left) || 0;
            if(temp2){
              widthRest -= temp2;
              left += temp2;
            }
            widthRest -= temp;
            setBounds(west, {top: top + 'px', left: temp2 + 'px', width: temp + 'px', height: heightRest + 'px'});
          }
        }
        if(east){
          temp = east._data.width;
          if(temp){
            temp = calculateLength(temp, width, east._data['min-width'], east._data['max-width']);
            temp2 = parseInt(east._data.right) || 0;
            if(temp2){
              widthRest -= temp2;
            }
            widthRest -= temp;
            setBounds(east, {top: top + 'px', right: temp2 + 'px', width: temp + 'px', height: heightRest + 'px'});
          }
        }
      }
      function setNorthAndSouth(){
        if(north){
          temp = north._data.height;
          if(temp){
            temp = calculateLength(temp, height, north._data['min-height'], north._data['max-height']);
            heightRest -= temp;
            top = temp;
            setBounds(north, {top: 0, left: left + 'px', width: widthRest + 'px', height: temp + 'px'});
          }
        }
        if(south){
          temp = south._data.height;
          if(temp){
            temp = calculateLength(temp, height, south._data['min-height'], south._data['max-height']);
            heightRest -= temp;
            setBounds(south, {bottom: 0, left: left + 'px', height: temp + 'px', width: widthRest + 'px'});
          }
        }
      }
      if(isH){
        setWestAndEast();
        setNorthAndSouth();
      }else{
        setNorthAndSouth();
        setWestAndEast();
      }
      if(center){
        setBounds(center, {top: top + 'px', left: left + 'px', width: widthRest + 'px', height: heightRest + 'px'});
      }
    });
  };
  $(function(){
    var container = $('.layout');
    container.borderLayout();
    $(window).resize(container.borderLayout.bind(container));
  });
})(jQuery);
