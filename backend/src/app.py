#!flask/bin/python
from flask import Flask, jsonify, Response

app = Flask(__name__)

subreddits = []

MAX_SUBREDDIT_LEN = 25

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
    app.run(debug=True)
