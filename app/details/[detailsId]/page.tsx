"use client";

import Link from "next/link";
import search from "@/actions/search";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Details() {
    const { detailsId } = useParams(); // Get the scanned ID from the URL
    const [data, setData] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof detailsId === 'string') {
            search(detailsId).then(setData).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
        setLoading(false);
    }, [detailsId]);

    if (loading) return <LoadingData />;

    if (!data) return <ErrorDisplay id={typeof detailsId === 'string' ? detailsId : ''} />;

    return (
        <div className="flex items-center justify-center h-[100dvh] -mt-28 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Details for ID: {detailsId}</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && Object.entries(data).map(([key, value]) => (
                        <div key={key} className="mb-4 last:mb-0">
                            <dt className="font-semibold text-gray-700 dark:text-gray-300">{key}</dt>
                            <dd className="mt-1 text-gray-900 dark:text-gray-100">{String(value)}</dd>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

function ErrorDisplay({ id }: { id: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[100dvh] -mt-28">
            <p>No data found for ID: {id}</p>
            <Button className="mt-4">
                <Link href="/">Go back</Link>
            </Button>
        </div>
    );
}

function LoadingData() {
    return (
        <div className="flex items-center justify-center h-[100dvh] -mt-28 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                </CardHeader>
                <CardContent>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="mb-4 last:mb-0">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}