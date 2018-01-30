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
        var newTitle = data[data.length- 1].name;
        $("#TitleTodoLists").append('<h1 id="nameOfTodoList" list-id = "'+data[data.length- 1].id +'">'+newTitle+'</h1>');
       
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
    });
}
//get all todo from api for user id
function getAllTodo(){
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
        for (var i = data.length - 1; i >= 0; i--) {
            $("#taskList-Title").append('<li><div class="todo-list"><a href="#" class="title-todo-list" list-id="'+ data[i].id +'">'+data[i].name+'</a><a href="#" class="delete-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-trash-o"></i></a><a href="#" class="edit-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-pencil"></i></a></div></li>');
        }
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
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
                 getIdTodoTitle();
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
    getAllTodo();
 });


 //create todo item for todo group
 $(document).on("keypress", "#inputCreate-itemTodo", function() {
    if (event.which === 13) {
      var listId = $("#TitleTodoLists #nameOfTodoList").attr('list-id');
    //   console.log(listId);
      var todoName = {name: $(this).val()};
      $(this).val("");
      var requestCreateTodo = $.ajax({
        url: "https://todo-js-be.herokuapp.com/todo_lists/"+listId+"/todos",
        method: "POST",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        },
        contentType: "application/json",
        data: JSON.stringify(todoName)
      });
      requestCreateTodo.done(function(data, textStatus, jqXHR) {
        // console.log(todoName.name);
        // createTodo(todoName.name); //goi ham tao todo moi
        updateTodoTask();
      });
      requestCreateTodo.fail(function(){
          console.log("Fail");
      })

    }
  });
//   update task not done and done
function updateTodoTask() {
    var listId = $("#TitleTodoLists #nameOfTodoList").attr('list-id');
    var CallUpdateTask = $.ajax({
        url: "https://todo-js-be.herokuapp.com/todo_lists/"+listId+"/todos",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        },
    });
    CallUpdateTask.done(function(data, textStatus, jqXHR){
        $("#sortable").html("");
        $("#already-done").html("");
        for(var i =0; i < data.length; i++) {
          if (data[i].done== false) {
            var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" todo-id ="'+data[i].id+'" />'+ data[i].name +'</label></div></li>';
            $('#sortable').append(markup);
            $('.count-todos').text(data.length); //count todo left //cai nay phai lay do dai cua ul tổng  li 
          } else {
            $("#done-items").append('<div class="todo-item form-check"><p><del>'+data[i].name+'</del></p><div class="btn-delete-todo" todo-id="'+data[i].id+'"><i class="far fa-window-close"></i></div></div>');
          }
        }
    });
}
//   //create task
//   function createTodo(text){
//     var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" todo-id ="'+data[i].id+'" />'+ data[i].name +'</label></div></li>';
//     $('#sortable').append(markup);
//     // $('.add-todo').val('');
// }