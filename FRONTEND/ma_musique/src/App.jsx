import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Request from '../src/auth/Register'
import Login from '../src/auth/Login'
import Home from '../src/home/Home'


import './App.css'
import Course from './components/course/Course.component';
import { Blog } from './components/blog/Blog.component';
import { Resource } from './components/resource/Resource.component';
import { Annonce } from './components/annonce/Annonce.component';
import { Admin, Dash } from './dashboards/admin/Admin';
import { Dashboard } from './dashboards/admin/Dashboard';
import { Profile } from './dashboards/profile/Profile';
import { Note } from './dashboards/note/Note';
import { Users } from './dashboards/users/Users';
import { Calendars } from './dashboards/calendars/Calendar';
import { Chats } from './dashboards/chats/Chats';
import { Notification } from './dashboards/notificatoin/Notification-dashboard';
import AdminLogin from './auth/AdminLogin';
import AdminRegister from './auth/adminRegister';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TeacherDashboard from './teacher_dashboard/Teacher_dashboard';
import { TdashBoard } from './teacher_dashboard/route_teacher/TdashBoard';
import { Tcourses } from './teacher_dashboard/route_teacher/Tcourses';
import { Tprofile } from './teacher_dashboard/route_teacher/Tprofile';
import { Tnote } from './teacher_dashboard/route_teacher/Tnote';
import { Tchat } from './teacher_dashboard/route_teacher/Tchat';
import { Tcalender } from './teacher_dashboard/route_teacher/Tcalender';
import { Tnotification } from './teacher_dashboard/route_teacher/Tnotification';

import StudentDashboard from './student_Dashboard/StudentDashboard';
import { Sdashboard } from './student_Dashboard/route_student/Sdashboard';
import { Scourse } from './student_Dashboard/route_student/Scourse';
import { Sprofile } from './student_Dashboard/route_student/Sprofile';
import { Snote } from './student_Dashboard/route_student/Snote';
import { Schat } from './student_Dashboard/route_student/Schat';
import { Scalender } from './student_Dashboard/route_student/Scalender';
import { Snotification } from './student_Dashboard/route_student/Snotification';
import {Cart} from './carts/cart';
import { Checkout } from './checkout/checkout';


import { PrivateRoute } from './components/PrivateRoute';


function App() {

  return (
    <>
      <ToastContainer />


      <Routes>
        {/* Redirection pour toute route inconnue */}
        <Route path='*' element={<Login />} />


        {/* Routes publiques */}
        <Route path="/register" element={<Request />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/resource' element={<Resource />} />
        <Route path='/annonce' element={<Annonce />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />


        {/* Routes pas publiques */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/course' element={<Course />} />
        </Route>

        <Route path="/admins/login" element={<AdminLogin />} />
        <Route path="/admins/register" element={<AdminRegister />} />

        {/* Routes admin */}
        <Route path='/admin/*' element={<Dash />}>

          <Route index element={<Navigate to="dashboard" />} /> {/* Redirection vers le Dashboard */}
          <Route path="dashboard" element={<Admin />} />
          <Route path="courses" element={<Course />} />
          <Route path="profile" element={<Profile />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="note" element={<Note />} />
          <Route path="create_user" element={<Users />} />
          <Route path="chats" element={<Chats />} />
          <Route path="calendars" element={<Calendars role={Users.role} />} />
          <Route path="notificatoin" element={<Notification />} />

        </Route>


        {/* Routes student */}
        <Route path="/student/*" element={<StudentDashboard />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Sdashboard />} />
          <Route path="courses" element={<Scourse />} />
          <Route path="profile" element={<Sprofile />} />
          <Route path="note" element={<Snote />} />
          <Route path="chats" element={<Schat />} />
          <Route path="calendars" element={<Scalender />} />
          <Route path="notificatoin" element={<Snotification />} />
        </Route>

        {/* Routes teacher */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'teacher']} />}>
          <Route path="/teacher/*" element={<TeacherDashboard />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<TdashBoard />} />
            <Route path="courses" element={<Tcourses />} />
            <Route path="profile" element={<Tprofile />} />
            <Route path="note" element={<Tnote />} />
            <Route path="chats" element={<Tchat />} />
            <Route path="calendars" element={<Tcalender />} />
            <Route path="notification" element={<Tnotification />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App