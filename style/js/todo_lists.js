$("#new-todo").on("click",function(){
    // confirm("./snippets/loading.html");
    //lấy giá trị thuộc tính href - chính là phần tử "#login-box"
    var loginBox = $(this).attr('href');
    
    //cho hiện hộp đăng nhập trong 300ms
    $(loginBox).fadeIn("slow");
    // thêm phần tử id="over" vào sau body
    $('.todo-user').append('<div id="over"></div>');
    $('#over').fadeIn(300);
    return false;
});
// khi click đóng hộp thoại
$(document).on('click', "a.close, button.cancel, #over", function() { 
    $('#over, #todo-title-box').fadeOut(300 , function() {
        $('#over').remove();  
    }); 
    return false;
});
//khi click add todo
 $("button.add-todo-title-frm").on('click', function(){
    if($("form#validate-frmTitle").valid()){
        var name_titleTodo = $("#name-todo-title").val();
        // alert(name_titleTodo);
        $('#over, #todo-title-box').fadeOut(300 , function() {
            $('#over').remove();  
        });
        $("h1#nameOfTodoList").text(name_titleTodo);
        $(".todo-user").load("./snippets/todo-create-list-item.html");

        
    }
    return false;
 });
