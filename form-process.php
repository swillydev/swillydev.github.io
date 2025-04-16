<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Adjust based on your installation method

$mail = new PHPMailer(true); // Enable exceptions

// SMTP Configuration
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com'; // Your SMTP server
$mail->SMTPAuth = true;
$mail->Username = 'samw.webdev@gmail.com'; // Your Mailtrap username
$mail->Password = 'M0nstr1234!'; // Your Mailtrap password
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

// Sender and recipient settings
$mail->setFrom('from@example.com', 'From Name');
$mail->addAddress('recipient@example.com', 'Recipient Name');



// Sending plain text email
$mail->isHTML(false); // Set email format to plain text
$mail->Subject = 'Your Subject Here';
$mail->Body    = 'This is the plain text message body';

// Send the email
if(!$mail->send()){
    echo 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}