$(document).ready(function() {
    // Search for users
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

    // Search for favourite restaurants
    $('#favourite-search-bar').on('input', function() {
        let query = $(this).val().toLowerCase();
        
        $('.favourite-item').each(function() {
            let restaurantName = $(this).find('td:first').text().toLowerCase();
            if (restaurantName.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});



