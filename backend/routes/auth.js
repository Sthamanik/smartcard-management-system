const express = require ('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/Users');
const fetchUser = require('../middlewares/fetchUser');


// signup api('/auth/signup')
router.post('/signup', [
    body('name').isString().withMessage('Name must be a string'),
        body('email').isEmail().withMessage('Email is not valid'),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/).withMessage('Password must contain both letters and numbers'),
        body('contact').isNumeric().isLength({ min: 10 , max: 10}).withMessage('Phone number must be exactly 10 digit'),
], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let success = false
        try {
            const {name, email, password, address, DOB, gender, contact, role, faculty, batch, uid, key} = req.body;
            
            let user = await User.findOne({email});
            if (user) return res.status(400).json({success, error: "Email already exists"})
            user = await User.findOne({contact});
            if (user) return res.status(400).json({success, error: "Contact number already exists"})

            user = await User.findOne({name, batch, uid});
            if (user) return res.status(400).json({success, error: "User already exists"})

            if (role === 'admin' && key !== process.env.ADMIN_KEY) return res.status(401).json({success, error: "Invalid key"})

            const hashedPass = await bcrypt.hash(password, 12);
            user = await User.create({name, email, password: hashedPass, address, DOB, gender, contact, role, faculty, batch, uid})
            res.json({success: true, msg: "Signed Up"})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
)

// login api('/auth/login')
router.post('/login', [], 
    async (req, res) => {
        let success = false
        try {
            const {email, password, key} = req.body;

            let user = await User.findOne({email});
            if(!user) return res.status(400).json({success, error: "Invalid credentials!!"})
            
            const comparePass = await bcrypt.compare(password, user.password)
            if (!comparePass) return res.status(400).json({success, error: "Invalid credentials!!"})

            if (user.role === 'admin' && key !== process.env.ADMIN_KEY) return res.status(401).json({success, error: "Invalid key"})
            if (user.role === 'staff' && key !== process.env.STAFF_KEY) return res.status(401).json({success, error: "Invalid key"})

            const authToken = jwt.sign({id: user._id}, process.env.SECRET_KEY)
            res.json({successs: true, authToken})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
)

// changepassword api(/auth/changepass)
router.put('/changepass', fetchUser, 
    async(req, res) => {
        let success = false;
        try {
            const {oldPass, newPass} = req.body;
            if(oldPass === newPass) return res.status(400).send("New password must be differnet than previous one")

            let user = await User.findOne({_id: req.userId})
            if (!user) return res.status(404).send("User Not Found")

            const matchPassword = await bcrypt.compare(oldPass, user.password);
            if(!matchPassword) return res.status(401).json({success, msg: "Enter valid password"})

            const newHashedPass = await bcrypt.hash(newPass, 12)
            user.password = newHashedPass;
            user.save().then(res.json({success: true, msg: "Password Changed Successfully"}))
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    }
)

// fetch the user details api (/data/fetchData)
router.get('/getUsers', fetchUser, async (req, res) => {
    try{
        let user = await User.findOne({ _id: req.userId });
        if (!user.role === 'admin') return res.status(401).json({ msg: "Unauthorized access" });

        let userData = await User.find();
        if (userData.length === 0) res.json({msg: "no data to show"})
        res.json(userData)
    }catch(err){

    }
})

// update the user details api(/data/updateData)
router.put('/updateData/:id', fetchUser, async (req, res) => {
    try {
        let success = false ;
        let user = await User.findOne({ _id: req.userId });
        if (!user.role === 'admin') return res.status(401).json({ msg: "Unauthorized access" });

        let userData = await User.findById(req.params.id);
        if (!userData) return res.status(400).json({success, msg: "Invalid id "})

        const {name, email, address, DOB, gender, contact, faculty, batch, uid} = req.body
        const updatedData = {name, email, address, DOB, gender, contact, faculty, batch, uid}

        await User.findByIdAndUpdate(req.params.id, {$set: updatedData}, { new: true})
        res.json({success: true, msg: "Updated User Details Successfully"})
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// delete the user details api(/data/addData)
router.delete('/deleteData/:id', fetchUser, async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.userId });
        if (!user.role === 'admin') return res.status(401).json({ msg: "Unauthorized access" });

        let data = await User.findById(req.params.id)
        if( !data ) return res.status(400).json({success: false, msg:"User Data Not Found"})

        await User.findByIdAndDelete(req.params.id)
        .then(res.json({success: true, msg: "Deleted the data successfully"}) )
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router