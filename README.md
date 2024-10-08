## Token Generator Web Application

This is a PHP-based web application that generates a 6-digit token for users after logging in. The token lasts for 60 seconds, after which it automatically regenerates a new token. The application uses Object-Oriented PHP (OOP), MySQL with PDO for database interactions, and includes a visually animated countdown timer that shows the remaining time before the token is refreshed.

#### Features
**User Authentication:** Secure login system with password hashing (bcrypt).
**Token Generation:** Generates a 6-digit token that is unique for each user session.
**Token Refresh:** The token automatically regenerates every 60 seconds.
**Animated UI:** Displays the token inside a circle with an animation showing a countdown.
**MySQL with PDO:** Secure database connection with prepared statements to prevent SQL injection.
**Session Management:** User sessions are used to persist authentication across pages.

#### Technologies Used
**PHP OOP:** The core logic of the app is written in Object-Oriented PHP for modularity and reusability.
**MySQL (with PDO):** Used for user management and token storage.
**HTML/CSS/JavaScript:** Frontend technologies to create the user interface.
**CSS:** Used to create the circular progress bar animation.
**JavaScript:** Manages the countdown and token regeneration on the frontend.
**Password Hashing (bcrypt):** Ensures user passwords are stored securely.
**Session Management:** Handles login sessions to prevent unauthorized access.

#### Folder Structure
/token_generator_app
│
├── /config
│   └── Database.php               # Database connection
│
├── /classes
│   ├── User.php                   # User registration and login logic
│   └── Token.php                  # Token generation and retrieval logic
│
├── /public
│   ├── index.php                  # Landing page, redirects to login
│   ├── login.php                  # User login page
│   ├── dashboard.php              # User dashboard showing the token
│   └── logout.php                 # Logs user out and destroys session
│
├── /scripts
│   └── generate_token.php         # Token generation logic for Cron jobs
│
├── /assets
│   ├── styles.css                 # CSS for styling and animations
│   └── script.js                  # JavaScript for countdown and auto-refresh
└── .htaccess                      # Apache configuration for URL rewrites

#### Database Schema
Run the following SQL to set up the database and tables:

CREATE DATABASE token_app;

USE token_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
How It Works
1. User Authentication
The user must first log in using a valid username and password.
Passwords are stored in a hashed format using bcrypt for security.
If authentication is successful, the user is redirected to the dashboard.
2. Token Generation
After logging in, the user is presented with a 6-digit token displayed in a circular UI.
The token lasts for 60 seconds, after which it automatically regenerates.
The circular progress bar (green to gray transition) indicates the remaining time until the token is refreshed.
3. Countdown Animation
The countdown animation runs for 60 seconds using CSS keyframes.
JavaScript manages the countdown and fetches a new token when the time runs out.
4. Cron Job (Optional)
You can set up a cron job to periodically generate new tokens for users using the /scripts/generate_token.php script.
Setup and Installation
Prerequisites
PHP >= 7.4
MySQL >= 5.7
Apache or Nginx (with mod_rewrite enabled)
Composer (Optional, for managing dependencies)
Steps to Run
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/token_generator_app.git
cd token_generator_app
Set up the Database:

Create a MySQL database as defined in the Database Schema.
Update the database connection settings in /config/Database.php if necessary (username, password, host, etc.).
Start the Application:

Place the application inside your local web server directory (e.g., /var/www/html/ for Apache).
Open the browser and navigate to http://localhost/token_generator_app/public/.
Login:

Create a user by manually inserting a record in the users table or building a registration form.
Log in using the credentials.
Sample User Registration SQL
To manually create a user, run the following SQL:

sql
Copy code
INSERT INTO users (username, email, password) VALUES ('admin', 'admin@example.com', '$2y$10$hashedpassword');
Replace hashedpassword with a bcrypt-hashed password. You can generate it using an online bcrypt generator or using PHP's password_hash() function.

Optional: Set Up Cron Job
You can set up a cron job to automatically generate new tokens for all users in the background:

Open crontab:

bash
Copy code
crontab -e
Add the following line to run the generate_token.php script every 60 seconds:

bash
Copy code
* * * * * /usr/bin/php /path/to/token_generator_app/scripts/generate_token.php

### Security Considerations
Passwords are securely hashed using bcrypt.
Use HTTPS for secure transmission of credentials and tokens.
Sessions are used to authenticate users and should be properly managed to prevent session hijacking.
Use prepared statements with PDO to prevent SQL injection.
Future Improvements
**User Registration:** Add a user registration form with email verification.
Two-Factor Authentication: Implement 2FA to further secure user logins.
**Email Token:** Send the generated token via email/SMS for use in multi-platform verification.

#### Contributions
Feel free to fork, contribute, and submit pull requests to enhance this project.
