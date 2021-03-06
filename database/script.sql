CREATE DATABASE photodit;


USE photodit;


/*
    Create Tables
*/
CREATE TABLE Users (
    USER_ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(64) NOT NULL,
    USERNAME_UPPER VARCHAR(64) NOT NULL,-- Username for database operations
    PASSWORD VARCHAR(64) NOT NULL,
    EMAIL VARCHAR(128) DEFAULT NULL,
    FNAME VARCHAR(128) DEFAULT NULL,
    LNAME VARCHAR(128) DEFAULT NULL,
    STATUS VARCHAR(256) DEFAULT NULL,
    CREATE_DATE TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Img_Formats (
    FMT_ID SMALLINT PRIMARY KEY,
    NAME VARCHAR(4)
);

CREATE TABLE Visibility_Type (
    TYPE_ID SMALLINT PRIMARY KEY,
    NAME VARCHAR(9)
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

CREATE TABLE Likes (
    LIKER INT UNSIGNED,
    PHOTO_ID INT UNSIGNED,
    LIKE_DATE TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(LIKER) REFERENCES Users(USER_ID),
    FOREIGN KEY(PHOTO_ID) REFERENCES Photos(PHOTO_ID)
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

CREATE TABLE Followings (
    FOLLOWER INT UNSIGNED,
    FOLLOWING INT UNSIGNED,
    FOLLOWING_DATE TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(FOLLOWER) REFERENCES Users(USER_ID),
    FOREIGN KEY(FOLLOWING) REFERENCES Users(USER_ID)
);


/*
    Fill Starting Tables
*/
INSERT INTO Img_Formats VALUES (1, 'PNG');
INSERT INTO Img_Formats VALUES (2, 'GIF');
INSERT INTO Img_Formats VALUES (3, 'JPEG');

INSERT INTO Visibility_Type VALUES (1, 'PUBLIC');
INSERT INTO Visibility_Type VALUES (2, 'PROTECTED');
INSERT INTO Visibility_Type VALUES (3, 'PRIVATE');
