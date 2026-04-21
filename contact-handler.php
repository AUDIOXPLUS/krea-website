<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL) ?: '';
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
$vehicle = filter_input(INPUT_POST, 'vehicle', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
$project = filter_input(INPUT_POST, 'project', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Name and email are required']);
    exit;
}

$to = 'amministrazione@krea-audio.com';
$subject = 'KREA Audio — New Project Inquiry from ' . $name;

$adminBody = '
<html>
<head>
<style>
body { font-family: "Helvetica Neue", Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; background: #fff; }
.header { background: #0a0a0a; padding: 32px; text-align: center; }
.header img { height: 40px; }
.header h2 { color: #c4a35a; font-size: 14px; letter-spacing: 3px; text-transform: uppercase; margin: 16px 0 0; font-weight: 400; }
.body { padding: 32px; }
.field { margin-bottom: 20px; }
.label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
.value { font-size: 15px; color: #111; line-height: 1.6; }
.footer { padding: 24px 32px; border-top: 1px solid #eee; text-align: center; }
.footer p { font-size: 11px; color: #888; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h2>New Project Inquiry</h2>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Name</div>
      <div class="value">' . htmlspecialchars($name) . '</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a></div>
    </div>
    <div class="field">
      <div class="label">Phone</div>
      <div class="value">' . (empty($phone) ? '—' : htmlspecialchars($phone)) . '</div>
    </div>
    <div class="field">
      <div class="label">Vehicle</div>
      <div class="value">' . (empty($vehicle) ? '—' : htmlspecialchars($vehicle)) . '</div>
    </div>
    <div class="field">
      <div class="label">Project</div>
      <div class="value">' . nl2br(htmlspecialchars($project)) . '</div>
    </div>
  </div>
  <div class="footer">
    <p>Sent from krea-audio.com contact form</p>
  </div>
</div>
</body>
</html>';

$clientSubject = 'KREA Audio — Thank you, ' . $name;
$clientBody = '
<html>
<head>
<style>
body { font-family: "Helvetica Neue", Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; background: #fff; }
.header { background: #0a0a0a; padding: 40px 32px; text-align: center; }
.header h1 { color: #c4a35a; font-family: Georgia, serif; font-size: 28px; font-weight: 400; margin: 0; letter-spacing: 2px; }
.body { padding: 40px 32px; text-align: center; }
.body p { font-size: 15px; line-height: 1.8; color: #444; margin-bottom: 16px; }
.tagline { font-family: Georgia, serif; font-style: italic; color: #c4a35a; font-size: 16px; margin-top: 32px; }
.footer { padding: 24px 32px; border-top: 1px solid #eee; text-align: center; }
.footer p { font-size: 11px; color: #888; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>KREA</h1>
  </div>
  <div class="body">
    <p>Dear ' . htmlspecialchars($name) . ',</p>
    <p>Thank you for reaching out to KREA Audio.<br>
    We have received your project details and will contact you personally.</p>
    <p>Every KREA begins with a conversation &mdash; and yours has just started.</p>
    <p class="tagline">Just listen.</p>
  </div>
  <div class="footer">
    <p>&copy; ' . date('Y') . ' KREA Audio. Carefully handcrafted in Italy.</p>
  </div>
</div>
</body>
</html>';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: KREA Audio <amministrazione@krea-audio.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

$clientHeaders = "MIME-Version: 1.0\r\n";
$clientHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$clientHeaders .= "From: KREA Audio <amministrazione@krea-audio.com>\r\n";
$clientHeaders .= "Reply-To: amministrazione@krea-audio.com\r\n";

$adminSent = mail($to, $subject, $adminBody, $headers);
$clientSent = mail($email, $clientSubject, $clientBody, $clientHeaders);

if ($adminSent) {
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send']);
}
