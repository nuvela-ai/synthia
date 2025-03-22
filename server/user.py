





class User:
    def __init__(self, id):
        self.id = id
        self.selection_indices = {}

    def authenticate(self, password):
        if self.password == password:
            self.is_authenticated = True
            return True
        return False

    def add_selection_index(self, selection_index, paper_id):
        self.selection_indices[paper_id] = selection_index



def add_fragment(user_id,fragment):
    user = User(user_id)
    user.add_fragment(fragment)
    return user