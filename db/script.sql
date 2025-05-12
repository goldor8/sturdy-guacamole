select * from game;
Drop database if exists sturdy_avocado;
Create database sturdy_avocado;
Use sturdy_avocado;

CREATE TABLE Game (
   id_game INT PRIMARY KEY AUTO_INCREMENT,
   num INT,
   primary_name VARCHAR(250),
   year_published INT,
   min_players INT  ,
   max_players INT ,
   description TEXT,
   playing_time INT ,
   min_age INT ,
   owned INT DEFAULT 0,
   trading INT DEFAULT 0,
   wanting INT DEFAULT 0,
   wishing INT DEFAULT 0
);

CREATE TABLE Rating (
   id_rating INT PRIMARY KEY AUTO_INCREMENT,
   num INT,
   name VARCHAR(250) NOT NULL,
   published_year INT,
   ranking INT,
   average FLOAT ,
   bayes_average FLOAT,
   user_rated INT DEFAULT 0,
   url VARCHAR(255),
   thumbnail VARCHAR(255),
   id_game INT NOT NULL,
   FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE
);

CREATE TABLE Users (
   id_user INT PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   user_type ENUM('admin', 'player', 'guest') NOT NULL,
   last_swipe_session INT
);

CREATE TABLE Category (
   id_category INT PRIMARY KEY AUTO_INCREMENT,
   category_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Mechanic (
   id_mechanic INT PRIMARY KEY AUTO_INCREMENT,
   type_mechanic VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Expansion (
   id_expansion INT PRIMARY KEY AUTO_INCREMENT,
   name_expansion VARCHAR(250) NOT NULL ,
   id_game DOUBLE NOT NULL


);

CREATE TABLE Collaborator (
   id_collaborator INT PRIMARY KEY AUTO_INCREMENT,
   name_collaborator VARCHAR(250) NOT NULL,
   role_collaborator VARCHAR(50) NOT NULL
);

CREATE TABLE Favorites (
   id_game INT,
   id_user INT,
   PRIMARY KEY (id_game, id_user),
   FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE,
   FOREIGN KEY (id_user) REFERENCES Users(id_user) ON DELETE CASCADE
);

CREATE TABLE Worked_On (
   id_game INT,
   id_collaborator INT,
   PRIMARY KEY (id_game, id_collaborator),
   FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE,
   FOREIGN KEY (id_collaborator) REFERENCES Collaborator(id_collaborator) ON DELETE CASCADE
);

CREATE TABLE Has_Mechanic (
   id_game INT,
   id_mechanic INT,
   PRIMARY KEY (id_game, id_mechanic),
   FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE,
   FOREIGN KEY (id_mechanic) REFERENCES Mechanic(id_mechanic) ON DELETE CASCADE
);

CREATE TABLE Is_Category (
   id_game INT,
   id_category INT,
   PRIMARY KEY (id_game, id_category),
   FOREIGN KEY (id_game) REFERENCES Game(id_game) ON DELETE CASCADE,
   FOREIGN KEY (id_category) REFERENCES Category(id_category) ON DELETE CASCADE
);



CREATE TABLE Swipe (
    id_swipe INT PRIMARY KEY AUTO_INCREMENT,
    id_swipe_session INT,
    id_user INT,
    id_game_swiped INT,
    id_game_kept INT,
    swipe_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user)        REFERENCES Users(id_user),
    FOREIGN KEY (id_game_swiped) REFERENCES Game(id_game),
    FOREIGN KEY (id_game_kept)   REFERENCES Game(id_game)
);

-- =====================================
-- Indexes
-- =====================================
CREATE UNIQUE INDEX  idx_user_username ON Users (username);
CREATE  INDEX  idx_game_primary_name ON Game (primary_name);
CREATE INDEX idx_rating_average ON Rating (average);

-- =====================================
-- Views
-- =====================================

-- Jeux disponibles
DROP VIEW IF EXISTS available_games;
CREATE VIEW available_games AS
SELECT
    id_game,
    primary_name,
    year_published,
    min_players,
    max_players,
    description,
    playing_time,
    min_age
FROM Game
WHERE owned > 0;

-- Information principale sur les jeux

DROP VIEW IF EXISTS view_game_basis;
CREATE VIEW view_game_basis AS
SELECT
    g.id_game,
    g.primary_name,
    g.year_published,
    g.min_players,
    g.max_players,
    g.playing_time,
    r.average,
    r.bayes_average
FROM Game AS g
         LEFT JOIN Rating AS r ON g.id_game = r.id_game;

-- renvoie toutes les informations liées à un jeu

DROP VIEW IF EXISTS  view_game_full;
CREATE VIEW view_game_full AS
SELECT
    g.id_game,
    g.primary_name,
    g.year_published,
    c.category_name,
    m.type_mechanic,
    e.name_expansion
FROM Game AS g
         LEFT JOIN Is_Category AS ic ON g.id_game = ic.id_game
         LEFT JOIN Category AS c     ON ic.id_category = c.id_category
         LEFT JOIN Has_Mechanic AS hm ON g.id_game = hm.id_game
         LEFT JOIN Mechanic AS m     ON hm.id_mechanic = m.id_mechanic
         LEFT JOIN Expansion AS e     ON g.id_game = e.id_game;

-- TRIGGERS

DROP TRIGGER IF EXISTS cascade_delete_game;
DELIMITER $$
CREATE TRIGGER cascade_delete_game
    AFTER DELETE ON Game
    FOR EACH ROW
BEGIN
    DELETE FROM Favorites   WHERE id_game = OLD.id_game;
    DELETE FROM Worked_On   WHERE id_game = OLD.id_game;
    DELETE FROM Has_Mechanic WHERE id_game = OLD.id_game;
    DELETE FROM Is_Category  WHERE id_game = OLD.id_game;
    DELETE FROM Expansion    WHERE id_game = OLD.id_game;
END $$
DELIMITER ;


-- Empêche la suppression d’un jeu si les données des avis ne sont pas encore supprimé
DROP TRIGGER IF EXISTS prevent_game_delete_if_rated;
DELIMITER $$
CREATE TRIGGER prevent_game_delete_if_rated
    BEFORE DELETE ON Game
    FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Rating
        WHERE id_game = OLD.id_game
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Impossible de supprimer un jeu qui a des évaluations.';
END IF;
END $$
DELIMITER ;

-- Supprime les favoris d’un utilisateur lorsqu’il est supprimé

DROP TRIGGER IF EXISTS cascade_delete_user_favorites;
DELIMITER $$
CREATE TRIGGER cascade_delete_user_favorites
    AFTER DELETE ON Users
    FOR EACH ROW
BEGIN
    DELETE FROM Favorites
    WHERE id_user = OLD.id_user;
END $$
DELIMITER ;

-- Procedure et fonctions

DELIMITER $$
CREATE PROCEDURE get_duel_games_by_category(IN cat_name VARCHAR(50))
BEGIN
SELECT g.*
FROM Game g
         JOIN Is_Category ic ON g.id_game = ic.id_game
         JOIN Category c ON ic.id_category = c.id_category
WHERE c.category_name = cat_name
ORDER BY RAND()
    LIMIT 2;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_swipe_game(
    IN p_user INT,
    IN p_game_swiped INT,
    IN p_game_kept INT
)
BEGIN
INSERT INTO Swipe (id_user, id_game_swiped, id_game_kept)
VALUES (p_user, p_game_swiped, p_game_kept);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE compter_jeux_par_categorie (
    IN p_nom_categorie VARCHAR(50),
    OUT p_nb_jeux INT )
BEGIN
DECLARE v_id_categorie VARCHAR(50);

SELECT id_category INTO v_id_categorie
FROM category
WHERE name_category = p_nom_categorie
    LIMIT 1;

SELECT COUNT(*) INTO p_nb_jeux
FROM is_category
WHERE id_category = v_id_categorie;
END $$
DELIMITER ;

