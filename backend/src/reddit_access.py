import time
import os.path
from os import path


# reddit_token.txt example
"""
<epoch time as a float>
<reddit access_token>
"""

class Reddit_access:
    def __init__(self):
        self.TOKEN_PATH = "../reddit_token.txt"
            
    def get_token(self):
        if path.exists(self.TOKEN_PATH): # if previous token been made
            print(str(time.time()) + ": found an old token")
            with open(self.TOKEN_PATH, "r") as f:
                old_token = [i for i in f]
            if float(old_token[0]) < time.time(): # If old token is expired make new one
                print(str(time.time()) + ": found an old token expired token")
                new_token = str(time.time() + 3600) + "\n"
                new_token += get_new_token()
                with open(self.TOKEN_PATH, "w+") as f:
                    f.write(new_token)
                return new_token
            else: # Old token is still good
                print(str(time.time()) + ": found an old token that still works")
                return old_token[1]

        else:
            print(str(time.time()) + ": found no old token")
            with open(self.TOKEN_PATH, "w+") as f:
                new_token = str(time.time() + 3600) + "\n" + get_new_token()
                f.write(new_token)
            return new_token

    def get_new_token(self):
        # Let there be this file in backend/ with the app token 
        # https://github.com/reddit-archive/reddit/wiki/OAuth2#getting-started
        with open("../reddit_client_id.txt") as f:
            REDDIT_CLIENT_ID = f.read().strip()
        # Let there be this file in backend/ with the app secret
        # https://github.com/reddit-archive/reddit/wiki/OAuth2#getting-started
        with open("../reddit_secret.txt") as f:
            REDDIT_SECRET = f.read().strip()
        with open("../reddit_username.txt") as f:
            REDDIT_USERNAME = f.read().strip()
        with open("../reddit_username_password.txt") as f:
            REDDIT_USERNAME_PASSWORD = f.read().strip()

        if not REDDIT_CLIENT_ID or not REDDIT_SECRET or not REDDIT_USERNAME or not REDDIT_USERNAME_PASSWORD:
            print("Make sure that you make files, backend/reddit_client_id.txt, backend/reddit_secret.txt, backend/reddit_username.txt, backend/reddit_username_password.txt")
            raise FileNotFoundError()

        print( REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_USERNAME, REDDIT_USERNAME_PASSWORD)

        client_auth = requests.auth.HTTPBasicAuth(REDDIT_CLIENT_ID, REDDIT_SECRET)
        post_data = {"grant_type": "password", "username": REDDIT_USERNAME, "password": REDDIT_USERNAME_PASSWORD}
        headers = {"User-Agent": "Sidebar/0.1 by " + REDDIT_USERNAME}
        response = requests.post("https://www.reddit.com/api/v1/access_token", auth=client_auth, data=post_data, headers=headers)

        reddit_token = response.json()['access_token']
        return reddit_token
