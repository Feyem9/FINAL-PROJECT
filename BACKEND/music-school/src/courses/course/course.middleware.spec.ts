import { CourseMiddleware } from './course.middleware';

describe('CourseMiddleware', () => {
  it('should be defined', () => {
    expect(new CourseMiddleware()).toBeDefined();
  });
});
