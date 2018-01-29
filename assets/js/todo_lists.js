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

// function get id and name from api
function getIdTodoTitle(){
    var requestTitle = $.ajax({
        type: 'GET',
        url: "https://todo-js-be.herokuapp.com/todo_lists",
        headers:{
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    });
    requestTitle.done(function(data){
        console.log(data);
        $("h1#nameOfTodoList").text(data[data.length - 1].name);
    });
}
//khi click add todo
 $("button.add-todo-title-frm").on('click', function(){
    if($("form#validate-frmTitle").valid()){
        var name_titleTodo = $("#name-todo-title").val();
        // alert(name_titleTodo);
        $("#name-todo-title").val('');
        $('#over, #todo-title-box').fadeOut(300 , function() {
            $('#over').remove();  
        });
        
        // console.log(localStorage.accessToken);
        // post todo list 
        var name ={ name: name_titleTodo};
        var request_create = $.ajax({
            type: 'POST',
            url: "https://todo-js-be.herokuapp.com/todo_lists",
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            },
            contentType: "application/json",
            data: JSON.stringify(name)
        });
        request_create.done(function(){
            $(".todo-user").load("./snippets/todo-create-list-item.html", function(){
                 getIdTodoTitle()
            });
            // window.location.reload();
        });
        request_create.fail(function(){
            console.log("Error");
        });
        
    }
    return false;
 });

 //task list click 
 var taskListUrl = "./snippets/task-list.html";
 $("#tasklist").on("click", function(){
    $(".todo-user").load(taskListUrl);
 });
