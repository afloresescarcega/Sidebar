all:

backend:
	cd backend
	sudo apt install python3-pip
	pip3 install -r requirements.txt
	cd src
	python3 app.py
