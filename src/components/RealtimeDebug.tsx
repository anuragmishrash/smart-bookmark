"use client";

import { useState } from "react";
import { Activity, X, ChevronUp, ChevronDown } from "lucide-react";

type Log = {
    time: string;
    message: string;
    type: "info" | "success" | "error";
};

type Props = {
    status: string;
    logs: Log[];
};

export default function RealtimeDebug({ status, logs }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium shadow-xl backdrop-blur-xl transition-colors ${status === "SUBSCRIBED"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : status === "CHANNEL_ERROR" || status === "TIMED_OUT"
                            ? "border-red-500/50 bg-red-500/10 text-red-400"
                            : "border-sky-500/50 bg-slate-900/80 text-slate-300"
                    }`}
            >
                <Activity className="h-3.5 w-3.5" />
                <span>Realtime: {status}</span>
                {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                    <ChevronUp className="h-3.5 w-3.5" />
                )}
            </button>

            {isOpen && (
                <div className="w-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                        <span className="text-xs font-semibold text-slate-300">
                            Debug Logs
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-500 hover:text-slate-300"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
                        {logs.length === 0 ? (
                            <p className="text-center text-[10px] text-slate-600">
                                No events received yet.
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-2 text-[10px]">
                                        <span className="shrink-0 font-mono text-slate-600">
                                            {log.time}
                                        </span>
                                        <span
                                            className={`break-all ${log.type === "error"
                                                    ? "text-red-400"
                                                    : log.type === "success"
                                                        ? "text-emerald-400"
                                                        : "text-slate-300"
                                                }`}
                                        >
                                            {log.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
