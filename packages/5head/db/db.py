import psycopg2, dotenv, os

dotenv.load_dotenv()

class SqlDB:
    
    def __init__(self):
        try:
            self.client = psycopg2.connect(os.getenv('SQL_URL'))

            self.cursor = self.client.cursor()

            print("[5Head]: Successfully connected to PostgreSQL")
        except (Exception, psycopg2.Error) as error :
            print ("Error while connecting to PostgreSQL", error)
    
    def queryPlayer(self, id):
        self.cursor.execute(f'SELECT * FROM stats WHERE userid = {id}')
        user = self.cursor.fetchone()
        print(user)
        if user == None:
            return False
        else:
            return True

    def add_user(self, data):
        try:
            self.cursor.execute("INSERT INTO stats (userid, bestmoves, checkmates, totalmoves, wins, loses, draws) " + 
                                f"VALUES({data['id']}, {1 if data['is_best_move'] else 0}, 0, 1, 0, 0, 0);")
            
            print(f"User {data['id']} successfully added")

            self.client.commit()
            
        except (Exception, psycopg2.Error) as error:
            print(f"[5head]: Error inserting user {data['id']}")
            print(error)