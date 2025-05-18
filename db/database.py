import csv
import pymysql

# Connexion à la base de données
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='mysql2024',
    database='sturdy_avocado',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)
def to_int(v, default=0):
    """
    Convertit v en int si possible, sinon retourne default.
    """
    if v is None or v == '':
        return default
    try:
        return int(v)
    except ValueError:
        return default

def process_csv():
    try:
        with conn.cursor() as cursor:
            # Étape 1: Insérer les jeux depuis details.csv
            with open('./dataset/details.csv', 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                num_to_id = {}

                for row in reader:
                    # 1) Nettoyage sûr des champs
                    row = {
                        k: (v or '').replace('[','').replace(']','').replace("'",'').replace('"','')
                        for k, v in row.items()
                    }
                    num          = to_int(row['num'])
                    yearpublished= to_int(row['yearpublished'])
                    minplayers   = to_int(row['minplayers'])
                    maxplayers   = to_int(row['maxplayers'])
                    playingtime  = to_int(row['playingtime'])
                    minage       = to_int(row['minage'])
                    owned        = to_int(row['owned'], default=0)
                    trading      = to_int(row['trading'], default=0)
                    wanting      = to_int(row['wanting'], default=0)
                    wishing      = to_int(row['wishing'], default=0)
                    cursor.execute('''
                                   INSERT INTO Game (
                                       num, primary_name, year_published, min_players, max_players,
                                       description, playing_time, min_age, owned, trading, wanting, wishing
                                   ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                   ''', (
                                       num,
                                       row['primary'],
                                       yearpublished,
                                       minplayers,
                                       maxplayers,
                                       row['description'],
                                       playingtime,
                                       minage,
                                       owned,
                                       trading,
                                       wanting,
                                       wishing
                                   ))



                    game_id = cursor.lastrowid
                    num_to_id[row['num']] = game_id  # Stocker le mapping num → id_game

                    # Traitement des catégories
                    categories = [c.strip() for c in row['boardgamecategory'].split(',') if c.strip()]
                    for cat in categories:
                        cursor.execute('SELECT id_category FROM Category WHERE category_name = %s', (cat,))
                        existing = cursor.fetchone()
                        if not existing:
                            cursor.execute('INSERT INTO Category (category_name) VALUES (%s)', (cat,))
                            cat_id = cursor.lastrowid
                        else:
                            cat_id = existing['id_category']
                        cursor.execute('INSERT INTO Is_Category (id_game, id_category) VALUES (%s, %s)', (game_id, cat_id))

                    # Traitement des mécanismes (identique aux catégories)
                    mechanics = [m.strip() for m in row['boardgamemechanic'].split(',') if m.strip()]
                    for mech in mechanics:
                        cursor.execute('SELECT id_mechanic FROM Mechanic WHERE type_mechanic = %s', (mech,))
                        existing = cursor.fetchone()
                        if not existing:
                            cursor.execute('INSERT INTO Mechanic (type_mechanic) VALUES (%s)', (mech,))
                            mech_id = cursor.lastrowid
                        else:
                            mech_id = existing['id_mechanic']
                        cursor.execute('INSERT IGNORE INTO Has_Mechanic (id_game, id_mechanic) VALUES (%s, %s)', (game_id, mech_id))

                    # Traitement des extensions (schéma à adapter si nécessaire)
                    expansions = [e.strip() for e in row['boardgameexpansion'].split(',') if e.strip()]
                    for exp in expansions:
                        cursor.execute('INSERT INTO Expansion (name_expansion, id_game) VALUES (%s, %s)', (exp, game_id))

                    # Traitement des collaborateurs (designer, artist, publisher)
                    for role in ['designer', 'artist', 'publisher']:
                        collaborators = [c.strip() for c in row[f'boardgame{role}'].split(',') if c.strip()]
                        for name in collaborators:
                            cursor.execute('''
                                INSERT INTO Collaborator (name_collaborator, role_collaborator)
                                VALUES (%s, %s)
                                ON DUPLICATE KEY UPDATE id_collaborator=LAST_INSERT_ID(id_collaborator)
                            ''', (name, role))
                            collab_id = cursor.lastrowid
                            cursor.execute('INSERT INTO Worked_On (id_game, id_collaborator) VALUES (%s, %s)', (game_id, collab_id))

            # Étape 2: Insérer les évaluations depuis ratings.csv
            with open('./dataset/ratings.csv', 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    row = {k: v.replace('[', '').replace(']', '').replace("'", '').replace('"', '')  for k, v in row.items()}
                    game_num = row['num']
                    if game_num not in num_to_id:
                        continue  # Gérer les erreurs si nécessaire
                    game_id = num_to_id[game_num]
                    cursor.execute('''
                        INSERT INTO Rating (
                            num, name, published_year, ranking, average,
                            bayes_average, user_rated, url, thumbnail, id_game
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ''', (
                        row['num'], row['name'], row['year'], row['rank'],
                        row['average'], row['bayes_average'], row['users_rated'],
                        row['url'], row['thumbnail'], game_id
                    ))

            conn.commit()
            print("Données importées avec succès!")

    except Exception as e:
        conn.rollback()
        print(f"Erreur: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    process_csv()


# Supprimer les [] et les ''