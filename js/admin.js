$(document).ready(() => {
  $("#open-sidebar").click(() => {
    $("#sidebar").addClass("active");
    $("#sidebar-overlay").removeClass("d-none");
  });
  $("#sidebar-overlay").click(function () {
    $("#sidebar").removeClass("active");
    $(this).addClass("d-none");
  });
});

$("#logout_btn").click(function () {
  $.removeCookie("userid");
  window.location.href = "login.html";
});

$("#users_data").DataTable({
  ajax: {
      url: "/api/routes/user.php",
      type: "GET",
      data: { action: "fetchUsers" },  
      dataSrc: "data"
  },
  columns: [
      { data: "userid" },
      { data: "fname" },                
      { data: "lname" },               
      { data: "username" },            
      { data: "email" },                
      { data: "usertype" },            
      {
          data: "datetime",
          render: function (data, type, row) {
              if (data) {
                  const date = new Date(data);
                  const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true
                  };
                  return date.toLocaleString("en-US", options);
              }
              return "";
          }
      },
      {
          data: "userid",
          render: function (data, type, row) {
              return `
                  <button class="btn btn-primary btn-sm update-record" data-id="${data}">Update</button>
                  <button class="btn btn-danger btn-sm delete-record" data-id="${data}">Delete</button>
              `;
          }
      }
  ]
});

$('#users_data').on('click', '.delete-record', function () {
  var userid = $(this).data('id');
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url: '/api/routes/user.php',
              type: 'DELETE',
              data: { userid: userid },
              success: function (response) {
                  Swal.fire('Deleted!', 'User has been deleted.', 'success');
                  $('#users_data').DataTable().ajax.reload(); 
              },
              error: function (xhr, status, error) {
                  Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
              }
          });
      }
  });
});

$('#addUserForm').submit(function (e) { 
  e.preventDefault();
  let formData = new FormData(this)
  $.ajax({
    url: '/api/routes/user.php',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
        if (response.success) {
          $('#addUserModal').modal('hide')
            Swal.fire({
                title: 'Success!',
                text: 'Successfully created new user',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                  $('#users_data').DataTable().ajax.reload();
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: response.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    },
    error: function(xhr, status, error) {
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
});
$('#users_data').on('click', '.update-record', function () {
    var userid = $(this).data('id');
    $.ajax({
        type: "GET",
        url: "/api/routes/user.php",
        data: { userid: userid }, 
        dataType: "json",
        success: function (ress) {
            let res = ress.data
            if (res && res.success !== false) {
                $('#updateUserForm input[name="userid"]').val(res.userid);
                $('#updateUserForm input[name="fname"]').val(res.fname);
                $('#updateUserForm input[name="lname"]').val(res.lname);
                $('#updateUserForm input[name="user"]').val(res.username);
                $('#updateUserForm input[name="email"]').val(res.email);
                
                $('#updateUserModal').modal('show');
            } else {
                Swal.fire('Error!', 'Failed to fetch user data.', 'error');
            }
        },
        error: function (xhr, status, error) {
            Swal.fire('Error!', 'There was a problem fetching the user data.', 'error');
        }
    });
});

$('#updateUserForm').on('submit', function(e) {
    e.preventDefault(); 

    var formData = $(this).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    var jsonData = JSON.stringify(formData);

    $.ajax({
        type: "PUT",
        url: "/api/routes/user.php",
        data: jsonData,
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            if (response.success) {
                Swal.fire('Success!', response.message, 'success');
                $('#updateUserModal').modal('hide');
                $('#users_data').DataTable().ajax.reload(); 
            } else {
                Swal.fire('Error!', response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            Swal.fire('Error!', 'An error occurred while updating the user.', 'error');
        }
    });
});
