#!flask/bin/python
from flask import Flask, jsonify, Response
from reddit_access import Reddit_access

app = Flask(__name__)

subreddits = []

MAX_SUBREDDIT_LEN = 25


"""
Get Reddit token
"""
import requests
import requests.auth
from pprint import pprint
import json
import re
from flask import request



REDDIT_CLIENT_ID = None
REDDIT_SECRET = None
REDDIT_USERNAME = None
REDDIT_USERNAME_PASSWORD = None



@app.route('/sidebar/api/v1.0/search', methods=['GET'])
def get_sidebar_subreddits():
    """
    Receives a single string of the subreddit.
    Returns a list of subreddits that were mentioned in the sidebar of the subreddit
    """
    subreddit = request.args.get('subreddit', default = '*', type = str)
    """
    Bad subreddit name input
    """
    if not subreddit:
        return Response("{None}", status=403, mimetype='application/json')
    if len(subreddit) > MAX_SUBREDDIT_LEN:
        return Response("{None}", status=403, mimetype='application/json')

    headers = {"User-Agent": "Sidebar by heliopphobicdude"}
    # Make a call to reddit asking for the sidebar of that subreddit
    r = requests.get('https://www.reddit.com/r/'+subreddit+'/about.json', headers=headers)
    data = r.json()

    print(data.keys())
    print("This is data")

    sidebar_raw = ""
    for k, v in data.items():
        if k == 'data':
            sidebar_raw = v['description']
            print("Heheheh", sidebar_raw)
    sidebars_list = [match.strip() for match in re.findall("\/r\/([A-Za-z0-9][A-Za-z0-9_]{2,20})", sidebar_raw)]
    print("This is the output of the regular expressions", sidebars_list)
    sidebars = set(sidebars_list)
    return jsonify({'subreddits': list(sidebars)})

if __name__ == '__main__':
    token_handler = Reddit_access()
    token = token_handler.get_token()
    app.run(debug=True, host="0.0.0.0", port=80)
