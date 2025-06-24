// utils/trackProgress.js
import Task from '../models/Task.js';
import ProjectProgress from '../models/ProjectProgress.js';

export const trackProjectProgress = async (projectId) => {
  const tasks = await Task.find({ projectId });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;

  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  await ProjectProgress.create({
    projectId,
    progress,
    totalTasks,
    completedTasks,
    date: new Date(), // default handled too
  });
};
