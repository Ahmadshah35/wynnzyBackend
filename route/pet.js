const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const {
  createPet,
  deletePet,
  getAllPets,
  getPet,
  singleImage,
  updatePet,
} = require("../controller/pet");

const router = express.Router();

const petStorage = multer.diskStorage({
  destination: "./public/pet",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const petUpload = multer({
  storage: petStorage,
});

const petImageUpload = petUpload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "petImages", maxCount: 5 }, 
]);


router.post("/pet/createPet", petImageUpload, createPet);
router.post("/pet/image", petUpload.single("image"), singleImage);
router.post("/pet/updatePet", petUpload.array("petImages", 5), updatePet);
router.post("/pet/deletePet", deletePet);
router.get("/pet/getAllPets", getAllPets);
router.get("/pet/getPet", getPet);

module.exports = router;
