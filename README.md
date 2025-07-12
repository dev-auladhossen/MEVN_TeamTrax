# TeamTrax - Cloud-based System to Facilitate Software Project Tracking and Collaboration

A modern, scalable web-based system built to streamline software project tracking, task management, and team collaboration. Ideal for teams of all sizes working onsite or remotely, CSPTC provides robust tools for project control, real-time updates, and integrated GitHub tracking.

## Live Demo
Frontend: [https://teamtrax-project-management.netlify.app/](https://teamtrax-project-management-tool.netlify.app/)

Backend: 



---

## Introduction

The **Cloud-based System to Facilitate Software Project Tracking and Collaboration (CSPTC)** is a comprehensive project management platform designed to improve how teams plan, manage, and deliver software and general projects.

This platform acts as a centralized digital workspace that simplifies:
- Project creation and monitoring
- Task assignment and tracking
- Secure team communication
- GitHub version control integration
- Performance reporting and more

Built with a modern technology stack, CSPTC offers responsive UI, seamless navigation, and flexible role-based access control—empowering organizations to boost collaboration and productivity in real-time.

---

## Features

1. **Role-Based Authentication**  
   Secure login with user roles like Admin, Project Manager, Developer, etc., each with specific access permissions.

2. **Project Management**  
   Create, update, or delete projects with metadata such as title, status, start/end dates, and visual progress indicators.

3. **Task Management**  
   Define, edit, prioritize, and assign tasks under each project. Track task status, due dates, and assignees.

4. **User Assignment**  
   Assign specific users to individual tasks for better accountability and workflow organization.

5. **Comments & Attachments**  
   Threaded comment system with file attachments for real-time task-related communication.

6. **GitHub Integration**  
   Link GitHub repositories directly from the project dashboard. Manage branches, commits, and sync project activities with GitHub.

7. **Access Control**  
   Restrict access to critical actions like task deletion or editing based on user role and assigned permissions.

8. **Real-Time Status Monitoring**  
   Keep track of ongoing projects and tasks with live progress indicators and summary dashboards.

9. **Project Visualization**  
   Graphical representation of project progress and status for quick insights.

10. **Reporting & Analytics**  
   Auto-generate reports on:
   - Task completion
   - Project timelines
   - User workload
   - Role-based performance

11. **Task Prioritization**  
   Categorize tasks by priority to streamline focus and execution.

12. **Team Chat (In-App Communication)**  
   Built-in real-time chat feature for collaboration within project teams.

13. **User Management**  
   Admin or Project Manager can add, update, or remove users and assign them to specific roles/projects.

14. **Fully Responsive Design**  
   Mobile-friendly UI for managing tasks and collaborating on the go.

---

## Tech Stack

- **Frontend:** Vue 3 (Composition API), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (Role-Based)
- **Version Control Integration:** GitHub API
- **Deployment:** [Vercel / Netlify / Heroku / Render] (Specify your choices)

---

## Project Structure

```bash
csp-tc/
├── client/         # Frontend (Vue 3)
├── server/         # Backend (Express.js)
├── docs/           # Documentation & Assets
└── README.md
