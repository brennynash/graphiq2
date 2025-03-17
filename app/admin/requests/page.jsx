import { Suspense } from "react";
import RequestsTable from "./_components/RequestsTable";

export default function RequestsPage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Project Requests</h1>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <RequestsTable />
            </Suspense>
        </div>
    );
} 