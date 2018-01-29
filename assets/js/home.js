$(document).ready(function(){
    function checkLocalStore(){
        var arrCheck =["home.html"];
        var currentPath = $(location).attr('pathname');
        // if(currentPath == jQuery.inArray(arrCheck)){
        if(jQuery.inArray((currentPath , arrCheck) !== 0 && localStorage == null)){
            location.pathname = "Todo-App";
        }
      
    }
    checkLocalStore();
    var startUrl = "./home.html";
    //load index page when click logo
    $(".logo_home").click(function(){
        insertHtml(".content", startUrl);
      });
  
});