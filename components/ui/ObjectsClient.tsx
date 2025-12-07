"use client"

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import FileCard from "@/components/ui/FileCard";

type FileItem = {
  Key: string;
  Size?: number;
  LastModified?: string | null;
};

type ApiResponse = {
  files?: FileItem[] | null;
  folders?: string[] | null;
};

const ObjectsClient: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async (p?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const url = p ? `/api/objects?prefix=${encodeURIComponent(p)}` : `/api/objects`;
      const res = await fetch(url);
      console.log(res)
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(prefix);
  }, [prefix]);

  const onFolderClick = (folder: string) => {
    setPrefix(folder);
  };

  const onUp = () => {
    if (!prefix) return;
    const trimmed = prefix.replace(/\/$/, "").split("/");
    trimmed.pop();
    const next = trimmed.length ? trimmed.join("/") + "/" : undefined;
    setPrefix(next || null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const uploadKey = prefix ? `${prefix}${file.name}` : file.name;

  // request presigned URL (only required param: key)
  const presignRes = await fetch(`/api/uploads?key=${encodeURIComponent(uploadKey)}`, { method: "PUT" });
  if (!presignRes.ok) throw new Error("Failed to get presigned URL");
  const { url } = await presignRes.json();

  // upload file using presigned URL
  const putRes = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
  if (!putRes.ok) throw new Error("Upload failed");

  await fetchData(prefix);
  if (fileInputRef.current) fileInputRef.current.value = "";
};

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onUp}
            className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-sm"
          >
            Back
          </button>
          <div className="text-sm text-muted-foreground">{prefix || "/"}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <div className="text-sm text-muted-foreground">{loading ? 'Loading...' : ''}</div>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-3">
        {data?.folders && data.folders.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase text-muted-foreground">Folders</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.folders.map((f) => (
                <button
                  key={f}
                  onClick={() => onFolderClick(f)}
                  className="text-left p-3 rounded-md border bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <div className="font-medium">{f.replace(/\/$/, '').split('/').pop()}</div>
                  <div className="text-xs text-muted-foreground">{f}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {data?.files && data.files.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase text-muted-foreground">Files</div>
            <div className="grid grid-cols-1 gap-2">
              {data.files.map((f) => (
                <FileCard key={f.Key} keyName={f.Key} size={f.Size} lastModified={f.LastModified as any} />
              ))}
            </div>
          </div>
        )}

        {!loading && (!data || ((data.files?.length || 0) === 0 && (data.folders?.length || 0) === 0)) && (
          <div className="text-sm text-muted-foreground">No files or folders found.</div>
        )}
      </div>
    </div>
  );
};

export default ObjectsClient;
