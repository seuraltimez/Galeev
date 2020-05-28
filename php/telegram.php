<?php

$name = $_POST['user_name'];
$phone = $_POST['user_phone'];
$email = $_POST['user_email'];
$company = $_POST['company'];
$massage = $_POST['massage'];
$token = "1166017077:AAE29MHvhk5zvEFqyEUoOWaVBCMmTqqwsD0";
$chat_id = "-424011050";
$arr = array(
  'Имя пользователя: ' => $name,
  'Телефон: ' => $phone,
  'Email' => $email,
  'Название компании' => $company,
  'Сообщение' => $massage
);

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

if ($sendToTelegram) {
	header('Location: /');
} else {
  echo "Error";
}
?>