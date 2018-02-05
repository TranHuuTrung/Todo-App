$(document).ready(function(){
    function checkLogout(){
        var arrCheck =["home.html"];
        var currentPath = $(location).attr('pathname');
        var num = window.localStorage.length;
        if(num === 0 && jQuery.inArray(currentPath , arrCheck)){
            location.pathname = "Todo-App";
        }else{
            console.log(num);
        }
    }
    checkLogout();
    var startUrl = "./home.html";
    //load index page when click logo
    $(".logo_home").click(function(){
        insertHtml(".content", startUrl);
    });
    
});
function previous(){
    new_page = parseInt($('#current_page').val()) - 1;
    //if there is an item before the current active link run the function
    if($('.active_page').prev('.page_link').length==true){
        go_to_page(new_page);
    }
}
function next(){
    new_page = parseInt($('#current_page').val()) + 1;
    //if there is an item after the current active link run the function
    if($('.active_page').next('.page_link').length==true){
        go_to_page(new_page);
    }

}
function go_to_page(page_num){
    //get the number of items shown per page
    var show_per_page = parseInt($('#show_per_page').val());

    //get the element number where to start the slice from
    start_from = page_num * show_per_page;

    //get the element number where to end the slice
    end_on = start_from + show_per_page;

    //hide all children elements of content div, get specific items and show them
    $('#taskList-Title').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');

    /*get the page link that has longdesc attribute of the current page and add active_page class to it
    and remove that class from previously active page link*/
    $('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');

    //update the current page input field
    $('#current_page').val(page_num);
}
    