FROM python:3.8

RUN apt-get update
RUN apt-get -y install \
    tesseract-ocr \
    tesseract-ocr-jpn \
    libgl1-mesa-dev; 
RUN apt-get clean

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update -y && apt install libpq-dev -y

WORKDIR /opt/app

ENV POETRY_VERSION=1.1.4
RUN pip install "poetry==$POETRY_VERSION"
COPY poetry.lock pyproject.toml ./
COPY src src

RUN poetry build
RUN cd dist
RUN pip install .


EXPOSE 8080
WORKDIR /opt/app/src
ENTRYPOINT uvicorn main:app --port 8080 --host 0.0.0.0