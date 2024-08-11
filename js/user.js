var userId = $.cookie('userid'); 
    
if (userId) { 
    window.location.href = 'index.html';
}
$("#register_btn").click(function() {
    var formData = {
        fname: $("input[name='fname']").val(),
        lname: $("input[name='lname']").val(),
        user: $("input[name='user']").val(),
        email: $("input[name='email']").val(),
        pass: $("input[name='pass']").val()
    };

    // Send AJAX request
    $.ajax({
        url: '/api/routes/user.php',
        type: 'POST',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login.html';
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


$("#login_form").submit(function(event) {
    event.preventDefault(); 

    var formData = {
        username: $("input[name='username']").val(),
        password: $("input[name='password']").val()
    };

    $.ajax({
        url: '/api/routes/login.php',
        type: 'POST',
        data: formData,
        success: function(response) {
            if (response.success) {
                document.cookie = "userid=" + response.userid + "; path=/";

                Swal.fire({
                    title: 'Success!',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (response.usertype === 'admin') {
                            window.location.href = '/adminindex.html'; 
                        } else {
                            window.location.href = '/index.html'; 
                        }
                        
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