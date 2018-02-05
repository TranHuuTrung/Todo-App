var indexUrl   = "./snippets/index.html";

$("#logout").click(function(){
   var request_logout = $.ajax({
        type: 'DELETE',
        crossDomain: true,
        url: "https://herokutuan.herokuapp.com/auth/sign_out",
        headers: {
            'access-token': localStorage.accessToken,
            'uid'         : localStorage.uid,
            'client'      : localStorage.client  
        }
    });
    request_logout.done(function(){
        console.log("Logout");
        // localStorage.removeItem('uid');
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('client');
        localStorage.clear();
        location.pathname = "Todo-App";
    });
    request_logout.fail(function(){
        console.log("Error");
    });
});