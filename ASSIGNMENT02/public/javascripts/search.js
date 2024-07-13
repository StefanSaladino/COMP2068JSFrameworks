$(document).ready(function() {
    $('#search-bar').on('input', function() {
        let query = $(this).val().toLowerCase();
        
        $('.user-item').each(function() {
            let username = $(this).find('td:first').text().toLowerCase();
            if (username.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
