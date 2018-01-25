var indexUrl   = "./snippets/index.html";

$("#logout").click(function(){
   var request_logout = $.ajax({
        type: 'DELETE',
        crossDomain: true,
        url: "https://todo-js-be.herokuapp.com/auth/sign_out",
        headers: {
            'access-token': ''
        }
    });
    request_logout.done(function(){
        console.log("Logout");
        // $("#logout").click(function(){
        //     insertHtml(".content", indexUrl);
        //   });
        // localStorage.set('accessToken', )
        window.location.href = "./index.html";
    });
    request_logout.fail(function(){
        console.log("Error");
    });
});