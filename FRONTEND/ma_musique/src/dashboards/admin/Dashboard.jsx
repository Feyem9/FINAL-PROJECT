import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormControl } from "@mui/material"
import { InputLabel } from "@mui/material"
import { MenuItem } from "@mui/material"
import { TextField } from "@mui/material"
import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import { TableContainer } from "@mui/material"
import { TableHead } from "@mui/material"
import { TableBody } from "@mui/material"
import { Table } from "@mui/material"
import { TableRow } from "@mui/material"
import { Paper } from "@mui/material"
import { TableCell } from "@mui/material"
import { Tooltip } from "@mui/material"
import { IconButton } from "@mui/material"
import Select from '@mui/material/Select';
import { toast } from "react-toastify";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export const Dashboard = () => {

      // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
          const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  const [userType, setUserType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chats, setChats] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log('voici le', token);

      try {
        const [teachersRes, studentsRes, coursesRes, chatsRes, notificationsRes, chartRes] = await Promise.all([
          axios.get(`${databaseUri}/teachers/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${databaseUri}/students/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          // Ajoutez vos endpoints réels ici
          axios.get(`${databaseUri}/course/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => ({ data: [] })), // Fallback en cas d'erreur
          axios.get(`${databaseUri}/chat/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => ({ data: [] })),
          axios.get(`${databaseUri}/notifications/recent`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => ({ data: [] })),
          axios.get(`${databaseUri}/analytics/overview`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => ({ data: [] }))
        ]);

        setTeachers(teachersRes.data);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setChats(chatsRes.data);
        setNotifications(notificationsRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }
    , []);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const getFilteredUsers = () => {
    let users = [];

    if (userType === "teacher") users = teachers;
    else if (userType === "student") users = students;
    else users = [...teachers, ...students];

    return users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm)
    );
  };

  // Fonction pour générer le path SVG de la courbe à partir des données réelles
  const generatePath = () => {
    if (!chartData || chartData.length === 0) {
      // Données d'exemple si pas de données de l'API
      const defaultData = [
        {value: 20, label: 'Jan'}, {value: 35, label: 'Feb'}, {value: 25, label: 'Mar'},
        {value: 45, label: 'Apr'}, {value: 30, label: 'May'}, {value: 55, label: 'Jun'},
        {value: 40, label: 'Jul'}, {value: 65, label: 'Aug'}, {value: 50, label: 'Sep'}
      ];
      return generatePathFromData(defaultData);
    }
    return generatePathFromData(chartData);
  };

  const generatePathFromData = (data) => {
    const width = 600;
    const height = 200;
    const maxValue = Math.max(...data.map(item => item.value || 0));
    
    const points = data.map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((item.value || 0) / Math.max(maxValue, 1)) * (height - 40);
      return { x, y, value: item.value, label: item.label };
    });

    if (points.length === 0) return { path: "M 0 100", points: [] };

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const cpx1 = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
      const cpy1 = prevPoint.y;
      const cpx2 = currentPoint.x - (currentPoint.x - prevPoint.x) / 3;
      const cpy2 = currentPoint.y;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return { path, points };
  };

  const getChartData = () => {
    if (!chartData || chartData.length === 0) {
      return [
        {value: 20, label: 'Jan'}, {value: 35, label: 'Feb'}, {value: 25, label: 'Mar'},
        {value: 45, label: 'Apr'}, {value: 30, label: 'May'}, {value: 55, label: 'Jun'},
        {value: 40, label: 'Jul'}, {value: 65, label: 'Aug'}, {value: 50, label: 'Sep'}
      ];
    }
    return chartData;
  };

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });

    const { points } = generatePathFromData(getChartData());
    const threshold = 30;
    const hoveredPoint = points.find(point => 
      Math.abs(point.x - x) < threshold && Math.abs(point.y - y) < threshold
    );
    
    setHoveredPoint(hoveredPoint || null);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Fonction pour formater les dates pour l'axe X
  const getChartLabels = () => {
    const data = getChartData();
    return data.map(item => item.label || item.month || 'N/A');
  };

  const filteredUsers = getFilteredUsers();

  const userTypeLabelMap = {
    all: 'All Users',
    teacher: 'Users: Teachers',
    student: 'Users: Students',
  };

  const userTypeLabel = `${userTypeLabelMap[userType]} (${filteredUsers.length})`;

  const handleEdit = async (userId, userType) => {
    console.log("user and type", userId, userType);
    if (!userId || !userType) {
      toast.error("Informations manquantes pour la modification.");
      return;
    }
  };

  const handleDelete = async (userId, userType) => {
    console.log("user and type", userId, userType);

    if (!userId || !userType) {
      toast.error("Informations manquantes pour la suppression.");
      return;
    }
    const confirm = window.confirm("Es-tu sûr de vouloir supprimer cet utilisateur ?");
    if (!confirm) return;

    const raison = window.prompt("Pourquoi voulez-vous supprimer cet utilisateur ?");
    if (!raison) {
      toast.error("La raison de la suppression est obligatoire.");
      return;
    }

    setIsDeleting(true);

    try {
      const id = userId;
      console.log('id', id);

      const studentDeleteUrl = `${databaseUri}/students/${id}`;
      const teacherDeleteUrl = `${databaseUri}/teachers/${id}`;
      if (userType === "student") {
        await axios.delete(studentDeleteUrl);
      } else if (userType === "teacher") {
        await axios.delete(teacherDeleteUrl);
      }

      // Mise à jour locale (si tu veux mettre à jour l'affichage sans recharger)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success(`L'utilisateur a été supprimé avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Échec de la suppression de l'utilisateur.");

    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Admin</h2>
          <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div> */}

        {/* Stats Cards */}
       <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-lime-400 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{students.length}</div>
            <div className="text-gray-700 font-medium">Students</div>
            
          </div>
               <div className="bg-lime-400 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{teachers.length}</div>
            <div className="text-gray-700 font-medium">teachers</div>
          </div>
          <div className="bg-lime-400 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{courses.length}</div>
            <div className="text-gray-700 font-medium">Courses</div>
          </div>
          <div className="bg-lime-400 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{students.length + teachers.length}</div>
            <div className="text-gray-700 font-medium">Total Users</div>
          </div>
          <div className="bg-lime-400 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{chats.length}</div>
            <div className="text-gray-700 font-medium">Chats</div>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-8">
          {/* Overview Chart */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Overview</h3>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-4 relative">
                <svg 
                  width="600" 
                  height="300" 
                  className="w-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                    </pattern>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid background */}
                  <rect width="600" height="240" fill="url(#grid)" />
                  
                  {/* Area under curve */}
                  <path
                    d={`${generatePath().path} L 600 240 L 0 240 Z`}
                    fill="url(#areaGradient)"
                  />
                  
                  {/* Main curve */}
                  <path
                    d={generatePath().path}
                    stroke="#65a30d"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                  
                  {/* Data points */}
                  {generatePath().points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={hoveredPoint === point ? "8" : "4"}
                      fill="#65a30d"
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        filter: hoveredPoint === point ? 'drop-shadow(0 0 8px rgba(101, 163, 13, 0.6))' : 'none'
                      }}
                    />
                  ))}
                  
                  {/* Hover line */}
                  {hoveredPoint && (
                    <>
                      <line
                        x1={hoveredPoint.x}
                        y1={0}
                        x2={hoveredPoint.x}
                        y2={240}
                        stroke="#65a30d"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                      <line
                        x1={0}
                        y1={hoveredPoint.y}
                        x2={600}
                        y2={hoveredPoint.y}
                        stroke="#65a30d"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    </>
                  )}
                </svg>
                
                {/* Tooltip */}
                {hoveredPoint && (
                  <div 
                    className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10"
                    style={{
                      left: Math.min(hoveredPoint.x + 10, 500),
                      top: Math.max(hoveredPoint.y - 40, 10),
                      transform: hoveredPoint.x > 500 ? 'translateX(-100%)' : 'none'
                    }}
                  >
                    <div className="text-sm font-medium">{hoveredPoint.label}</div>
                    <div className="text-xs text-gray-300">Value: {hoveredPoint.value}</div>
                    <div className="absolute w-2 h-2 bg-gray-800 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 mt-4 px-2">
                {getChartLabels().map((label, index) => (
                  <span key={index} className="font-medium">{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notifications (Sidebar) */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Notifications</h3>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notification, index) => (
                  <div key={notification._id || index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{notification.title || 'Notification'}</h4>
                      <p className="text-gray-500 text-xs mt-1">{notification.message || notification.description || 'No description available'}</p>
                      {notification.createdAt && (
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">No notifications</h4>
                      <p className="text-gray-500 text-xs mt-1">No recent notifications available</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          {/* Filter & Search */}
          <Box className="flex flex-col md:flex-row gap-4 mb-6">
            <FormControl sx={{ 
              maxWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#84cc16',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#84cc16',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#84cc16',
              },
            }}>
              <InputLabel id="user-type-label">Select User</InputLabel>
              <Select
                labelId="user-type-label"
                name="userType"
                value={userType}
                onChange={handleUserTypeChange}
                label="Select User"
              >
                <MenuItem value="all">All users</MenuItem>
                <MenuItem value="teacher">Teachers</MenuItem>
                <MenuItem value="student">Students</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#84cc16',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#84cc16',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#84cc16',
                },
              }}
              className="w-full"
            />
          </Box>

          {/* Legend */}
          <Box className="flex flex-wrap items-center gap-6 mb-6">
            <Box className="flex items-center gap-2">
              <Box className="w-4 h-4 bg-lime-400/70 rounded" />
              <Typography variant="body2" className="text-gray-600 font-medium">Étudiants</Typography>
            </Box>
            <Box className="flex items-center gap-2">
              <Box className="w-4 h-4 bg-orange-400/70 rounded" />
              <Typography variant="body2" className="text-gray-600 font-medium">Enseignants</Typography>
            </Box>
          </Box>

          {/* Table Title */}
          <Typography variant="h6" className="text-2xl font-bold text-gray-800 mb-4">
            {userTypeLabel}
          </Typography>

          {/* Table */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '14px' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '14px' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '14px' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '14px' }}>Role</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#374151', fontSize: '14px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      backgroundColor:
                        user.role === 'student'
                          ? 'rgba(132, 204, 22, 0.05)'
                          : user.role === 'teacher'
                            ? 'rgba(251, 146, 60, 0.05)'
                            : 'transparent',
                      '&:hover': {
                        backgroundColor:
                          user.role === 'student'
                            ? 'rgba(132, 204, 22, 0.1)'
                            : user.role === 'teacher'
                              ? 'rgba(251, 146, 60, 0.1)'
                              : '#f8fafc',
                      },
                      borderLeft: user.role === 'student' 
                        ? '4px solid #84cc16' 
                        : user.role === 'teacher' 
                          ? '4px solid #fb923c' 
                          : 'none',
                    }}
                  >
                    <TableCell sx={{ color: '#6b7280', fontSize: '14px' }}>{user._id}</TableCell>
                    <TableCell sx={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'student' 
                            ? 'bg-lime-100 text-lime-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          sx={{ 
                            color: '#84cc16',
                            '&:hover': { backgroundColor: 'rgba(132, 204, 22, 0.1)' }
                          }} 
                          onClick={() => handleEdit(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                          }} 
                          onClick={() => handleDelete(user._id, user.role)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ padding: '48px', color: '#9ca3af' }}>
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <Typography variant="body1" sx={{ color: '#6b7280', fontWeight: '500' }}>
                          No matching users found.
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Recent Notifications (Bottom Section) */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Recent Notifications</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};