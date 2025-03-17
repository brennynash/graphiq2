"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "./animatedButton";
import { toast } from "sonner";
import { useProjectForm } from "@/strore/useProjectForm";
import ProjectTypeSelector from "@/app/(home)/_components/ProjectTypeSelector";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    name: "",
    email: "",
    description: "",
  });

  const { isOpen, closeForm } = useProjectForm();
  const [showModal, setShowModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const projectTypes = [
    "Brand Strategy",
    "Identity",
    "Website",
    "Product design",
    "Other",
  ];
  const budgetRanges = [
    "Under 10k",
    "€10k-€20k",
    "€20k-€50k",
    "€50k-€100k",
    "€100k+",
  ];

  const handleButtonToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      setShowModal(true);
    } else {
      setFormData({
        projectType: "",
        budget: "",
        name: "",
        email: "",
        description: "",
      });
      closeForm();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!formData.projectType || !formData.budget || !formData.name || !formData.email || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Email sent successfully");
        setIsDirty(false);
        closeForm();
        setFormData({
          projectType: "",
          budget: "",
          name: "",
          email: "",
          description: "",
        });
      } else {
        toast.error("Unable to send email, please try again.");
      }
    } catch (error) {
      console.error("Request failed", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  const SelectButton = ({ field, value, currentValue }) => (
    <motion.button
      type="button"
      onClick={() => handleButtonToggle(field, value)}
      className={`px-4 py-2 text-sm font-light rounded-full border transition-colors relative hover:border-neutral-black duration-300 ${currentValue === value
        ? "bg-neutral-black text-neutral-white"
        : "bg-neutral-white text-neutral-black border-neutral-light-grey hover:border-neutral-black"
        }`}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {value}
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-neutral-black/50 z-[1001]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-y-2 max-h-screen z-[1002] text-neutral-black  bg-neutral-white overflow-y-auto rounded-xl hidden-scrollbar lg:w-1/2 lg:left-2 max-lg:inset-x-4"
          >
            <div className="min-h-screen p-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold lg:text-5xl">
                    Start a project
                  </h1>
                  <button
                    onClick={handleClose}
                    className="block p-2 bg-primary-pink rounded-full transition-colors lg:hidden"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <ProjectTypeSelector
                    selectedType={formData.projectType}
                    onSelect={(type) => {
                      setFormData(prev => ({ ...prev, projectType: type }));
                      setIsDirty(true);
                    }}
                  />

                  <div>
                    <h2 className="text-xl mb-4 font-standard">
                      Do you have a budget range?
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {budgetRanges.map((range) => (
                        <SelectButton
                          key={range}
                          field="budget"
                          value={range}
                          currentValue={formData.budget}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl mb-4 font-standard">
                      Your information
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-full border border-neutral-light-grey focus:outline-none focus:border-black hover:border-black transition-colors duration-300"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-full border border-neutral-light-grey focus:outline-none focus:border-black hover:border-black transition-colors duration-300"
                        />
                      </div>
                      <textarea
                        name="description"
                        placeholder="Sell your dream!"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-light-grey focus:outline-none focus:border-black hover:border-black transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="rounded-full flex justify-end ml-auto">
                    <AnimatedButton
                      title="Submit"
                      containerStyles="custom-button"
                    />
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* "Forgot to submit" Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div className="fixed mx-4 inset-0 z-[1003] flex items-center justify-end p-4 lg:mr-8">
                <div className="bg-neutral-white rounded-2xl p-6 pt-16 max-w-sm h-[20rem] w-full shadow-lg flex flex-col items-center justify-between">
                  <h2 className="text-4xl font-semibold text-neutral-black text-center">
                    Forgot to press Submit?
                  </h2>
                  <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowModal(false)} className="bg-neutral-white">
                      Back to form
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setIsDirty(false);
                        handleClose();
                      }}
                      className="bg-neutral-white"
                    >
                      Close anyway
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectForm;
