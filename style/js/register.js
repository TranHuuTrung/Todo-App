    function directHome(){
        $(".content").load("./snippets/start.html");
    }
    function postSignUp(){
        var email_user    = $("#email").val();
        var password_user = $("#password").val();
        $(".loading").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
        console.log(email_user);
        console.log(password_user);
        var result = $.ajax({
            type: 'POST',
            crossDomain: true,
            url : "https://todo-js-be.herokuapp.com/auth",
            data: {
                'email'   : email_user,
                'password': password_user
            }
        });
        result.done(function(data){
           console.log(data);
           alert("Đăng kí thành công!");
           $(".loading").children().remove();
           directHome();
          
        });
        result.fail(function(jqXHR, textStatus){
            console.log("eror");
            $(".loading").children().remove();
            alert("Thông tin nhập bị sai hoặc email bị trùng!");
        });
    };