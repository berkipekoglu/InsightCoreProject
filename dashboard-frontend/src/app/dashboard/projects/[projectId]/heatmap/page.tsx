'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHeatmap } from '../../../../../lib/api';
import h337 from 'heatmap.js';

// Heatmap.js wrapper component
const HeatmapComponent = ({ data }: { data: any[] }) => {
    const heatmapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (heatmapContainerRef.current && data.length > 0) {
            const heatmapInstance = h337.create({
                container: heatmapContainerRef.current,
                radius: 90,
            });
            heatmapInstance.setData({
                max: 5, // Placeholder max value
                data: data,
            });
        }
    }, [data]);

    return <div ref={heatmapContainerRef} className="absolute top-0 left-0 w-full h-full" />;
};


export default function HeatmapPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId as string;

    const [heatmapData, setHeatmapData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [urlToFetch, setUrlToFetch] = useState('http://localhost:3001/dashboard'); // Example URL

    useEffect(() => {
        const token = localStorage.getItem('insight-token');
        if (!token) {
            router.push('/');
            return;
        }

        if (projectId && urlToFetch) {
            const fetchHeatmapData = async () => {
                try {
                    const data = await getHeatmap(projectId, urlToFetch);
                    setHeatmapData(data.data || []);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch heatmap data.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHeatmapData();
        }
    }, [projectId, urlToFetch, router]);

    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-7xl">
                <h1 className="text-3xl font-bold mb-4">Heatmap</h1>
                <div className="bg-gray-800 p-4 rounded-lg mb-4 flex gap-4 items-center">
                    <input 
                        type="text"
                        value={urlToFetch}
                        onChange={(e) => setUrlToFetch(e.target.value)}
                        placeholder="Enter URL to view heatmap for"
                        className="flex-grow"
                    />
                     {/* Placeholder for device/map type toggles */}
                    <div className="flex gap-2">
                        <button className="bg-gray-700">Desktop</button>
                        <button className="bg-gray-600">Click</button>
                    </div>
                </div>

                <div className="relative border border-gray-700 rounded-lg" style={{ height: '80vh' }}>
                    {isLoading && <div className="flex h-full items-center justify-center">Loading heatmap...</div>}
                    {error && <div className="flex h-full items-center justify-center text-red-500">Error: {error}</div>}
                    
                    {/* Iframe to show the website */}
                    <iframe 
                        src={urlToFetch}
                        className="w-full h-full bg-white"
                        title="Website Preview"
                    />
                    
                    {/* Heatmap overlay */}
                    {!isLoading && !error && <HeatmapComponent data={heatmapData} />}
                </div>
            </div>
        </main>
    );
}
