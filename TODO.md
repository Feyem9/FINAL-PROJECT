# TODO: Modify addToCart Method in CourseService

## Tasks
- [x] Remove redundant parameters (title, description, image, amount) from addToCart method signature
- [x] Add validation for courseId, userId, and quantity
- [x] Implement duplicate checking: if course already in cart, increase quantity; else add new
- [x] Update the cart save and return logic with proper quantity handling
- [x] Update controller to match new method signature
- [ ] Test the modified method to ensure it works correctly
