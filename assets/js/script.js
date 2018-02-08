var urlApifirst = "https://herokutuan.herokuapp.com";
$(document).ready(function(){
    
    var startUrl        = "./snippets/start.html";
    var indexUrl        = "./snippets/index.html";
    var loadingUrl      = "./snippets/loading.html";
    var registerHtmlUrl = "./snippets/register.html";
    var loginUrl        = "./snippets/login.html";


    //function for insert innerHTML for 'select'
    var insertHtml = function (selector, html_url){
        $(".content").load(html_url); 
     }

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        insertHtml(selector, loadingUrl);
    };
    //home start
    insertHtml(".content", startUrl);
    
    //load index page when click logo
    $(".logo").click(function(){
      insertHtml(".content", startUrl);
    });

    $("#register").click(function(){
      showLoading(".content");
      insertHtml(".content", registerHtmlUrl);
      return false;
    });

    $("#tasklists").click(function(){
      insertHtml(".content",loadingUrl);
    });

    $("#login").click(function(){
      insertHtml(".content", loginUrl);
    });

    

});