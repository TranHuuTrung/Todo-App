var success_url = "./snippets/successlogin.html";
function directHomeUser(){
     document.location.href = "./home.html";
}
function postLogin(){
    if($("form#login-form").valid()){

        var email_login = $("#email").val();
        var pass_login  = $("#password").val();

        $(".loading").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");

        var request = $.ajax({
            type: 'POST',
            url: "https://herokutuan.herokuapp.com/auth/sign_in",
            data:{
                'email'    : email_login,
                'password' : pass_login
            }
        });
        request.done(function(data, textStatus, jqXHR){
            var uid         = jqXHR.getResponseHeader("Uid");
            var accessToken = jqXHR.getResponseHeader("Access-Token");
            var client      = jqXHR.getResponseHeader("Client");

            localStorage.uid = uid;
            localStorage.accessToken = accessToken;
            localStorage.client = client;
            $(".loading").children().remove();
            //load vao trang home of user have account
            directHomeUser();
        });
        request.fail(function(){
            console.log("Error");
            $(".loading").children().remove();
            alert("Thông tin đăng nhập bị sai!");
        });
    }
}