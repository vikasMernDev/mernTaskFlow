import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true, optimisticConcurrency: true, versionKey: 'version' }
);

taskSchema.index({ projectId: 1, status: 1, updatedAt: -1 });
taskSchema.index({ projectId: 1, assigneeId: 1 });

export const Task = mongoose.model('Task', taskSchema);
