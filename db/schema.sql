DROP DATABASE IF EXISTS `goodPicks_db`;
CREATE DATABASE `goodPicks_db`;

USE `goodPicks_db`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `favorite` varchar(50) ALLOW NULL,
  PRIMARY KEY (`id`)
) 

CREATE TABLE `music` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `artist` varchar(255) NOT NULL,
    `genre` varchar(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) 
