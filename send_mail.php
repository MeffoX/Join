<?php

########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################

switch ($_SERVER['REQUEST_METHOD']) {
    case "OPTIONS": // Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case "POST": // Send the email.
        header("Access-Control-Allow-Origin: *");

        $email = isset($_POST['email']) ? $_POST['email'] : '';

        // Validate and sanitize the email input
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        if (!$email) {
            // Handle invalid email error
            http_response_code(400);
            echo "Invalid email";
            exit;
        }

        $message = "Hello, \n\nFollow this link to reset your JOIN password for your " . $email . " account.\n\nhttps://gruppe-559.developerakademie.net/reset_password.html?email=" . $email . "\n\nIf you didn't ask to reset your password, you can ignore this email.\n\nThanks,\n\nYour Join-Team\n";

        $recipient = $email;
        $subject = "Reset your password for JOIN App";
        $headers = "From: JOIN <noreply@example.com>";

        $result = mail($recipient, $subject, $message, $headers);
        if ($result) {
            echo "Email sent successfully";
        } else {
            // Handle email sending failure
            http_response_code(500);
            echo "Failed to send email";
        }
        break;
    default: // Reject any non POST or OPTIONS requests.
        header("Allow:  POST", true, 405);
        exit;
}