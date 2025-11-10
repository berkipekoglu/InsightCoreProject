'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getSessionReplay } from '../../../../../lib/api';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

export default function ReplayPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const sessionId = params.sessionId as string;
    const projectId = searchParams.get('projectId');

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const playerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('insight-token');
        if (!token) {
            router.push('/');
            return;
        }

        if (projectId && sessionId && playerRef.current) {
            const fetchReplayData = async () => {
                try {
                    const replayData = await getSessionReplay(projectId, sessionId);
                    if (replayData && replayData.length > 0) {
                        setEvents(replayData);
                        new rrwebPlayer({
                            target: playerRef.current!,
                            props: {
                                events: replayData,
                                autoPlay: true,
                            },
                        });
                    } else {
                        setError('No replay events found for this session.');
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch replay data.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReplayData();
        } else if (!projectId) {
            setError('Project ID is missing.');
            setIsLoading(false);
        }
    }, [projectId, sessionId, router]);

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-black">
            <div className="w-full max-w-7xl">
                <h1 className="text-2xl font-bold mb-4 text-white">Session Replay</h1>
                <div className="border border-gray-700 rounded-lg bg-gray-900 p-4">
                    {isLoading && <div className="text-center text-white">Loading replay...</div>}
                    {error && <div className="text-center text-red-500">Error: {error}</div>}
                    <div ref={playerRef} className="rr-player"></div>
                </div>
                {/* Placeholder for event timeline */}
                <div className="mt-4 text-white">
                    <h2 className="text-xl font-bold">Event Timeline</h2>
                    <p className="text-gray-400">Timeline UI will be implemented here.</p>
                </div>
            </div>
        </main>
    );
}
