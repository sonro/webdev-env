<h1>Hi php</h1>
<hr>
<?php

$user_ip = $_SERVER['REMOTE_ADDR'];

function echo_ip() {
    global $user_ip;
    $string = 'Your IP address is: '.$user_ip;
    echo $string;
}

echo_ip();

?>


