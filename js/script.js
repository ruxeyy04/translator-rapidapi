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
    });
});
