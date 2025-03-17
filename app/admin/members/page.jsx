import MembersManager from './_components/MembersManager';

export default function MembersPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <p className="text-gray-600">Manage your team members information.</p>
            </div>
            <MembersManager />
        </div>
    );
} 