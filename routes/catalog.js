const router = require('express').Router();
let BusData = require('../models/busModel');
let StoreData = require('../models/storeModel');
let CanteenData = require('../models/canteenModel');
let LibData = require('../models/libModel');
let EventData = require('../models/eventsModel');
require('dotenv').config();

//0 CRUD events
router.get('/events', async (req, res) => {
    res.status(200).json(await EventData.find())
})

router.post('/addevent', async (req, res) => {
    try {
        const newitem = new EventData({
            imglink: req.body.imglink,
            name: req.body.name,
            cost: req.body.cost,
            disc: req.body.disc,
            enddate: req.body.enddate
        });

        res.status(500).json(await newitem.save())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/delevent', async (req, res) => {
    try {
        const item = EventData.findOne({ name: req.body.name });
        res.status(500).json(await item.deleteOne())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// 1 CRUD books
router.get('/books', async (req, res) => {
    res.status(200).json(await LibData.find())
})

router.post('/addbook', async (req, res) => {
    try {
        const newbook = new LibData({
            imglink: req.body.imglink,
            bookname: req.body.bookname,
            author: req.body.author,
            type: req.body.type,
            noofcopies: req.body.noofcopies,
        });

        res.status(500).json(await newbook.save())
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//2 CRUD menu
router.get('/menu', async (req, res) => {
    res.status(200).json(await CanteenData.find())
})

router.post('/addtomenu', async (req, res) => {
    try {
        const newitem = new CanteenData({
            imglink: req.body.imglink,
            name: req.body.name,
            cost: req.body.cost,
        });

        res.status(500).json(await newitem.save())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/delinmenu', async (req, res) => {
    try {
        const item = CanteenData.findOne({ name: req.body.name });
        res.status(500).json(await item.deleteOne())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.patch('/updateinmenu', async (req, res) => {
    try {
        const item = CanteenData.findOne({ name: req.body.name });
        res.status(500).json(await item.updateOne({ cost: req.body.cost }))
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// 3 CRUD bus fares 
router.get('/busfares', async (req, res) => {
    res.status(200).json(await BusData.find())
})
router.post('/addbus', async (req, res) => {
    try {
        const newitem = new BusData({
            imglink: req.body.imglink,
            busnumber: req.body.busno,
            drivernumber: req.body.driverno,
            area: req.body.area,
            cost: req.body.cost,
            busstops: req.body.busstops,
        });

        res.status(500).json(await newitem.save())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// 4 CRUD store items
router.get('/stores', async (req, res) => {
    res.status(200).json(await StoreData.find())
})
router.post('/addtostore', async (req, res) => {
    try {
        const newitem = new StoreData({
            imglink: req.body.imglink,
            name: req.body.name,
            cost: req.body.cost,
        });

        res.status(500).json(await newitem.save())
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.patch('/updateinstore', async (req, res) => {
    try {
        const item = StoreData.findOne({ name: req.body.name });
        res.status(500).json(await item.updateOne({ cost: req.body.cost }))
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;