// src/utils/authUtils.js
export const saveUserSession = (role, user, token) => {
  localStorage.setItem('userRole', role);
  localStorage.setItem(`${role}Token`, token);
  localStorage.setItem(`${role}Profile`, JSON.stringify(user));
};
