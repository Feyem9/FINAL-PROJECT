import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import Request from '../src/auth/Register'
import Login from '../src/auth/Login'
import Home from '../src/home/Home'


import './App.css'
import  Course  from './components/course/Course.component';
import { Teacher } from './components/teacher/Teacher.component';
import { Blog } from './components/blog/Blog.component';
import { Resource } from './components/resource/Resource.component';
import { Annonce } from './components/annonce/Annonce.component';
import { Admin,Dash }  from './dashboards/admin/Admin';
import { Dashboard } from './dashboards/admin/Dashboard';
import { Profile } from './dashboards/profile/Profile';
import { Note } from './dashboards/note/Note';
import { Users } from './dashboards/users/Users';
import { Calendars } from './dashboards/calendars/Calendar';
import { Chats } from './dashboards/chats/Chats';
import { Notification } from './dashboards/notificatoin/Notification-dashboard';
import AdminLogin from './auth/AdminLogin';




function App() {

  return (

        <Routes>
          {/* Redirection pour toute route inconnue */}
          <Route path='*' element={<Login/>}/>

          
          {/* Routes publiques */}
          <Route path="/register" element={<Request />} />
          <Route path="/login" element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/course' element={<Course />} />
          <Route path='/teacher' element={<Teacher />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/resource' element={<Resource />} />
          <Route path='/annonce' element={<Annonce />} />
          <Route path="/admins/login" element={<AdminLogin />} />
          {/* <Route path="/admin/profile"element={ <AdminRoute> <Profile /> </AdminRoute> }/> */}

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
            <Route path="calendars" element={<Calendars role={Users.role}/>} />
            <Route path="notificatoin" element={<Notification />} />

          </Route>
        </Routes>
  );
}

export default App