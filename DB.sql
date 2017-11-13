-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Ноя 07 2017 г., 16:24
-- Версия сервера: 5.5.57-0+deb8u1
-- Версия PHP: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `virtuals_sound`
--

-- --------------------------------------------------------

--
-- Структура таблицы `exhibitions`
--

CREATE TABLE IF NOT EXISTS `exhibitions` (
`id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `artwork` varchar(50) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `curator` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `speakers`
--

CREATE TABLE IF NOT EXISTS `speakers` (
`speakerId` int(11) NOT NULL,
  `workId` int(11) NOT NULL,
  `filename` varchar(150) NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `z` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`user_id` int(11) NOT NULL,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `rights` int(11) NOT NULL,
  `exhibitionId` int(11) NOT NULL,
  `traffic_used` int(11) NOT NULL,
  `traffic_limit` int(11) NOT NULL,
  `email` varchar(70) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `works`
--

CREATE TABLE IF NOT EXISTS `works` (
`workId` int(11) NOT NULL,
  `exhibitionID` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `artwork` varchar(200) DEFAULT NULL,
  `author` varchar(50) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `video` varchar(1000) NOT NULL,
  `year` int(11) NOT NULL,
  `place` varchar(300) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `exhibitions`
--
ALTER TABLE `exhibitions`
 ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `speakers`
--
ALTER TABLE `speakers`
 ADD PRIMARY KEY (`speakerId`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`user_id`), ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `works`
--
ALTER TABLE `works`
 ADD PRIMARY KEY (`workId`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `exhibitions`
--
ALTER TABLE `exhibitions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `speakers`
--
ALTER TABLE `speakers`
MODIFY `speakerId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=190;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `works`
--
ALTER TABLE `works`
MODIFY `workId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=42;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
