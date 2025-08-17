import React from 'react';
import InputField from '../ui/InputField';
import TextareaField from '../ui/TextareaField';
import { Project } from '../../types';

interface ProjectDetailsProps {
    project: Project;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProjectDetails({ project, handleChange }: ProjectDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Project Details</h2>
      <div className="space-y-4">
        <InputField label="Project Name" name="name" value={project.name} onChange={handleChange} />
        <InputField label="Project ID" name="id" value={project.id} onChange={handleChange} />
        <TextareaField label="Description" name="description" value={project.description} onChange={handleChange} />
      </div>
    </div>
  );
}
