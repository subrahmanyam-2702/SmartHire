import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleGuard from '../components/common/RoleGuard';

import Landing from '../pages/Landing';
import Pricing from '../pages/Pricing';
import NotFound from '../pages/NotFound';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import CandidateDashboard from '../pages/candidate/Dashboard';
import CandidateProfile from '../pages/candidate/Profile';
import CandidateCareerTools from '../pages/candidate/CareerTools';
import CandidateMessages from '../pages/candidate/Messages';

import RecruiterDashboard from '../pages/recruiter/Dashboard';
import PostJob from '../pages/recruiter/PostJob';
import ManageJobs from '../pages/recruiter/ManageJobs';
import CandidateMatches from '../pages/recruiter/CandidateMatches';
import ApplicationsPipeline from '../pages/recruiter/ApplicationsPipeline';
import RecruiterMessages from '../pages/recruiter/Messages';
import RecruiterAnalytics from '../pages/recruiter/Analytics';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageOrganizations from '../pages/admin/ManageOrganizations';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={['candidate']} />}>
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/career-tools" element={<CandidateCareerTools />} />
          <Route path="/candidate/messages" element={<CandidateMessages />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['recruiter']} />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<ManageJobs />} />
          <Route path="/recruiter/jobs/new" element={<PostJob />} />
          <Route path="/recruiter/jobs/:jobId/matches" element={<CandidateMatches />} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<ApplicationsPipeline />} />
          <Route path="/recruiter/messages" element={<RecruiterMessages />} />
          <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/organizations" element={<ManageOrganizations />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
