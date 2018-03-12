$(document).ready(function(){
    var userCurrent = localStorage.uid;
    var name = userCurrent.split("@");
    $("#nameUser").text(name[0]);
})
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
            // arrTask.push(data[i]);
            $("#taskList-Title").append('<li><div class="todo-list"><a href="#" class="title-todo-list" list-id="'+ data[i].id +'">'+data[i].name+'</a><a href="#" class="delete-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-trash-o"></i></a><a href="#" class="edit-todo-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-pencil"></i></a></div></li>');
        }
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
    });
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
            // arrTask.push(data[i]);
            $("#taskList-Title").append('<li><div class="todo-list"><a href="#" class="title-todo-list" list-id="'+ data[i].id +'">'+data[i].name+'</a><a href="#" class="delete-todoShare-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-trash-o"></i></a><a href="#" class="edit-todoShare-list fl_right" list-id="'+ data[i].id +'"><i class="fa fa-pencil"></i></a></div></li>');
        }
    });
    requestTitle.fail(function(){
        console.log("Lỗi");
    });
}
//------------ Table management for all task list ---------
var arrTask = [];
var arrSearchDone = [];
var numberRecord = 5; 
//get all todo for management show table
function getAllTodoManage(){
    arrTask = [];
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
       // console.log(data);
        for (var i = 0; i < data.length; i++) {
            arrTask.push(data[i]);
            arrTask[arrTask.length - 1].user = localStorage.uid;
         }
    });
     // get task shared
    var requestTaskShare = $.ajax({
        type: 'GET',
        url:   urlApifirst +"/shared",
        headers:{
            'access-token'  : localStorage.accessToken,
            'uid' : localStorage.uid,
            'client': localStorage.client
        }
    }); 
    requestTaskShare.done(function(data,textStatus, jqXHR){
        var shareTask = data;
        $.ajax({
            url: urlApifirst+"/users",
            method: "GET",
            headers:{
                'access-token'  : localStorage.accessToken,
                'uid' : localStorage.uid,
                'client': localStorage.client
            }
        }).done(function (data, textStatus, jqXHR) {
            for (var i = 0; i < shareTask.length; i++) {
                arrTask.push(shareTask[i]);
                var shareUser = "";
                for (var j = 0; j < data.length; j++) {
                    if (data[j].id === shareTask[i].user_id) {
                        shareUser = data[j].email;
                        break;
                    }
                }
                arrTask[arrTask.length - 1].user = shareUser;
                arrTask[arrTask.length - 1].share_count = '';
                arrTask[arrTask.length - 1].todo_count = '';
                arrTask[arrTask.length - 1].done_count = '';
            }
         }); 
         console.log(arrTask.length);
         showTaskList(arrTask, 1);
         makePagination(arrTask); 
    });   
   
} 

//search todo in management page
$(document).on('keyup', '#input-search-todoManage', function(){
    var textSearch = $(this).val().toUpperCase();
    arrSearchDone = [];
    for (var i = 0; i <  arrTask.length; i++) {
        var nameTask = arrTask[i].name.toUpperCase();
        // if(nameTask.match(textSearch)){
        //     arrSearchDone.push(arrTask[i]);
        // }
        if (nameTask.indexOf(textSearch) >= 0) {
            arrSearchDone.push(arrTask[i]);
        }
    }
    console.log(arrSearchDone);
    makePagination(arrSearchDone);
    showTaskList(arrSearchDone, 1);
   
})
//function get number in page from select
function getNumberRecord(obj){
    var options = obj.children;
    for (var i = 0; i < options.length; i++){
        if (options[i].selected){
            numberRecord = options[i].value;
        }
    }
    makePagination(arrTask);
    showTaskList(arrTask, 1);
}
// divices pages
//show task list and make pagination
function makePagination(taskLists) {
    var numberPages = Math.ceil(taskLists.length / numberRecord);
    $(".pagination").html("");
    if(numberPages <= 1){
        $(".pagination").append('');
    }else{
        for (var i = 1; i <= numberPages; i++) {
            $(".pagination").append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
        }
    }
}

function showTaskList(taskLists, pageNumber) {
    // var numberPages = Math.ceil(taskLists.length / numberRecord);
    console.log(taskLists.length);
    $('table tbody#allTaskListManage').html("");
    var no_done = "";
    for (var k = (pageNumber - 1) * 5; (k < pageNumber * numberRecord) && (taskLists[k] !== undefined); k++) {
        if(k <= taskLists.length){
            no_done = taskLists[k].todo_count - taskLists[k].done_count;          
            $('table tbody#allTaskListManage').append(' <tr>'+'<th scope="row">'+ (k + 1) +'</th>'+'<td>'+taskLists[k].name+'</td>'+'<td>'+arrTask[k].user+'</td>'+'<td>'+taskLists[k].share_count+'</td>'+'<td>'+taskLists[k].todo_count+'</td>'+'<td>'+no_done+'</td>'+'</tr>');
        }
        // // $(".show-count").append("Showing"+);; 
        // var numberStart = $("#allTaskListManage tr:first th").text();  
        // console.log(numberStart);
    }
}
//change page by clicking button
$(document).on("click", ".page-link", function (event) {
    event.preventDefault();
    var pageNumber = $(this).text();
    showTaskList(arrTask, pageNumber);
});
//---------- end management all tasklist-----
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
        //   console.log(data);
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
        // console.log(data);
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
        console.log(data);
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
//delete todo list user
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
        getAllTodo();  //for all todo user 
        // getAllTodoShared(); // for user shared
    
    });
    DelTodoList.fail(function(){
        $("#taskList-Title").removeClass('text-center');
        $("#taskList-Title").children().remove();
        getAllTodo();
    });
   }else{
        
   }
});
//delete todo share list
$(document).on("click", ".delete-todoShare-list", function(){
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
         getAllTodoShared(); // for user shared
     });
     DelTodoList.fail(function(){
         $("#taskList-Title").removeClass('text-center');
         $("#taskList-Title").children().remove();
         getAllTodoShared(); // for user shared
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
//Edit name todo in task list todo Share
$(document).on("click", ".edit-todoShare-list", function(){
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
            getAllTodoShared(); // for user shared
        });
        requestEdit.fail(function(){
            $("#taskList-Title").removeClass('text-center');
            $("#taskList-Title").children().remove();
            getAllTodoShared(); // for user shared
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

//todo shared clicked,
$('#todoShared').on("click", function(){
    $(".todo-user").load(taskListShareUrl);
    getAllTodoShared();//goi ham get all todo shared
})
//management navigation clicked
var taskListManageUrl = "./snippets/taskListManagement.html";
$("#managementTaskList").on("click", function(){
    $(".todo-user").load(taskListManageUrl);
    getAllTodoManage();
    // goi ham show tat ca cac tasklist băng bang thong qua mảng 
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
                $('div.success-share').children().remove();
            },3000);
        }) 
        sendShare.fail(function(){
            $('div.success-share').html('<div class="alert alert-danger" style="width:200px; margin: 30px auto; " role="alert">share không thành công !</div>');
            setTimeout(function(){
                $('div.success-share').children().remove();
            },3000);
        })
    }
})

// search todo
$(document).on('keyup', '#input-search-todo', function(){
    var textSearch = $(this).val();
    $("#taskList-Title li").each(function(){
        var titleTask = $(this).children(".todo-list").children(".title-todo-list").text();
        if(titleTask.indexOf(textSearch) < 0){
            $(this).hide();
        }else{
            $(this).show();
        }
    })
})
