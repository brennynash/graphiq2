import { Suspense } from "react";
import SettingsForm from "./_components/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <SettingsForm />
            </Suspense>
        </div>
    );
} 