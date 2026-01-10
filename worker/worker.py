import os
import json
import time
import uuid
import psycopg2
import csv
from statistics import mean
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
            # JSONフィールドをパース
            if job.get("input_json") and isinstance(job["input_json"], str):
                job["input_json"] = json.loads(job["input_json"])
            if job.get("params_json") and isinstance(job["params_json"], str):
                job["params_json"] = json.loads(job["params_json"])
        return job

def get_reference_dataset_info(conn, dataset_id):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT * FROM reference_dataset WHERE id = %s",
            (dataset_id,),
        )
        return cur.fetchone()

def run_dummy_analysis(input_data, reference_path):
    """ダミー分析を実行"""
    import os
    
    # ファイルパスが存在するか確認
    if not os.path.exists(reference_path):
        raise FileNotFoundError(f"参照データセットファイルが見つかりません: {reference_path}")
    
    values = input_data.get("values", [])
    ref_values = []
    
    try:
        with open(reference_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # CSVファイルの列名に応じて値を取得（d13C, d15N, d34Sなど）
                # 最初の数値列を見つける
                for key, value in row.items():
                    try:
                        ref_values.append(float(value.strip()))
                        break
                    except (ValueError, AttributeError):
                        continue
    except Exception as e:
        raise ValueError(f"参照データセットの読み込みに失敗しました: {e}")
    
    ref_mean = mean(ref_values) if ref_values else 0
    input_mean = mean(values) if values else 0
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
    if not DB_URL:
        print("エラー: DATABASE_URL環境変数が設定されていません")
        return
    
    try:
        conn = connect()
        print("Worker started, polling for jobs...")
        while True:
            try:
                job = get_queued_job(conn)
                if job:
                    try:
                        input_data = job["input_json"]
                        if not job.get("reference_dataset_id"):
                            raise ValueError("reference_dataset_idが設定されていません")
                        
                        ref_info = get_reference_dataset_info(conn, job["reference_dataset_id"])
                        if not ref_info:
                            raise ValueError(f"参照データセット {job['reference_dataset_id']} が見つかりません")
                        
                        ref_path = ref_info.get("data_path")
                        if not ref_path:
                            raise ValueError(f"参照データセットのdata_pathが設定されていません")
                        
                        result = run_dummy_analysis(input_data, ref_path)
                        save_result(conn, job["id"], result)
                        print(f"Job {job['id']} done")
                    except Exception as e:
                        save_result(conn, job["id"], {}, error=str(e))
                        print(f"Job {job['id']} failed: {e}")
                else:
                    time.sleep(5)
            except psycopg2.OperationalError as e:
                print(f"データベース接続エラー: {e}")
                print("再接続を試みます...")
                time.sleep(5)
                try:
                    conn.close()
                except:
                    pass
                conn = connect()
            except Exception as e:
                print(f"予期しないエラー: {e}")
                time.sleep(5)
    except KeyboardInterrupt:
        print("\nワーカーを停止します...")
    except Exception as e:
        print(f"致命的なエラー: {e}")
    finally:
        try:
            conn.close()
        except:
            pass

if __name__ == "__main__":
    main()
