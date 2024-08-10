$(document).ready(function() {
    var userId = $.cookie('userid');

    if (!userId) {
        window.location.href = 'login.html';
    } else {
        // Fetch profile information
        $.ajax({
            url: '/api/routes/profile.php',
            type: 'GET',
            data: { action: 'getProfile' },
            success: function(response) {
                if (response.success) {
                    // Populate form fields with user data
                    $('input[name="fname"]').val(response.data.fname);
                    $('input[name="lname"]').val(response.data.lname);
                    $('input[name="username"]').val(response.data.username);
                    $('input[name="email"]').val(response.data.email);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch profile information.'
                });
            }
        });

        // Handle profile update form submission
        $('#profile_form').submit(function(event) {
            event.preventDefault();

            var formData = {
                fname: $('input[name="fname"]').val(),
                lname: $('input[name="lname"]').val(),
                user: $('input[name="username"]').val(),
                email: $('input[name="email"]').val()
            };

            $.ajax({
                url: '/api/routes/profile.php',
                type: 'POST',
                data: { action: 'updateProfile', ...formData },
                success: function(response) {
                    Swal.fire({
                        icon: response.success ? 'success' : 'error',
                        title: response.success ? 'Success' : 'Error',
                        text: response.message
                    });
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update profile information.'
                    });
                }
            });
        });

        // Handle password change form submission
        $('#password_form').submit(function(event) {
            event.preventDefault();

            var formData = {
                old_password: $('input[name="old_password"]').val(),
                new_password: $('input[name="new_password"]').val(),
                confirm_password: $('input[name="confirm_password"]').val()
            };

            $.ajax({
                url: '/api/routes/change_password.php',
                type: 'POST',
                data: formData,
                success: function(response) {
                    Swal.fire({
                        icon: response.success ? 'success' : 'error',
                        title: response.success ? 'Success' : 'Error',
                        text: response.message
                    });
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to change password.'
                    });
                }
            });
        });
    }
});
