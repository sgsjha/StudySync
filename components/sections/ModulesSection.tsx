"use client";
import React, { useState, useEffect } from "react";
import * as Progress from "@radix-ui/react-progress";
import ModuleDetails from "../details/ModuleDetails"; // full-page details view
import { auth, db } from "@/firebase-config";
import { collection, query, getDocs, addDoc } from "firebase/firestore";

// Define a TypeScript interface for module data
interface ModuleType {
  id: string;
  label: string;
  value: number;
  lecturer: string;
  topics: string[];
  notes: string;
  grades: string;
  assignments: string[];
  // Additional fields like year, semester can be added if needed
}

export function ModulesSection() {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch user modules from Firestore
  useEffect(() => {
    async function fetchModules() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        const modulesRef = collection(db, "users", user.uid, "modules");
        const q = query(modulesRef);
        const snapshot = await getDocs(q);
        const fetchedModules = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ModuleType)
        );
        setModules(fetchedModules);
      } catch (err: any) {
        console.error("Error fetching modules:", err);
        setError("Error fetching modules");
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  // Handler to add a new module
  const handleAddModule = async (moduleData: Omit<ModuleType, "id">) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        return;
      }
      const modulesRef = collection(db, "users", user.uid, "modules");
      const docRef = await addDoc(modulesRef, moduleData);
      // Append new module to state
      setModules((prev) => [...prev, { id: docRef.id, ...moduleData }]);
      setShowAddModal(false);
    } catch (err: any) {
      console.error("Error adding module:", err);
      setError("Error adding module");
    }
  };

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // If a module is selected, show its full details.
  if (selectedModule) {
    return (
      <ModuleDetails
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
          Modules
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(mod)}
            className="cursor-pointer bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
          >
            <div className="flex items-center">
              <span className="font-medium text-sm text-neutral-800 dark:text-neutral-100">
                {mod.label}
              </span>
            </div>
            <div className="mt-4 w-full">
              <Progress.Root className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <Progress.Indicator
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${mod.value}%` }}
                />
              </Progress.Root>
              <div className="text-xs text-right mt-1 text-neutral-500 dark:text-neutral-400">
                {mod.value}% Correct
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Module Modal */}
      {showAddModal && (
        <AddModuleModal
          onClose={() => setShowAddModal(false)}
          onAddModule={handleAddModule}
        />
      )}
    </div>
  );
}

/** A modal component for adding a new module */
function AddModuleModal({
  onClose,
  onAddModule,
}: {
  onClose: () => void;
  onAddModule: (moduleData: Omit<ModuleType, "id">) => void;
}) {
  const [formData, setFormData] = useState<Omit<ModuleType, "id">>({
    label: "",
    lecturer: "",
    topics: [],
    notes: "",
    grades: "",
    assignments: [],
    value: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // For progress value, ensure it's a number.
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  // For simplicity, we use comma-separated values for topics and assignments.
  const handleListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddModule(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-xl font-bold mb-4">Add New Module</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Module Name</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lecturer</label>
            <input
              type="text"
              name="lecturer"
              value={formData.lecturer}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Progress (%)</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Topics (comma separated)
            </label>
            <textarea
              name="topics"
              placeholder="e.g., Arrays, Linked Lists, Trees"
              onChange={handleListChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Grades</label>
            <input
              type="text"
              name="grades"
              value={formData.grades}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Assignments (comma separated)
            </label>
            <textarea
              name="assignments"
              placeholder="e.g., Assignment 1 due 4/5, Assignment 2 due 4/15"
              onChange={handleListChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add Module
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
