$("#new-todo").on("click",function(){
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
    $(".home-createTodo").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
    var requestTitle = $.ajax({
        type: 'GET',
        url: urlApifirst+"/task_lists",
        headers:{
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    });
    requestTitle.done(function(data){
        $(".home-createTodo").children().remove();
        var newTitle = data[data.length- 1].name;
        $("#TitleTodoLists").append('<h1 id="nameOfTodoList" list-id = "'+data[data.length- 1].id +'">'+newTitle+'</h1>');
       
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
    });
}
//get all todo from api for user id de hien thi cho tasklist
function getAllTodo(){
    var requestTitle = $.ajax({
        type: 'GET',
        url: urlApifirst+"/task_lists",
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
// divices pages
$(document).ready(function(){
    var show_per_page = 5;
    //getting the amount of elements inside content div
    var number_of_items = $('#taskList-Title li').length;
    console.log("num " + number_of_items);
    //calculate the number of pages we are going to have
    var number_of_pages = Math.ceil(number_of_items/show_per_page);
    //set the value of our hidden input fields
    $('#current_page').val(0);
    $('#show_per_page').val(show_per_page);
    var navigation_html = '<a class="previous_link" href="javascript:previous();">«</a>';
    
    var current_link = 0;
    while (number_of_pages > current_link){
        navigation_html += '<a class="page_link" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
        current_link++;
    }
    navigation_html += '<a class="next_link" href="javascript:next();">»</a>';

    $('#page_navigation').html(navigation_html);

    //add active_page class to the first page link
    $('#page_navigation .page_link:first').addClass('active_page');
     //hide all the elements inside content div
     $('#taskList-Title').children().css('display', 'none');
     
    //and show the first n (show_per_page) elements
    $('#taskList-Title').children().slice(0, show_per_page).css('display', 'block');
})
//task list click 
var taskListUrl = "./snippets/task-list.html";
$("#tasklist").on("click", function(){
   $(".todo-user").load(taskListUrl);
   getAllTodo();   
//    devicePage();
});
//list todos clicked
$('#listsTodoNav').on("click", function(){
    $(".todo-user").load(taskListUrl);
    getAllTodo();
})
//khi click add todo 
 $("button.add-todo-title-frm").on('click', function(){
    if($("form#validate-frmTitle").valid()){
        var name_titleTodo = $("#name-todo-title").val();
        $("#name-todo-title").val('');
        $('#over, #todo-title-box').fadeOut(300 , function() {
            $('#over').remove();  
        });
        // post todo list 
        var name ={ name: name_titleTodo};
        var request_create = $.ajax({
            type: 'POST',
            url: urlApifirst+"/task_lists",
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            },
            contentType: "application/json",
            data: JSON.stringify(name)
        });
        request_create.done(function(){
            // $(".todo-user").load("./snippets/todo-create-list-item.html", function(){
            $(".todo-user").load(viewTodoUrl, function(){
                 getIdTodoTitle();
                 getAllEmail();
            });
        });
        request_create.fail(function(){
            console.log("Error");
        }); 
    }
    return false;
 });
 //create todo item for todo group
 $(document).on("keypress", "#inputCreate-itemTodo", function() {
    if (event.which === 13) {
      var listId = $("#TitleTodoLists #nameOfTodoList").attr('list-id');
      var todoName = {name: $(this).val()};
      $(this).val("");
      var requestCreateTodo = $.ajax({
        url: urlApifirst+"/task_lists/"+listId+"/todos",
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
          console.log(data);
          createItemTodo();
      });
      requestCreateTodo.fail(function(){
          console.log("Fail");
      })

    }
  });
//create item todo for new Todos
function createItemTodo(){
    var listId = $("#TitleTodoLists #nameOfTodoList").attr('list-id');
    // console.log(listId);
    var CallCreateTask = $.ajax({
        url: urlApifirst+"/task_lists/"+listId+"/todos",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    });
    CallCreateTask.done(function(data, textStatus, jqXHR){
        console.log(data);
        $("#sortable").html("");
        for(var i = 0; i< data.length; i++) {
            if (data[i].done == null) {
                var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" todo-id ="'+data[i].id+'" />'+ data[i].name +'</label></div></li>';
                $('#sortable').append(markup);
                countTodos();
            }
        }
    });
}

var viewTodoUrl = "./snippets/view-todo.html";
//Click on Title todolist in task list
$(document).on("click", ".title-todo-list", function(){
    $(".todo-user").load(viewTodoUrl);
    var listId = $(this).attr('list-id');
    //hien thi toan bo cac thong tin ma listId dang co
    var settitle = $.ajax({
        url: urlApifirst+"/task_lists",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        },
    });
    settitle.done(function(data, textStatus, jqXHR){
        for(var i = 0; i < data.length; i++){
            if( data[i].id == listId){
                var nameTodoView = data[i].name;
            }
        }
        $("#TitleTodoLists").append('<h1 id="nameOfTodoList" list-id = "'+listId+'">'+nameTodoView+'</h1>');
        updateTodoTask();
        getAllEmail();
    });
});
//update task not done and done
function updateTodoTask() {
    var listId = $("#TitleTodoLists #nameOfTodoList").attr('list-id');
    var CallUpdateTask = $.ajax({
        url: urlApifirst+"/task_lists/"+listId+"/todos",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        },
    });
    CallUpdateTask.done(function(data, textStatus, jqXHR){
        $("#sortable").html("");
        console.log(data);
        for(var i = 0; i< data.length; i++) {
          if (data[i].done == null) {
            var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" todo-id ="'+data[i].id+'" />'+ data[i].name +'</label></div></li>';
            $('#sortable').append(markup);
            countTodos();
          } else {
            $("#done-items").append(' <li class="todo-itemDone"><p>'+data[i].name+'</p><a href="#" class="delete-todoDone" todo-id="'+data[i].id+'"><i class="fa fa-close"></i></a></li>');
          }
        }
    });
}
 // count tasks
 function countTodos(){
    var count = $("#sortable li").length;
    $('.count-todos').html(count); //ghi vao muc co class count-todo
}
//click checkbox in item on view todo
$(document).on("click", ".not-done .checkbox input", function(){
     var idItemTodo = $(this).attr('todo-id');
     var todo_list_id = $(".not-done #TitleTodoLists #nameOfTodoList").attr('list-id');
     var  dataSend = {done: true};
     var changeDone = $.ajax({
        url: urlApifirst+"/task_lists/"+todo_list_id+"/todos/"+idItemTodo,
        method: "PATCH",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }, 
        contentType : 'application/json',
        data: JSON.stringify(dataSend),
     });
     changeDone.done(function(data, textStatus, jqXHR){
        $("#sortable").html("");
        $("#done-items").html("");
        updateTodoTask();
        countTodos();
     });
     changeDone.fail(function(){
        console.log("Lỗi change done");
     });
});
//click button delete in item on view todo
$(document).on("click", "#done-items .delete-todoDone", function(){
    var idDeleteTodo = $(this).attr('todo-id');
    var todo_list_id = $(".not-done #TitleTodoLists #nameOfTodoList").attr('list-id');
    var deleteTodo = $.ajax({
        url: urlApifirst+"/task_lists/"+todo_list_id+"/todos/"+idDeleteTodo,
        method: "DELETE",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
     });
     deleteTodo.done(function(data, textStatus, jqXHR){
        $("#done-items").html("");
        updateTodoTask();
     });
     deleteTodo.fail(function(){
        console.log("Lỗi delete");
     });
});
//mark all done click
$(document).on("click", "#checkDoneAll", function(){
    var idListCurrent = $(".not-done #TitleTodoLists #nameOfTodoList").attr('list-id');
    var countItem = $(".not-done #sortable li").length;
    for(i = 0; i< countItem; i++){
        var liTodoItem =  $('.not-done #sortable li').get(i);
        var inputID = liTodoItem.getElementsByTagName('input')[0];
        var idDone = $(inputID).attr('todo-id');
        var statusMark = {done: true};
        var markAll = $.ajax({
            url: urlApifirst+"/task_lists/"+idListCurrent+"/todos/"+idDone,
            method: "PATCH",
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client 
            },
            contentType : 'application/json',
            data: JSON.stringify(statusMark)
        });
    }
    $.ajax({
        url: urlApifirst+"/task_lists/"+idListCurrent+"/todos/",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }, 
    }).done(function(){
        $("#sortable").html("");
        $("#done-items").html("");
        updateTodoTask();
        countTodos();
    }) 
})
//delete todo list
$(document).on("click", ".delete-todo-list", function(){
   if( confirm("Bạn xóa Todo này chứ?")){
    var listId = $(this).attr('list-id');
    $("#taskList-Title").addClass('text-center');
    $("#taskList-Title").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
    var DelTodoList = $.ajax({
        url: urlApifirst+"/task_lists/"+listId,
        method: "DELETE",
        contentType : 'application/json',
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        },
    });
    DelTodoList.done(function(data, textStatus, jqXHR){
        $("#taskList-Title").removeClass('text-center');
        $("#taskList-Title").children().remove();
        getAllTodo();
    });
    DelTodoList.fail(function(){
        $("#taskList-Title").removeClass('text-center');
        $("#taskList-Title").children().remove();
        getAllTodo();
    });
   }else{
        
   }
});

//Edit name todo list
$(document).on("click", ".edit-todo-list", function(){
    var idEdit = $(this).attr('list-id');
    var newNameTodo = prompt("Nhập tên mới cho TodoList");
    if (newNameTodo == null || newNameTodo == "") {
        console.log("error!");
    } else {
        $("#taskList-Title").addClass('text-center');
        $("#taskList-Title").html("<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>");
        var editName = {name:newNameTodo};
        var requestEdit = $.ajax({
            url: urlApifirst+"/task_lists/"+idEdit,
            method: "PATCH",
            contentType : 'application/json',
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            },
            data: JSON.stringify(editName)
        });
        requestEdit.done(function(data, textStatus, jqXHR) {
            $("#taskList-Title").removeClass('text-center');
            $("#taskList-Title").children().remove();
            getAllTodo();
        });
        requestEdit.fail(function(){
            $("#taskList-Title").removeClass('text-center');
            $("#taskList-Title").children().remove();
            getAllTodo();
        });
    }
});
//click change pasword
var changepassUrl = "./snippets/changePassword.html";
$("#change-pass").on("click", function(){
   $(".todo-user").load(changepassUrl);
});
function changePassUser(){
    if($("form#change-form").valid()){
        // var oldPass = $("#oldpassword").val();
        var newPass = $("#newpassword").val();
        var requestChangePass = $.ajax({
            type: 'PATCH',
            url: urlApifirst+"/auth/password",
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            },
            data: JSON.stringify(newPass)
        });
        requestChangePass.done(function(data){
            console.log("done change");
        });
        requestChangePass.fail(function(){
            alert("Susscess change");
        })
    }
}
//get all todo shared from api de hien thi cho tasklistShared
var taskListShareUrl = "./snippets/taskListShared.html";
function getAllTodoShared(){
    var requestTitle = $.ajax({
        type: 'GET',
        url:   urlApifirst+"/shared",
        headers:{
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    });
    requestTitle.done(function(data){
        for (var i = 0; i< data.length ; i++) {
            $("#taskList-Title").append('<li><div class="todo-list"><a href="#" class="title-todo-list" list-id="'+ data[i].id +'">'+data[i].name+'</a><a href="#" class="delete-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-trash-o"></i></a><a href="#" class="edit-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-pencil"></i></a></div></li>');
        }
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
    });
}
//todo shared clicked,
$('#todoShared').on("click", function(){
    $(".todo-user").load(taskListShareUrl);
    getAllTodoShared();//sua code tren
})
//get all email exist in todo app
function getAllEmail(){
    var allEmail = $.ajax({
        url: urlApifirst+"/users",
        method: "GET",
        headers: {
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    });
    allEmail.done(function(data, textStatus, jqXHR) {
        for (var i = 0; i < data.length; i++) {
            $("#selectEmailShareUser").append('<option value="' + data[i].id + '">' + data[i].email + '</option>');
        }
    });
}
// click share email
$(document).on("click", "#btn-share", function(){
    if( $("form#share-form").valid()){
        var userIdShare = $("#selectEmailShareUser").val();
        var listId = $("#nameOfTodoList").attr("list-id");
        var isWrite = document.querySelector("#cb-writeShare").checked;
        var data = {user_id: userIdShare, is_write: isWrite};
        var sendShare = $.ajax({
            url: urlApifirst+"/task_lists/"+ listId +"/share/",
            method: "POST",
            contentType: "application/json",
            headers: {
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            },
            data: JSON.stringify(data)
        });
        sendShare.done(function(data, textStatus, jqXHR){
            $('div.success-share').html('<div class="alert alert-success" style="width:200px; margin: 30px auto; " role="alert">share thành công !</div>');
            setTimeout(function(){
                $('div.success-share').hide();
            },1000);
        }) 
        sendShare.fail(function(){
            $('div.success-share').html('<div class="alert alert-danger" style="width:200px; margin: 30px auto; " role="alert">share không thành công !</div>');
            setTimeout(function(){
                $('div.success-share').hide();
            },1000);
        })
    }
})