CREATE DATABASE homework CHARACTER SET utf8 COLLATE utf8_general_ci;
USE homework;

CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chair VARCHAR(10) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'free'
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    chair VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO room (id, chair) VALUES
(1, '1A'),
(2, '2A'),
(3, '1B'),
(4, '2B');

INSERT INTO customer (id, username, password) VALUES
(1, 'user','password'),
(2, 'username','password');