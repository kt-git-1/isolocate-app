FROM python:3.11-slim

WORKDIR /worker

# 必要なパッケージをインストール
COPY worker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY worker .

CMD ["python", "-u", "worker.py"]
