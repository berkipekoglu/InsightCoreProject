'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSessions } from '../../../../../lib/api';

interface Session {
    session_id: string;
    start_time: string;
    duration: number | null;
    device_type: string;
    browser: string;
    os: string;
    has_errors: number;
    has_rage_clicks: number;
}

export default function SessionsPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId as string;

    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('insight-token');
        if (!token) {
            router.push('/');
            return;
        }

        if (projectId) {
            const fetchSessions = async () => {
                try {
                    const sessionData = await getSessions(projectId);
                    setSessions(sessionData.data || []);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch sessions.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchSessions();
        }
    }, [projectId, router]);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading sessions...</div>;
    }

    if (error) {
        return <div className="flex min-h-screen items-center justify-center text-red-500">Error: {error}</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Sessions for Project {projectId}</h1>
                <div className="bg-gray-800 border border-gray-700 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4">Session ID</th>
                                <th className="p-4">Start Time</th>
                                <th className="p-4">Browser</th>
                                <th className="p-4">OS</th>
                                <th className="p-4">Errors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <tr key={session.session_id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-4">
                                            <Link href={`/dashboard/sessions/${session.session_id}?projectId=${projectId}`} className="text-blue-400 hover:underline">
                                                {session.session_id}
                                            </Link>
                                        </td>
                                        <td className="p-4">{new Date(session.start_time).toLocaleString()}</td>
                                        <td className="p-4">{session.browser}</td>
                                        <td className="p-4">{session.os}</td>
                                        <td className="p-4">{session.has_errors > 0 ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-400">No sessions found for this project yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
