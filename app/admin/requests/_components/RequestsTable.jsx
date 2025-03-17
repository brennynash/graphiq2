"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function RequestsTable() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("/api/admin/requests");
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            toast.error("Failed to fetch requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const response = await fetch(`/api/admin/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                toast.success(`Request ${status} successfully`);
                fetchRequests();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to update request status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "text-green-600 bg-green-50";
            case "rejected":
                return "text-red-600 bg-red-50";
            default:
                return "text-yellow-600 bg-yellow-50";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
                return <CheckCircle size={16} />;
            case "rejected":
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const filteredRequests = requests.filter((request) => {
        if (filter === "all") return true;
        return request.status.toLowerCase() === filter;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4">
                {["all", "pending", "approved", "rejected"].map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-xl transition-colors ${filter === filterOption
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredRequests.map((request) => (
                        <motion.div
                            key={request.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{request.projectTitle}</h3>
                                    <div className="flex items-center gap-6 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} />
                                            <span>{request.email}</span>
                                        </div>
                                        {request.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} />
                                                <span>{request.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {getStatusIcon(request.status)}
                                        {request.status}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-semibold">
                                        {selectedRequest.projectTitle}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">Client Name</label>
                                            <p className="font-medium">{selectedRequest.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Email</label>
                                            <p className="font-medium">{selectedRequest.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Project Type</label>
                                            <p className="font-medium">{selectedRequest.projectType}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Budget Range</label>
                                            <p className="font-medium">{selectedRequest.budget}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Submission Date</label>
                                            <p className="font-medium">
                                                {new Date(selectedRequest.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Status</label>
                                            <p className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                                                {getStatusIcon(selectedRequest.status)}
                                                {selectedRequest.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">Project Description</label>
                                        <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                                            <p className="whitespace-pre-wrap">
                                                {selectedRequest.description}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedRequest.status === "pending" && (
                                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                                            >
                                                <XCircle size={20} />
                                                <span>Reject</span>
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(selectedRequest.id, "approved")}
                                                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle size={20} />
                                                <span>Approve</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
} 