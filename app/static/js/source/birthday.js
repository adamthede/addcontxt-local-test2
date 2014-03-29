(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    try{
      howOld();
    }catch(e){}
  }

})();

