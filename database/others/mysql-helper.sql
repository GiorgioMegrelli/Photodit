ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '01234567';

flush privileges;


use mysql;
update user set authentication_string=password(''), plugin='mysql_native_password' where user='root';


GRANT ALL PRIVILEGES 'root'@'localhost' IDENTIFIED BY '01234567';

select user, host from mysql.user;

GRANT ALL PRIVILEGES ON database_name.* TO 'root'@'localhost';

select * from photodit.users;