var userId = $.cookie('userid');

if (!userId) {
    window.location.href = 'login.html';
}
$('#logout_btn').click(function() {
    $.removeCookie('userid');
    window.location.href = 'login.html';
});
var table = $('#records_data').DataTable({
    ajax: {
        url: '/api/routes/records.php',
        type: 'POST',
        contentType: 'application/json',
        data: function () {
            return JSON.stringify({
                action: 'fetch',
                userid: userId
            });
        },
        dataSrc: ''
    },
    columns: [
        { data: 'rec_id' },
        { data: 'source_lang' },
        { data: 'trans_lang' },
        {
            data: 'datetime',
            render: function(data, type, row) {
                if (data) {
                    const date = new Date(data);
                    const options = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit', 
                        hour12: true 
                    };
                    return date.toLocaleString('en-US', options);
                }
                return '';
            }
        },
        {
            data: 'rec_id',
            render: function(data, type, row) {
                return `<button class="btn btn-danger btn-sm delete-record" data-id="${data}">Delete</button>`;
            }
        }
    ]
});

$('#records_data tbody').on('click', '.delete-record', function() {
    var rec_id = $(this).data('id');
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/routes/records.php',
                type: 'POST',
                data: JSON.stringify({ action: 'delete', rec_id: rec_id }),
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Deleted!', 'The record has been deleted.', 'success');
                        table.ajax.reload(); 
                    } else {
                        Swal.fire('Error!', 'An error occurred while deleting the record.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error!', 'An error occurred while deleting the record.', 'error');
                }
            });
        }
    });
});