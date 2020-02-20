#!flask/bin/python
from flask import Flask, jsonify, Response, render_template
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
import os



REDDIT_CLIENT_ID = None
REDDIT_SECRET = None
REDDIT_USERNAME = None
REDDIT_USERNAME_PASSWORD = None

@app.route("/sidebar")
def index():
    path = os.getcwd()

    print(path)
    return render_template("index.html", message="Hello Flask!");


@app.route('/sidebar/api/v1.0/search', methods=['GET'])
def get_sidebar_subreddits():
    """
    Receives a single string of the subreddit.
    Returns a list of subreddits that were mentioned in the sidebar of the subreddit
    """
    SUBREDDIT = request.args.get('subreddit', default = '*', type = str)
    """
    Bad subreddit name input
    """
    if not SUBREDDIT:
        return Response("{None}", status=403, mimetype='application/json')
    if len(SUBREDDIT) > MAX_SUBREDDIT_LEN:
        return Response("{None}", status=403, mimetype='application/json')

    headers = {"User-Agent": "Sidebar by heliopphobicdude"}
    # Make a call to reddit asking for the sidebar of that subreddit
    r = requests.get('https://www.reddit.com/r/'+SUBREDDIT+'/about.json', headers=headers)
    data = r.json()

    print(data.keys())
    print("This is data")

    sidebar_raw = ""
    for k, v in data.items():
        if k == 'data':
            sidebar_raw = v['description']
            print("Heheheh", sidebar_raw)
    sidebars_list = [match.strip().lower() for match in re.findall("\/r\/([A-Za-z0-9][A-Za-z0-9_]{2,20})", sidebar_raw)]
    print("This is the output of the regular expressions", sidebars_list)
    sidebars = list(set(sidebars_list))

    # Create the graph
    nodes = []
    links = []
    query_subreddit_id = -1

    # Nodes
    for i, subreddit_name in enumerate(sidebars):
        if subreddit_name != SUBREDDIT:
            node = {"id": i, "name": subreddit_name}
            nodes.append(node)

    node = {"id": -1, "name": SUBREDDIT}
    nodes.append(node)
    
    # Links
    for i, subreddit_name in enumerate(sidebars):
        if subreddit_name != SUBREDDIT:
            link = {"source": query_subreddit_id, "target":i}
            links.append(link)


    return jsonify({'subreddits': list(sidebars), 'nodes': list(nodes), 'links': list(links)})

if __name__ == '__main__':
    token_handler = Reddit_access()
    token = token_handler.get_token()
    app.run(debug=True, host="0.0.0.0", port=80)
