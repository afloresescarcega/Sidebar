build:
	cd backend
	@echo
	sudo apt install python3-pip
	cd backend
	pip3 install -r "requirements.txt"
	cd src
	@echo
	python3 app.py
