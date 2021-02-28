const express = require('express');
const { authToken } = require('../middlewares/auth');
const {ToyModel,validToy} = require("../models/toyModel");
const router = express.Router();

router.get('/', async (req, res) => {
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let sortQ = req.query.sort;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  try {
   
    let data = await ToyModel.find({})
    .sort({[sortQ]:ifReverse})
    .limit(perPage)
    .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/count", async(req,res) => {
  try {
    
    let data = await ToyModel.countDocuments({});
    res.json({count:data});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

router.get('/single/:id', async (req, res) => {
  let toyId = req.params.id;
  try {
    let data = await ToyModel.findOne({_id:toyId});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/subject/:subName', async (req, res) => {
  let subName = req.params.subName;
  try {
    let data = await ToyModel.find({subject:subName});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


router.post("/add", authToken ,async (req, res) => {

  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  
  try{

    let toy = new ToyModel(req.body);
    await toy.save();
    res.status(201).json(toy);

  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

router.put("/edit/:idEdit",authToken, async(req,res) => {
  let idEdit = req.params.idEdit
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let updateData = await ToyModel.updateOne({_id:idEdit},req.body);
    res.json(updateData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})


router.delete("/del/:idDel",authToken ,async(req,res) => {
  let idDel = req.params.idDel;
  try{
    let delData = await ToyModel.deleteOne({_id:idDel});
    res.json(delData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

module.exports = router;