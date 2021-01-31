CREATE TABLE Users (
    USER_ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(64) NOT NULL,
    USERNAME_UPPER VARCHAR(64) NOT NULL,-- Username for database operations
    PASSWORD VARCHAR(64) NOT NULL,
    EMAIL VARCHAR(128) DEFAULT NULL,
    FNAME VARCHAR(128) DEFAULT NULL,
    LNAME VARCHAR(128) DEFAULT NULL,
    STATUS VARCHAR(256) DEFAULT NULL,
    P_IMG VARCHAR(16) DEFAULT NULL,
    CREATE_DATE TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Photos (
    PHOTO_ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    AUTHOR_ID INT UNSIGNED,
    FMT_ID SMALLINT,
    UPLOAD_DATE TIMESTAMP DEFAULT NOW(),
    DESCRIPTION VARCHAR(512),
    TYPE_ID SMALLINT,
    FOREIGN KEY(AUTHOR_ID) REFERENCES Users(USER_ID),
    FOREIGN KEY(FMT_ID) REFERENCES Img_Formats(FMT_ID),
    FOREIGN KEY(TYPE_ID) REFERENCES Visibility_Type(TYPE_ID)
);

CREATE TABLE Comments (
    COMMENT_ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    COMMENTER INT UNSIGNED,
    PHOTO_ID INT UNSIGNED,
    COMMENT VARCHAR(512) NOT NULL,
    COMMENT_DATE TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(COMMENTER) REFERENCES Users(USER_ID),
    FOREIGN KEY(PHOTO_ID) REFERENCES Photos(PHOTO_ID)
);

"SELECT p.*, u.USERNAME FROM "
+ tables.photos + " p LEFT JOIN " + tables.users
+ " u ON p.AUTHOR_ID = u.USER_ID WHERE PHOTO_ID = ?";

select count(*) as result from Likes l left join Photos p on l.PHOTO_ID = p.PHOTO_ID where p.AUTHOR_ID = ?

select count(*) as result from Comments c left join Photos p on c.PHOTO_ID = p.PHOTO_ID where p.AUTHOR_ID = ?


CREATE TABLE Followings (
    FOLLOWER INT UNSIGNED,
    FOLLOWING INT UNSIGNED,
    FOLLOWING_DATE TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(FOLLOWER) REFERENCES Users(USER_ID),
    FOREIGN KEY(FOLLOWING) REFERENCES Users(USER_ID)
);

SELECT f.FOLLOWER, u.USERNAME FROM Followings f LEFT JOIN Users u ON f.FOLLOWER = u.USER_ID WHERE f.FOLLOWER = ?
SELECT f.FOLLOWING, u.USERNAME FROM Followings f LEFT JOIN Users u ON f.FOLLOWING = u.USER_ID WHERE f.FOLLOWING = ?



select p.photo_id, count(*)
from photos p
right join likes l
on p.photo_id = l.photo_id
group by p.photo_id;


SELECT p.PHOTO_ID, COUNT(l.liker) AS LIKE_NUM FROM photos p LEFT JOIN likes l ON p.PHOTO_ID = l.PHOTO_ID GROUP BY p.PHOTO_ID





SELECT p.photo_id, count(l.like_date) as likenum
from photos p
right join likes l on p.PHOTO_ID = l.PHOTO_ID
// where u.username like "g%"
group by p.photo_id
order by likenum desc
;


select u.username, u.user_id, sub.photoid, sub.likenum
from users u
left join (
	SELECT p.photo_id as photoid, p.AUTHOR_ID as userid, count(l.like_date) as likenum
	from photos p
	right join likes l on p.PHOTO_ID = l.PHOTO_ID
	group by p.photo_id
	order by likenum
) sub on u.user_id = sub.userid
where u.username like "g%"
order by sub.likenum desc
;


SELECT u.user_id, sub.photoid, likenum
FROM users u
LEFT JOIN (
    SELECT p.photo_id AS photoid, p.AUTHOR_ID AS userid, count(l.like_date) AS likenum
    FROM photos p
    RIGHT JOIN likes l ON p.PHOTO_ID = l.PHOTO_ID
    GROUP BY p.photo_id
) sub ON u.user_id = sub.userid

