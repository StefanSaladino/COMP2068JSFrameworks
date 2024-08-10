Author: Stefan Saladino
Date: June 28, 2024

About: This webapp connects to the google places api to return restaurants around the user. The user will be
allowed to favourite restaurants, which will be stored into the database and the user will then be able to access
their favourites in the favourite page.

Features:
    - API call for either restaurants or gas stations depending on which button is pressed
    - Users can add and remove favourites from their list (each favourite list is tailored to the user. Each user object
    has an array of favourites stored and then displayed upon visiting /favourites)
    - Github oAuth
    - When registering locally, users must verify their email address (I setup an outlook account that will
    auto send an email link to users, which they can use to verify their account.)
    - The contact us page actually sends an email to a real account (I can't actually send an email from someone
    else's email address, so the email is sent from the app's designated email to itself. However, when hitting
    "reply to", the email address being replied to is the user's email.)
    - Admins have access to a user dashboard. This displays a list of every user in the database, their account status,
    and the option to delete, suspend, ban, remove admin, or promote a user to admin (these options require an admin password).
    - Users can only call the API if their account is verified
    - User details provide in depth insights to each user's account, including the number of places they've favourited
    and the number of times they've called the API.


    - Create: Add places to favourites, add users
    - Read: Display list of favourites, list of users
    - Update: Change user role or user status (if admin)
    - Delete: Can delete users (if admin) or can delete places from favourites