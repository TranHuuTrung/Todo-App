var indexUrl   = "./snippets/index.html";

$("#logout").click(function(){
   var request_logout = $.ajax({
        type: 'DELETE',
        crossDomain: true,
        url: "https://todo-js-be.herokuapp.com/auth/sign_out",
        headers: {
            'access-token': localStorage.accessToken,
            'uid'         : localStorage.uid,
            'client'      : localStorage.client  
        }
    });
    request_logout.done(function(){
        console.log("Logout");
        localStorage.removeItem('uid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        // $("#logout").click(function(){
        //     insertHtml(".content", indexUrl);
        //   });
        var url_redirect = $(location).attr('host')+"/index.html";
        // console.log(url_redirect);
        location.href = "http://"+ url_redirect;
    });
    request_logout.fail(function(){
        console.log("Error");
    });
});