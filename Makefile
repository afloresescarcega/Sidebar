build:
	cd backend
	@echo
	sudo apt install python3-pip
	pwd
	pip3 install -r "requirements.txt"
	cd src
	@echo
	python3 app.py
