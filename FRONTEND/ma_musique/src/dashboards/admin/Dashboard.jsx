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
  const [userType, setUserType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log('voici le', token);

      try {
        const [teachersRes, studentsRes] = await Promise.all([
          axios.get("http://localhost:3000/teachers/all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:3000/students/all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setTeachers(teachersRes.data);
        setStudents(studentsRes.data);
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

    // un formulaire de modification en appelant la route put du backend
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


      const studentDeleteUrl = `http://localhost:3000/students/${id}`;
      const teacherDeleteUrl = `http://localhost:3000/teachers/${id}`;
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
         <div className="p-4">
      {/* Filter & Search */}
      <Box
        className="flex flex-col md:flex-row gap-4 mb-4"
      >
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
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
          className="w-full"
        />
      </Box>

      {/* Legend */}
      <Box className="flex flex-wrap items-center gap-6 mb-4">
        <Box className="flex items-center gap-2">
          <Box className="w-4 h-4 bg-green-500/50 rounded" />
          <Typography variant="body2">Étudiants</Typography>
        </Box>
        <Box className="flex items-center gap-2">
          <Box className="w-4 h-4 bg-orange-400/50 rounded" />
          <Typography variant="body2">Enseignants</Typography>
        </Box>
      </Box>

      {/* Table */}
      <Box className="mt-4 overflow-x-auto">
        <Typography variant="h6">{userTypeLabel}</Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    backgroundColor:
                      user.role === 'student'
                        ? 'rgba(0, 128, 0, 0.1)'
                        : user.role === 'teacher'
                          ? 'rgba(255, 165, 0, 0.1)'
                          : 'transparent',
                  }}
                >
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(user._id, user.role)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No matching users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
    </>
  );
};
