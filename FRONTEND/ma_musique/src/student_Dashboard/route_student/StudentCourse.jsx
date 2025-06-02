import React from 'react';
import CourseCard from './CourseCard';

const StudentCourse = () => {
  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CourseCard title="Piano Basics" progress={80} />
      <CourseCard title="Chord Progressions" progress={60} />
      <CourseCard title="Reading Sheet Music" progress={45} />
      <CourseCard title="Improvisation Techniques" progress={30} />
      <CourseCard title="Jazz Piano" progress={20} />
      <CourseCard title="Classical Pieces Practice" progress={55} />
    </section>
  );
};

export default StudentCourse;
