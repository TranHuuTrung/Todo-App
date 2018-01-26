    function directHome(){
        $(".content").load("./snippets/start.html");
    }
    function postSignUp(){
        var firstname_user = $("#firstname").val();
        var lastname_user  = $("#lastname").val();
        var email_user     = $("#email").val();
        var password_user  = $("#password").val();
        var verifypass_user= $("#verify_password").val();
        
        function Valid_info(){
            if(firstname_user == ''){
                $("div.invalid-firstname").html('Please fill in firstname !');
                return false;
            }
            if(lastname_user == ''){
                $("div.invalid-lastname").html('Please fill in lastname !');
                return false;
            }
            if(email_user == ''){
                $("div.invalid-email").html('Please fill in email !');
                return false;
            }
            if(password_user == ''){
                $("div.invalid-pass").html('Please fill in password !');
                return false;
            }
            if(verifypass_user == '' || password_user != verifypass_user){
                $("div.invalid-verify-pass").html('Please fill in verify password !');
                return false;
            }
            return true;
        }
        
        if(Valid_info()){
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
        else{
        //    alert("");
       }
        // $(".loading").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
        // console.log(email_user);
        // console.log(password_user);
        // var result = $.ajax({
        //     type: 'POST',
        //     crossDomain: true,
        //     url : "https://todo-js-be.herokuapp.com/auth",
        //     data: {
        //         'email'   : email_user,
        //         'password': password_user
        //     }
        // });
        // result.done(function(data){
        //    console.log(data);
        //    $("div.form-register").hide();
        //    $(".loading").children().remove();
        //    $('div.success-regis').html('<div class="alert alert-success" style="width:200px; margin: 50px auto; " role="alert">Đăng ký thành công !</div>');
        //    setTimeout(function(){
        //       directHome();
        //       $('div.success-regis').hide();
        //    },1000);
        // });
        // result.fail(function(jqXHR, textStatus){
        //     console.log("eror");
        //     $(".loading").children().remove();
        //     alert("Thông tin nhập bị sai hoặc email bị trùng!");
        // });
    };