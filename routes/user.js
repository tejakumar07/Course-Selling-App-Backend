const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    console.log("hi there")
    await User.create({
        username,
        password
    })
    res.json({
        msg: "User Created Successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    console.log("hi there1")

    const response = await User.find({
        username,
        password
    })
    if (response) {
        const jwtToken = jwt.sign({
            username
        }, JWT_SECRET)
        console.log(jwtToken)
        res.json({
            jwtToken
        })
    }
    else {
        res.status(403).json({
            msg: "username and password are incorrect"
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({})

    res.json({
        course: response
    })

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    const password = req.password;
    const courseId = req.params.courseId;
    console.log(username)

    const response = await User.updateOne({
        username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        msg: "Purchased Successfully"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.username
    });

    console.log(user.purchasedCourses);

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.json({
        courses: courses
    })
});

module.exports = router