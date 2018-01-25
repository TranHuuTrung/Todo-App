var success_url = "./snippets/successlogin.html";
function directHomeUser(){
     document.location.href = "./home.html";
}
function postLogin(){
    var email_login = $("#email").val();
    var pass_login  = $("#password").val();
    $(".loading").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");

    var request = $.ajax({
        type: 'POST',
        crossDomain: true,
        url: "https://todo-js-be.herokuapp.com/auth/sign_in",
        data:{
            'email'    : email_login,
            'password' : pass_login
        }
    });
    request.done(function(data){
        var localStore_email = data.email;
        console.log(localStore_email);
         localStorage.email = email_login;
         localStorage.password = pass_login;
        // localStorage.removeItem("password");
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