    function directHome(){
        $(".content").load("./snippets/start.html");
    }
    
    function postSignUp(){
        if($("form#form-register-validate").valid()){
            var firstname_user = $("#firstname").val();
            var lastname_user  = $("#lastname").val();
            var email_user     = $("#email").val();
            var password_user  = $("#password").val();
            var verifypass_user= $("#verify_password").val();
            $(".loading").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
            var result = $.ajax({
                type: 'POST',
                crossDomain: true,
                url : "https://todo-js-be.herokuapp.com/auth",
                data: {
                    'first_name': firstname_user,
                    'last_name' : lastname_user,
                    'email'     : email_user,
                    'password'  : password_user
                }
            });
            result.done(function(data){
                console.log(data);
                $("div.form-register").hide();
                $(".loading").children().remove();
                $('div.success-regis').html('<div class="alert alert-success" style="width:200px; margin: 50px auto; " role="alert">Đăng ký thành công !</div>');
                setTimeout(function(){
                    directHome();
                    $('div.success-regis').hide();
                },1000);
            });
            result.fail(function(jqXHR, textStatus){
                console.log("eror");
                $(".loading").children().remove();
                alert("Email already exists !");
            });
        }
    }
