"use client";

import * as React from "react";

type Props = {
  keyName: string;
  size?: number | null;
  lastModified?: string | null;
};

function formatSize(bytes?: number | null) {
  if (bytes === undefined || bytes === null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

const FileCard: React.FC<Props> = ({ keyName, size, lastModified }) => {
  const name = keyName?.split("/").filter(Boolean).pop() || keyName;

  return (
    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-900/60 rounded-md shadow-sm border">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded flex items-center justify-center text-sky-700 dark:text-sky-200 font-semibold shrink-0">
          {name?.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{name}</div>
          <div className="text-xs text-muted-foreground truncate">{keyName}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
        <div className="font-medium text-sm">{formatSize(size ?? null)}</div>
        <div className="text-xs">{lastModified ? new Date(lastModified).toLocaleString() : "-"}</div>
      </div>
    </div>
  );
};

export default FileCard;
