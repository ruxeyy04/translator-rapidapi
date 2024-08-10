var userId = $.cookie('userid'); 
    
if (!userId) { 
    window.location.href = 'login.html';
}
document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', event => {

        if (event.target.classList.contains('dropdown-toggle')) {
            event.target.classList.toggle('toggle-change');
        }
        else if (event.target.parentElement.classList.contains('dropdown-toggle')) {
            event.target.parentElement.classList.toggle('toggle-change');
        }
    })
});

const settings = {
    async: true,
    crossDomain: true,
    url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages',
    method: 'GET',
    headers: {
        'x-rapidapi-key':  window.env.RAPID_API_KEY,
        'x-rapidapi-host': window.env.RAPID_API_HOST
    }
};
$.ajax(settings).done(function (response) {
    const sourceLanguageSelect = $('#sourceLanguage');
    const targetLanguageSelect = $('#targetLanguage');

    response.slice(1).forEach(language => {
        const option = `<option value="${language.code}">${language.language}</option>`;
        sourceLanguageSelect.append(option);
        targetLanguageSelect.append(option);
    });
});

$('#swapLanguages').click(function() {
    const sourceLanguage = $('#sourceLanguage').val();
    const targetLanguage = $('#targetLanguage').val();
    const sourceText = $('#sourceText').val();
    const targetText = $('#translatedText').val();

    $('#sourceLanguage').val(targetLanguage);
    $('#targetLanguage').val(sourceLanguage);

    $('#sourceText').val(targetText);
    $('#translatedText').val(sourceText);
});

$('#translate').click(function() {
    const sourceText = $('#sourceText').val();
    const sourceLanguage = $('#sourceLanguage').val();
    const targetLanguage = $('#targetLanguage').val(); 

    if (!sourceText.trim()) {
        alert("Please enter text to translate.");
        return;
    }

    const $translateButton = $(this);
    $translateButton.prop('disabled', true);
    $translateButton.find('.spinner-border').show();

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
        method: 'POST',
        headers: {
            'x-rapidapi-key': window.env.RAPID_API_KEY,
            'x-rapidapi-host': window.env.RAPID_API_HOST,
            'Content-Type': 'application/json'
        },
        processData: false,
        data: JSON.stringify({
            from: sourceLanguage,
            to: targetLanguage,
            text: sourceText
        })
    };

    $.ajax(settings).done(function(response) {
        $('#translatedText').val(response.trans || "Translation not available");
    }).fail(function() {
        alert("An error occurred while translating. Please try again.");
    }).always(function() {
        $translateButton.prop('disabled', false);
        $translateButton.find('.spinner-border').hide();
    });
});

$('#addtorecord').click(function (e) {
    e.preventDefault();

    const $addRecordButton = $(this);
    $addRecordButton.prop('disabled', true);
    $addRecordButton.find('.spinner-border').show();

    let data = {
        action: 'add',
        userid: userId, 
        source_lang: $('#sourceLanguage option:selected').text() + ": " + $('#sourceText').val().trim(),
        trans_lang: $('#targetLanguage option:selected').text() + ": " + $('#translatedText').val().trim(),
        datetime: new Date().toISOString()
    };
    
    $.ajax({
        type: "POST",
        url: "/api/routes/records.php",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Record added successfully!',
                confirmButtonText: 'OK'
            });
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the record.',
                confirmButtonText: 'OK'
            });
        },
        complete: function () {
            // Hide spinner and enable button when request is complete
            $addRecordButton.prop('disabled', false);
            $addRecordButton.find('.spinner-border').hide();
        }
    });
    
});
