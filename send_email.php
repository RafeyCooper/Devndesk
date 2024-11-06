<?php
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;
// require './PHPMailer-master/src/Exception.php';
// require './PHPMailer-master/src/PHPMailer.php';
// require './PHPMailer-master/src/SMTP.php';

// $name = $_POST['name'];
// $email = $_POST['email'];
// $phone = $_POST['phone'];
// $project_category = $_POST['project_category'];
// $project_details = $_POST['project_details'];

// $mail = new PHPMailer(exceptions: true);

// try {
//     $mail->isSMTP();
//     $mail->Host = 'smtp.hostinger.com'; 
//     $mail->SMTPAuth = true;
//     $mail->Username = 'contact@devndesk.com'; 
//     $mail->Password = 'A4agency@rafay'; 
//     $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
//     $mail->Port = 587; 


//     $mail->setFrom('contact@devndesk.com', 'DevnDesk Contact Form'); 
//     $mail->addAddress('contact@devndesk.com'); 
//     $mail->addReplyTo($email, $name);

//     $mail->isHTML(true);
//     $mail->Subject = 'New Project Inquiry';
//     $mail->Body = "
//         <h3>Project Inquiry</h3>
//         <p><strong>Name:</strong> $name</p>
//         <p><strong>Email:</strong> $email</p>
//         <p><strong>Phone:</strong> $phone</p>
//         <p><strong>Project Category:</strong> $project_category</p>
//         <p><strong>Project Details:</strong><br>$project_details</p>
//     ";

//     $mail->send();
//     header("Location: contact.html?success=true");
//     exit();
// } catch (Exception $e) {
//     header("Location: contact.html?error=" . urlencode($mail->ErrorInfo));
//     exit();}
?>
