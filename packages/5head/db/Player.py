import psycopg2, dotenv, os

class Player:
    """
    Class that gets different stats from exisitng players in the DB
    """
    def __init__(self, conn, id):
        self.client = conn
        self.cursor = self.client.cursor()
        try:
            self.cursor.execute(f"SELECT * FROM stats WHERE userid = {id};")
            self.player_stats = self.cursor.fetchone()

        except (Exception, psycopg2.Error) as error :
            print (f"Error while fetching stats from {id}", error)
            self.player_stats = None

    def get_wins(self):
        return self.player_stats[4]

    def get_loses(self):
        return self.player_stats[5]

    def get_draws(self):
        return self.player_stats[6]

    def get_best_moves(self):
        return self.player_stats[1]

    def get_checkmates(self):
        return self.player_stats[2]

    def get_total_moves(self):
        return self.player_stats[3]

    def get_accuracy(self):
        return self.get_best_moves() / self.get_total_moves()
    
    def get_id(self):
        return self.player_stats[0]
    
    # Logic for updating accuracy
    def update_accuracy(self, selected_best_move):
        

        total_moves = self.get_total_moves() + 1

        if selected_best_move:
            best_moves = self.get_best_moves() + 1
            
            self.cursor.execute(f"UPDATE stats SET bestmoves={best_moves}, totalmoves={total_moves} WHERE userid = {self.get_id()}")
        
        else:

            self.cursor.execute(f"UPDATE stats SET totalmoves={total_moves} WHERE userid = {self.get_id()}")            
        
        self.client.commit()

    
