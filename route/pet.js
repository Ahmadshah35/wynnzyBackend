const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const petController = require("../controller/pet");

const router = express.Router();

const petStorage = multer.diskStorage({
  destination: "./public/pet",
  filename: (req, file, cb) => {
    cb(null,Date.now() + "-" + file.originalname)
  },
});

const petUpload = multer({
  storage: petStorage,
});

const petImageUpload = petUpload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "petImages", maxCount: 5 }, 
]);


router.post("/user/createPet", petImageUpload, petController.createPet);
router.post("/user/image", petUpload.single("image"), petController.singleImage);
router.post("/user/updatePet",petImageUpload, petController.updatePet);
router.post("/user/deletePet", petController.deletePet);
router.get("/user/getAllPets", petController.getAllPets);
router.get("/user/getPet", petController.getPet);

module.exports = router;
