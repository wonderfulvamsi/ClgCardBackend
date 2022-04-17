const router = require('express').Router();
let StudentList = require('../models/studentList');
let User = require('../models/userModel');
let Transac = require('../models/transactionsModel');
const bcrypt = require("bcrypt");

require('dotenv').config();

// -1. OTP Logic

var AWS = require('aws-sdk');

/*

OTP Route
ur req from frontend must be like...
http://localhost:3000/?message=myassmessage&number=919989633866&subject=MyassSubject

*/
router.post('/getotp', (req, res) => {
    var random = Math.floor(1000 + Math.random() * 9000)
    const YOUR_MESSAGE = `Greetings from ClgCard, Your verification code is ${random}`
    var params = {
        Message: YOUR_MESSAGE,
        // yo man look put here [+countrycodemobileno] eg. +919989633866
        PhoneNumber: '+' + req.query.number,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': "Transactional"
            }
        }
    };

    const setotp = async (data) => {
        const user = await User.findOne({ rollno: req.body.rollno });
        await user.updateOne({ otp: random, otpdate: Date.now() * 0.001 });
        res.end(JSON.stringify({ MessageID: data.MessageId, OTP: random }));
    }

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then((result) => setotp(result)).catch(
        function (err) {
            res.end(JSON.stringify({ Error: err }));
        });
});

router.post('/verifyotp', async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        if (user.otp == req.body.otp) {
            if ((Date.now() * 0.001) - user.otpdate < (5 * 60)) {
                res.status(200).send("OTP Verified!")
            }
            else {
                res.status(200).send("OTP Expired!")
            }
        }
        else {
            res.status(200).send("Incorrect OTP!")
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})


// 0. check rollno

router.post("/checkuser", async (req, res) => {
    try {
        const user = await StudentList.findOne({ rollno: req.body.rollno });
        if (!user) {
            res.status(200).send("no rollno exists");
        }
        else {
            if (user.registered) {
                res.status(200).send("ClgCard is being used in some other device. Signout there first!");
            }
            else {
                res.status(200).send("okayy..");
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post("/checkadmin", async (req, res) => {
    if (req.body.userid == process.env.ADMIN_ID) {
        if (req.body.password == process.env.ADMIN_PASSWORD) {
            res.status(200).send("Get in");
        }
        else {
            res.status(200).send("Wrong Password");
        }
    }
    else {
        res.status(200).send("Wrong ID");
    }
})



// 1. create account
router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // get mobileno of the user
        const userinlist = await StudentList.findOne({ rollno: req.body.rollno });

        //update if already registered user

        const alreadyuser = await User.findOne({ rollno: req.body.rollno })
        if (alreadyuser) {
            const newone = await alreadyuser.updateOne({
                name: req.body.name,
                password: hashedPassword
            });
            await userinlist.updateOne({ registered: true })
            res.status(200).json(await User.findOne({ rollno: req.body.rollno }));
        }

        else {
            //create new user
            const newUser = new User({
                rollno: req.body.rollno,
                password: hashedPassword,
                name: req.body.name,
                mobileno: userinlist.mobileno,
                credit: 0,
                otp: 0,
            });

            //save user and respond
            await userinlist.updateOne({ registered: true });
            res.status(200).json(await newUser.save());
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

// 2. delete account
router.patch("/delete", async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (validPassword) {
            const userinlist = await StudentList.findOne({ rollno: req.body.rollno })
            await userinlist.updateOne({ registered: false });
            //await user.deleteOne();
            //LOL if we delete the user then every1 will use d card n simply delete their accounts. 
            res.status(200).send("Deleted!");
        }
        else {
            res.status(200).send("Wrong Password!");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// 2. change password
router.patch("/changepass", async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (validPassword) {
            //OTP Logic
            //generate new password
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(req.body.newpassword, salt);
            await user.updateOne({ password: hashedNewPassword });
            res.status(200).send(await user.save());
        }
        else {
            res.status(200).send("Wrong Password!");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});


// 3. change number??
router.patch("/changeno", async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (validPassword) {
            //OTP Logic
            await user.updateOne({ mobileno: req.body.newmobileno });
            const userinlist = await StudentList.findOne({ rollno: req.body.rollno })
            await userinlist.updateOne({ mobileno: req.body.newmobileno });

            res.status(200).send("Changed!");
        }
        else {
            res.status(200).send("Wrong Password!");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// 4. get transactions history
router.post('/history', async (req, res) => {
    try {
        const transactions = await Transac.find({ rollno: req.body.rollno });
        res.status(200).json(transactions);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.post('/allhistory', async (req, res) => {
    try {
        res.status(200).json(await Transac.find());
    }
    catch (err) {
        res.status(500).json(err);
    }
})

// 5. make payment
router.post('/fastpay', async (req, res) => {
    try {
        if (req.body.amount > 0) {
            const transac = new Transac({
                rollno: req.body.rollno,
                to: req.body.to,
                amount: req.body.amount,
                date: req.body.date,
                sucessful: req.body.status,
            });
            if (req.body.status) {
                const user = await User.findOne({ rollno: req.body.rollno });
                if (req.body.to == "Bus") {
                    await user.updateOne({ credit: req.body.amount + user.credit, bus: req.body.amount + user.bus });
                }
                else if (req.body.to == "Stores") {
                    await user.updateOne({ credit: req.body.amount + user.credit, stores: req.body.amount + user.stores });
                }
                else if (req.body.to == "Canteen") {
                    await user.updateOne({ credit: req.body.amount + user.credit, canteen: req.body.amount + user.canteen });
                }
                else if (req.body.to == "Library") {
                    await user.updateOne({ credit: req.body.amount + user.credit, lib: req.body.amount + user.lib });
                }
                else if (req.body.to == "Event") {
                    await user.updateOne({ credit: req.body.amount + user.credit, event: req.body.amount + user.event });
                }
            }
            res.status(200).json(await transac.save());
        }
        else {
            res.status(200).send("Go fuck ur self!")
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//clearing all the credit

router.patch('/clearcredit', async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        res.status(200).json(await user.updateOne({ credit: 0, bus: 0, canteen: 0, lib: 0, stores: 0 }));
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//6. Add new studets to studentslist
router.post('/addstudent', async (req, res) => {
    try {
        const newstudent = new StudentList({
            rollno: req.body.rollno,
            mobileno: req.body.mobileno
        })
        res.status(200).json(await newstudent.save());
    }
    catch (err) {
        res.status(500);
    }

})

//7. Remove student from studentlist 
router.delete("/deletestudent", async (req, res) => {
    try {
        const user = await User.findOne({ rollno: req.body.rollno });
        if (user) {
            const userinlist = await StudentList.findOne({ rollno: req.body.rollno })
            res.status(200).send(await userinlist.deleteOne());
        }
        else {
            res.status(200).send("No such student exixts!");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

//8. see the list

router.get("/getstudentlist", async (req, res) => {
    try {
        res.status(200).json(await StudentList.find());
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post("/userdetails", async (req, res) => {
    try {
        res.status(200).json(await User.findOne({ rollno: req.body.rollno }));
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;