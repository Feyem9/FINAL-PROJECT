export const logoutUser = () => {
  const role = localStorage.getItem('userRole');
  if (role) {
    localStorage.removeItem(`${role}Token`);
    localStorage.removeItem(`${role}Profile`);
    localStorage.removeItem('userRole');
  }
};
