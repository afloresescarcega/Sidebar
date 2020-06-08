FROM python:3

COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
CMD [ "python", "src/app.py" ]
