const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://tejakumar2025:85Mi5GWVGhz7ffQD@cluster0.elvulqm.mongodb.net/jwtauth');

// Define schemas
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    price: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}