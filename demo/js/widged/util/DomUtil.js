define(function() {

    var Class = {};

  function asArray(pseudoArray) {
    return Array.prototype.slice.call(pseudoArray, 0);
  }


     Class.includeStyleSheetOnce = function(url) {
      if(Class.matchStyleSheet(url).length) { return; }
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", url);
      document.getElementsByTagName("head")[0].appendChild(link);
    };

  Class.matchStyleSheet = function(url) {
    var list = [];
    asArray(document.getElementsByTagName('link')).forEach(function(node) {
      if(node && node.getAttribute("href") && node.getAttribute("href").indexOf(url) !== -1)
        list.push(node);
    });
    return list;
  };



    return Class;

});
