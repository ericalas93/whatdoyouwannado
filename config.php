<?php
$mysqlnd = function_exists('mysqli_stmt_get_result');
 
 phpinfo();

if ($mysqlnd) {
    echo 'mysqlnd enabled!';
}
else
echo "asdfasd";