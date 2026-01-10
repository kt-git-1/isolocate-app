-- 参照データセットの初期データを挿入
-- modernデータセット（デフォルト）
INSERT INTO reference_dataset (id, name, version, description, data_path, checksum)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'modern',
  '1.0',
  '現代同位体データセット',
  '/reference-datasets/raw_data.csv',
  NULL
)
ON CONFLICT (id) DO NOTHING;
