import * as React from 'react';
import { Navbar } from './Navbar';
import { HomeWelcome } from './all-home/HomeWelcome';
import Typography from '@mui/material/Typography';
import HomeCourseSlide from './all-courses/HomeCourseSlide';
import HomeTeacherSlide from './all-teachers/HometeacherSlide';
import HomeBlog from './all-blog/HomeBlog';
import HomeAnonce from './all-anounce/HomeAnounce';
import Homepricing from './all-pricing/HomePricing';
import Footer from './Footer';


const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#43A047", mb: 2, textAlign: "center", mt: 4, }}>
        Welcome to Museschool!
      </Typography>
      <HomeWelcome />
      <HomeCourseSlide />
      <HomeTeacherSlide />
      <HomeBlog />
      <HomeAnonce />
      <Homepricing />
      <Footer />

    </div>
  );
};

export default HomePage;

