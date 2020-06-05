# Sidebar
Explore subreddits that are mentioned in a sidebar of another subreddit.

## Setting up
- [ ] Have a reddit account 
- [ ] Go to https://www.reddit.com/prefs/apps
  - [ ] "Create another app" or "create app"
  - [ ] Give it a name
  - [ ] Select "script" as the type of application
  - [ ] For redirect url, put "http://localhost:8080". For more information why, [read here](https://praw.readthedocs.io/en/latest/getting_started/authentication.html).
- [ ] Put `client_id` in backend/reddit_client_id.txt [found here](https://i.stack.imgur.com/O6ZGS.png)
- [ ] Put `client_secret` in backend/reddit_secret.txt
- [ ] Put reddit username in backend/reddit_username.txt
- [ ] Put reddit password in backend/reddit_username_password.txt 
- [ ] Make sure these four files are `.gitignore`
- [ ] bash`cd backend`
- [ ] bash`pip3 install -r requirements.txt`
- [ ] bash`python3 src/app.py`

Open up 
http://0.0.0.0/sidebar/





## Usage

Follow "Setting up", then use API end point "http://0.0.0.0/sidebar/api/v1.0/search?subreddit=SUBREDDIT_NAME_HERE"
Follow "Setting up", then use "http://0.0.0.0/sidebar/" for web
