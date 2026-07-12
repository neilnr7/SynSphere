import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import CreateProjectPage from "@/pages/projects/CreateProjectPage";
import EditProjectPage from "@/pages/projects/EditProjectPage";
import ProjectDetailPage from "@/pages/projects/ProjectDetailPage";
import CreateTaskPage from "@/pages/tasks/CreateTaskPage";
import EditTaskPage from "@/pages/tasks/EditTaskPage";
import MyTasksPage from "@/pages/mytasks/MyTasksPage";
import TaskDetailPage from "@/pages/tasks/TaskDetailPage";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/projects"
              element={<ProjectsPage />}
            />

            <Route
              path="/projects/new"
              element={<CreateProjectPage />}
            />

            <Route
              path="/projects/:projectId"
              element={<ProjectDetailPage />}
            />

            <Route
              path="/projects/:projectId/edit"
              element={<EditProjectPage />}
            />

            <Route
              path="/projects/:projectId/tasks/new"
              element={<CreateTaskPage />}
            />

            <Route
              path="/projects/:projectId/tasks/:taskId"
              element={<TaskDetailPage />}
            />

            <Route
              path="/projects/:projectId/tasks/:taskId/edit"
              element={<EditTaskPage />}
            />  

            <Route
              path="/my-tasks"
              element={<MyTasksPage />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={<Navigate to="/projects" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/projects" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;