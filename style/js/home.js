$(document).ready(function(){
     
    var startUrl = "./home.html";

    //load index page when click logo
    $(".logo_home").click(function(){
        insertHtml(".content", startUrl);
      });
  
});