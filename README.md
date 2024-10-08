###Token Generator Web Application

This is a PHP-based web application that generates a 6-digit token for users after logging in. The token lasts for 60 seconds, after which it automatically regenerates a new token. The application uses Object-Oriented PHP (OOP), MySQL with PDO for database interactions, and includes a visually animated countdown timer that shows the remaining time before the token is refreshed.

Features
User Authentication: Secure login system with password hashing (bcrypt).
Token Generation: Generates a 6-digit token that is unique for each user session.
Token Refresh: The token automatically regenerates every 60 seconds.
Animated UI: Displays the token inside a circle with an animation showing a countdown.
MySQL with PDO: Secure database connection with prepared statements to prevent SQL injection.
Session Management: User sessions are used to persist authentication across pages.
Technologies Used
PHP OOP: The core logic of the app is written in Object-Oriented PHP for modularity and reusability.
MySQL (with PDO): Used for user management and token storage.
HTML/CSS/JavaScript: Frontend technologies to create the user interface.
CSS: Used to create the circular progress bar animation.
JavaScript: Manages the countdown and token regeneration on the frontend.
Password Hashing (bcrypt): Ensures user passwords are stored securely.
Session Management: Handles login sessions to prevent unauthorized access.
Folder Structure
