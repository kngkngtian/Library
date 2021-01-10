/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : library

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 10/01/2021 12:46:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `AdminAccount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `AdminPwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`AdminAccount`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('admin', 'admin');

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `bookId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '书籍编号',
  `bookName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bookPress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `bookAuthor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `bookClass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `bookTotal` int NOT NULL,
  `bookAllowance` int NOT NULL COMMENT '余量',
  `bookMoney` double(10, 2) NOT NULL,
  PRIMARY KEY (`bookId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book
-- ----------------------------
INSERT INTO `book` VALUES ('1', '1123', '111', '1234', '2', 1111, 1110, 100.00);
INSERT INTO `book` VALUES ('2', '2', '2', '2', '2', 12, 12, 1212.00);
INSERT INTO `book` VALUES ('3', '3', '3', '3', '3', 3, 3, 213.00);
INSERT INTO `book` VALUES ('8', '1', '1', '1', '1', 1, 1, 1.00);
INSERT INTO `book` VALUES ('a', '1', '1', '1', '1', 1, 1, 100.00);
INSERT INTO `book` VALUES ('a1', '1', '1', '1', '1', 1, 1, 100.00);
INSERT INTO `book` VALUES ('asdfsadf', 'sadfsdfsa', 'sadf', 'sdf', 'dsdaf', 111, 111, 123.00);
INSERT INTO `book` VALUES ('b', '2', '2', '2', '2', 2, 2, 1212.00);
INSERT INTO `book` VALUES ('b2', '2', '2', '2', '2', 2, 2, 1212.00);
INSERT INTO `book` VALUES ('c', '3', '3', '3', '3', 3, 3, 213.00);
INSERT INTO `book` VALUES ('cq', '3', '3', '3', '3', 3, 3, 213.00);
INSERT INTO `book` VALUES ('d', '4', '4', '4', '4', 4, 4, 123.00);
INSERT INTO `book` VALUES ('da', '4', '4', '4', '4', 4, 4, 123.00);
INSERT INTO `book` VALUES ('e', '5', '5', '5', '5', 5, 5, 65345.00);
INSERT INTO `book` VALUES ('e1', '5', '5', '5', '5', 5, 5, 65345.00);
INSERT INTO `book` VALUES ('f', '1', '1', '1', '1', 1, 1, 1.00);
INSERT INTO `book` VALUES ('f1', '1', '1', '1', '1', 1, 1, 1.00);

-- ----------------------------
-- Table structure for borrow
-- ----------------------------
DROP TABLE IF EXISTS `borrow`;
CREATE TABLE `borrow`  (
  `borId` int(15) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `borBook` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `borCard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `borStart` datetime NULL DEFAULT NULL,
  `borEnd` datetime NULL DEFAULT NULL,
  `borRealtime` datetime NULL DEFAULT NULL,
  `borIsBeyond` tinyint(1) NOT NULL DEFAULT 0,
  `borIsRenew` tinyint(1) NOT NULL DEFAULT 0,
  `borIsReturn` tinyint(1) NOT NULL DEFAULT 0,
  `borIsBorrowApprove` tinyint(1) NOT NULL DEFAULT 0,
  `borIsReturnApprove` tinyint(1) NOT NULL DEFAULT 0,
  `borRenewTime` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`borId`) USING BTREE,
  INDEX `book12312`(`borBook`) USING BTREE,
  INDEX `user123`(`borCard`) USING BTREE,
  CONSTRAINT `book12312` FOREIGN KEY (`borBook`) REFERENCES `book` (`bookId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user123` FOREIGN KEY (`borCard`) REFERENCES `card` (`cardId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of borrow
-- ----------------------------
INSERT INTO `borrow` VALUES (000000000000017, '1', '2', '2021-01-05 19:07:03', '2021-02-05 19:07:03', NULL, 0, 0, 1, 1, 0, 0);
INSERT INTO `borrow` VALUES (000000000000018, '1', '2', NULL, NULL, NULL, 0, 0, 0, 2, 0, 0);
INSERT INTO `borrow` VALUES (000000000000019, '1', '2', '2021-01-05 19:11:42', '2021-02-05 19:11:42', NULL, 0, 0, 0, 1, 0, 0);
INSERT INTO `borrow` VALUES (000000000000020, '1', '2', NULL, NULL, NULL, 0, 0, 0, 2, 0, 0);

-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card`  (
  `cardId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cardPwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cardUser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cardTotal` int NOT NULL DEFAULT 5,
  `cardAllowance` int NOT NULL DEFAULT 5,
  `cardAvatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`cardId`) USING BTREE,
  INDEX `cuser`(`cardUser`) USING BTREE,
  CONSTRAINT `cuser` FOREIGN KEY (`cardUser`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of card
-- ----------------------------
INSERT INTO `card` VALUES ('2', '2', '2', 61, 65, 'public\\card\\1609844782802.png');
INSERT INTO `card` VALUES ('3', '3', '3', 141, 141, NULL);
INSERT INTO `card` VALUES ('asdf11', 'sdf', '1231231111', 123, 123, NULL);
INSERT INTO `card` VALUES ('asdfasdf', 'asdfasdf', '12312311111111123', 123, 123, NULL);
INSERT INTO `card` VALUES ('sadfsdfsadf', 'asdfasdfsdf', '12312312312311134', 123123, 123123, NULL);

-- ----------------------------
-- Table structure for payment
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment`  (
  `payId` int(15) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `payCard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `payMoney` double(10, 2) NOT NULL,
  `payBook` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `payIsPay` tinyint(1) NOT NULL DEFAULT 0,
  `payTime` datetime NULL DEFAULT NULL,
  `payBor` int UNSIGNED NOT NULL,
  PRIMARY KEY (`payId`) USING BTREE,
  INDEX `book1123`(`payBook`) USING BTREE,
  INDEX `user1`(`payCard`) USING BTREE,
  CONSTRAINT `book1123` FOREIGN KEY (`payBook`) REFERENCES `book` (`bookId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user1` FOREIGN KEY (`payCard`) REFERENCES `card` (`cardId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payment
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户身份证',
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userTel` int NULL DEFAULT NULL,
  `userAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('123123', 'asdf', 123, 'asdf');
INSERT INTO `user` VALUES ('1231231', 'asdf1', 123, 'asdf');
INSERT INTO `user` VALUES ('12312311', 'asdf1', 123, 'asdf');
INSERT INTO `user` VALUES ('123123111', 'asdf1', 123, 'asdf');
INSERT INTO `user` VALUES ('1231231111', 'asdf1', 123, 'asdf');
INSERT INTO `user` VALUES ('12312311111111', 'asdf', 12312312, 'asdf');
INSERT INTO `user` VALUES ('12312311111111123', 'asdf', 12312312, 'asdf');
INSERT INTO `user` VALUES ('12312312312311134', 'asdf', 123123, '123');
INSERT INTO `user` VALUES ('2', '211', 212312321, '211132');
INSERT INTO `user` VALUES ('3', '3', 3, '3');
INSERT INTO `user` VALUES ('4', '4', 4, '4');
INSERT INTO `user` VALUES ('5', '5', 5, '5');
INSERT INTO `user` VALUES ('6', '6', 6, '6');

-- ----------------------------
-- View structure for booktoborrow
-- ----------------------------
DROP VIEW IF EXISTS `booktoborrow`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `booktoborrow` AS select `borrow`.`borId` AS `borId`,`book`.`bookId` AS `bookId`,`card`.`cardId` AS `cardId`,`book`.`bookName` AS `bookName`,`book`.`bookPress` AS `bookPress`,`book`.`bookAuthor` AS `bookAuthor` from ((`borrow` join `book` on((`borrow`.`borBook` = `book`.`bookId`))) join `card`) where ((`borrow`.`borCard` = `card`.`cardId`) and (`borrow`.`borIsBorrowApprove` = 0));

-- ----------------------------
-- View structure for booktoreturn
-- ----------------------------
DROP VIEW IF EXISTS `booktoreturn`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `booktoreturn` AS select `borrow`.`borId` AS `borId`,`book`.`bookId` AS `bookId`,`card`.`cardId` AS `cardId`,`book`.`bookName` AS `bookName`,`book`.`bookPress` AS `bookPress`,`book`.`bookAuthor` AS `bookAuthor` from ((`borrow` join `book` on((`borrow`.`borBook` = `book`.`bookId`))) join `card`) where ((`borrow`.`borCard` = `card`.`cardId`) and (`borrow`.`borIsReturn` = 1) and (`borrow`.`borIsReturnApprove` = 0));

-- ----------------------------
-- View structure for class
-- ----------------------------
DROP VIEW IF EXISTS `class`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `class` AS select `book`.`bookClass` AS `className`,sum(`book`.`bookTotal`) AS `classTotal`,sum(`book`.`bookAllowance`) AS `classAllowance` from `book` group by `book`.`bookClass`;

-- ----------------------------
-- View structure for querybook
-- ----------------------------
DROP VIEW IF EXISTS `querybook`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `querybook` AS select sum(`book`.`bookTotal`) AS `Total`,sum(`book`.`bookAllowance`) AS `Allowance` from `book` group by `book`.`bookClass`;

-- ----------------------------
-- Procedure structure for borrowed_book
-- ----------------------------
DROP PROCEDURE IF EXISTS `borrowed_book`;
delimiter ;;
CREATE PROCEDURE `borrowed_book`(IN cardId VARCHAR(100))
BEGIN
SELECT 
card.cardId,
book.bookId,
book.bookName,
borrow.borStart,
CASE borrow.borIsReturnApprove WHEN 0 THEN '否' ELSE '是' END AS '已还'
FROM book,card,borrow
WHERE card.cardId = cardId 
AND borrow.borCard = cardId
AND book.bookId = borrow.borBook;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for auto convert
-- ----------------------------
DROP EVENT IF EXISTS `auto convert`;
delimiter ;;
CREATE EVENT `auto convert`
ON SCHEDULE
EVERY '1' MINUTE STARTS '2021-01-01 17:38:32'
DISABLE
DO SELECT * FROM borrow WHERE borIsGH = 0 AND borIsPZ = 1
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table book
-- ----------------------------
DROP TRIGGER IF EXISTS `自动增加余量`;
delimiter ;;
CREATE TRIGGER `自动增加余量` BEFORE UPDATE ON `book` FOR EACH ROW BEGIN 
IF new.bookTotal <> old.bookTotal
THEN
SET new.bookAllowance = new.bookAllowance + new.bookTotal -  old.bookTotal;
END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table borrow
-- ----------------------------
DROP TRIGGER IF EXISTS `借阅`;
delimiter ;;
CREATE TRIGGER `借阅` BEFORE INSERT ON `borrow` FOR EACH ROW BEGIN
/*当插入数据时将借阅量和余量-1*/
UPDATE Card SET cardAllowance = cardAllowance - 1 WHERE cardId = new.borCard;
UPDATE Book set bookAllowance = bookAllowance -1 WHERE bookId = new.borBook;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table borrow
-- ----------------------------
DROP TRIGGER IF EXISTS `批准`;
delimiter ;;
CREATE TRIGGER `批准` AFTER UPDATE ON `borrow` FOR EACH ROW BEGIN
IF new.borIsBorrowApprove <>old.borIsBorrowApprove and new.borIsBorrowApprove = 2 
THEN 
UPDATE Card set cardAllowance = cardAllowance+1 WHERE cardId = new.borCard;
UPDATE Book set bookAllowance = bookAllowance+1 WHERE bookId = new.borBook;
ELSEIF new.borIsReturn <>old.borIsReturn then 
UPDATE Book set bookAllowance = bookAllowance +1 WHERE bookId = new.borBook;
UPDATE Card SET cardAllowance = cardAllowance + 1 WHERE cardId = new.borCard;
end if;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table card
-- ----------------------------
DROP TRIGGER IF EXISTS `自动增加借阅量`;
delimiter ;;
CREATE TRIGGER `自动增加借阅量` BEFORE UPDATE ON `card` FOR EACH ROW BEGIN 
IF new.cardTotal <> old.cardTotal
THEN
SET new.cardAllowance = new.cardAllowance + new.cardTotal -  old.cardTotal;
END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
