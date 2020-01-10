build:
	sudo apt install python3-pip
	cd backend && pip3 install -r "requirements.txt"
	cd backend/src  && python3 app.py
