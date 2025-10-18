const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, User, Course } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config")

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    // check the user with the username already exists
    await Admin.create({
        username,
        password
    })
        res.json({
            msg: "Admin Created Successfully"
        })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    })
    if (user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);
        res.json({
            token
        })
    }
    else {
        res.status(411).json({
            msg: "Email and Password are Incorrect"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.images;
    const price = req.body.price;

    // In real-world we use ZOD

    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price

    });
    console.log(newCourse);
    res.json({
        message: "Course created successfully", courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({}); // Get All the Courses
    res.json({
        courses: response
    })
});

module.exports = router;