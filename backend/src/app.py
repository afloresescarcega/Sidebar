#!flask/bin/python
"""
This module runs the Sidebar static website server and api server
for calls from the user in the frontend

(c) Alex Flores Escarcega 2020
"""
import os
from flask import request
import re
import json
from pprint import pprint
import requests.auth
import requests
from flask import Flask, jsonify, Response, render_template
from reddit_access import Reddit_access

APP = Flask(__name__)  # APP


MAX_SUBREDDIT_LEN = 25


REDDIT_CLIENT_ID = None
REDDIT_SECRET = None
REDDIT_USERNAME = None
REDDIT_USERNAME_PASSWORD = None


@APP.route("/sidebar")
def index():
    """
    This endpoint serves up the index page for the webapp
    ---
    tags:
        -
    """
    path = os.getcwd()

    print(path)
    return render_template(
        "index.html",
        message="Find Subreddits mentioned in Others' Sidebars")


@APP.route('/sidebar/api/v1.0/search', methods=['GET'])
def get_sidebar_subreddits():
    """
    Receives a single string of the subreddit.
    Returns a list of subreddits that were mentioned in the sidebar of the subreddit
    """
    SUBREDDIT = request.args.get('subreddit', default='*', type=str)
    """
    Bad subreddit name input
    """
    if not SUBREDDIT:
        return Response("{None}", status=403, mimetype='application/json')
    if len(SUBREDDIT) > MAX_SUBREDDIT_LEN:
        return Response("{None}", status=403, mimetype='application/json')

    headers = {"User-Agent": "Sidebar by heliopphobicdude"}
    # Make a call to reddit asking for the sidebar of that subreddit
    r = requests.get(
        'https://www.reddit.com/r/' +
        SUBREDDIT +
        '/about.json',
        headers=headers)
    data = r.json()

    print(data.keys())
    print("This is data")

    sidebar_raw = ""
    for k, v in data.items():
        if k == 'data':
            sidebar_raw = v['description']
            print("Heheheh", sidebar_raw)
    sidebars_list = [match.strip().lower() for match in re.findall(
        r"r\/([A-Za-z0-9][A-Za-z0-9_]{2,20})", sidebar_raw)]
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
            link = {"source": query_subreddit_id, "target": i}
            links.append(link)

    response = jsonify({'subreddits': list(sidebars),
                    'nodes': list(nodes), 'links': list(links)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    token_handler = Reddit_access()
    token = token_handler.get_token()
    APP.run(debug=True, host="0.0.0.0", port=80)
