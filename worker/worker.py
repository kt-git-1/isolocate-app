import os
import json
import time
import uuid
import psycopg2
import pandas as pd
from psycopg2.extras import RealDictCursor

DB_URL = os.getenv("DATABASE_URL")

def connect():
    return psycopg2.connect(DB_URL, cursor_factory=RealDictCursor)

def get_queued_job(conn):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT * FROM analysis_run WHERE status = 'queued' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED"
        )
        job = cur.fetchone()
        if job:
            cur.execute(
                "UPDATE analysis_run SET status = 'running', started_at = NOW() WHERE id = %s",
                (job["id"],),
            )
            conn.commit()
        return job

def get_reference_dataset_info(conn, dataset_id):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT * FROM reference_dataset WHERE id = %s",
            (dataset_id,),
        )
        return cur.fetchone()

def run_dummy_analysis(input_data, reference_path):
    # input_data は {"values": [ ... ]} のような形式を想定
    values = input_data.get("values", [])
    ref_df = pd.read_csv(reference_path)
    ref_mean = ref_df["value"].mean() if "value" in ref_df.columns else 0
    input_mean = sum(values) / len(values) if values else 0
    # ダミーとして両者の和を返す
    return {
        "input_mean": input_mean,
        "ref_mean": ref_mean,
        "combined": input_mean + ref_mean
    }

def save_result(conn, job_id, result_json, error=None):
    status = "succeeded" if error is None else "failed"
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE analysis_run SET status = %s, result_json = %s, error_message = %s, finished_at = NOW() WHERE id = %s",
            (status, json.dumps(result_json), error, job_id),
        )
        conn.commit()

def main():
    conn = connect()
    print("Worker started, polling for jobs...")
    while True:
        job = get_queued_job(conn)
        if job:
            try:
                input_data = job["input_json"]
                ref_info = get_reference_dataset_info(conn, job["reference_dataset_id"])
                ref_path = ref_info["data_path"]
                result = run_dummy_analysis(input_data, ref_path)
                save_result(conn, job["id"], result)
                print(f"Job {job['id']} done")
            except Exception as e:
                save_result(conn, job["id"], {}, error=str(e))
                print(f"Job {job['id']} failed: {e}")
        else:
            time.sleep(5)

if __name__ == "__main__":
    main()
