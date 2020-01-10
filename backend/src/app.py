#!flask/bin/python
from flask import Flask, jsonify, Response

app = Flask(__name__)

subreddits = []

MAX_SUBREDDIT_LEN = 25


"""
Get Reddit token
"""
import requests
import requests.auth

REDDIT_CLIENT_ID = None
REDDIT_SECRET = None
REDDIT_USERNAME = None
REDDIT_USERNAME_PASSWORD = None



@app.route('/sidebar/api/v1.0/tasks', methods=['GET'])
def get_sidebar_subreddits(subreddit):
    """
    Receives a single string of the subreddit.
    Returns a list of subreddits that were mentioned in the sidebar of the subreddit
    """

    """
    Bad subreddit name input
    """
    if not subreddit:
        return Response("{None}", status=403, mimetype='application/json')
    if len(subreddit) > MAX_SUBREDDIT_LEN:
        return Response("{None}", status=403, mimetype='application/json')

    # Make a call to reddit asking for the sidebar of that subreddit
    
    return jsonify({'subreddits': subreddits})

if __name__ == '__main__':
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
    print(response.json())
    """
    End of "Get Reddit token"
    """
    app.run(debug=True)
