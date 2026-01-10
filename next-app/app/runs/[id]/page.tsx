'use client';

import { useEffect, useState } from 'react';

export default function RunPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [status, setStatus] = useState('queued');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/analysis-runs/${id}`);
      if (res.ok) {
        const json = await res.json();
        setStatus(json.status);
        setResult(json.result_json);
        setError(json.error_message);
        if (json.status === 'succeeded' || json.status === 'failed') {
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
        setError('ジョブが見つかりませんでした');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">ジョブ {id}</h1>
      <p className="mt-2">ステータス: {status}</p>
      {status === 'succeeded' && result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
      {status === 'failed' && error && (
        <p className="mt-4 text-red-500">エラー: {error}</p>
      )}
      {status === 'queued' || status === 'running' ? <p className="mt-4">処理中です...</p> : null}
    </div>
  );
}
