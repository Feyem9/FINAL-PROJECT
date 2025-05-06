import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export const Dashboard = () => {
  const [userType, setUserType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

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

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} marginY={2}>
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
        />
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Users</Typography>
        <List>
          {filteredUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemText
                primary={user.name}
                secondary={user.email || user.role}
              />
            </ListItem>
          ))}
          {filteredUsers.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No matching users found.
            </Typography>
          )}
        </List>
      </Box>
    </>
  );
};
