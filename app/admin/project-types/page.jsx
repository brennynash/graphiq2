import { Suspense } from "react";
import ProjectTypesTable from "./_components/ProjectTypesTable";

export default function ProjectTypesPage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Manage Project Types</h1>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ProjectTypesTable />
            </Suspense>
        </div>
    );
} 