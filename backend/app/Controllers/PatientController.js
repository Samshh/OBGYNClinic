const AppDataSource = require("../../data-source");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const patientRepository = AppDataSource.getRepository("Patient");
const adminRepository = AppDataSource.getRepository("Admin");

const loginPatient = async (req, res) => {
  try {
    const { EmailAddress, UserPassword } = req.body;
    const user = await AppDataSource.getRepository("Patient").findOne({
      where: { EmailAddress, UserPassword },
    });

    if (!user) {
      res.status(404);
      return res.json({
        status: 0,
        message: "User not found.",
      });
    }

    if (user.UserPassword !== UserPassword) {
      return res.status(401).json({
        status: 0,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      { TypeIs: 2, PatientID: user.PatientID, EmailAddress: user.EmailAddress },
      "your_secret_key", // Ensure this matches the secret key in authjwt.js
      { expiresIn: "6h" }
    );

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })
    );

    return res.json({
      status: 1,
      message: "Login successful.",
      token // Optionally return the token in the response body for easier debugging
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: "Internal server error.",
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patientRepository = AppDataSource.getRepository("Patient");
    const users = await patientRepository.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
};

const createPatient = async (req, res) => {
  try {
    const { EmailAddress } = req.body;

    // Check if email is already used in Patient table
    const existingPatient = await patientRepository.findOne({ where: { EmailAddress } });
    if (existingPatient) {
      return res.status(400).json({ error: "Email is already used by another patient." });
    }

    // Check if email is already used in Admin table
    const existingAdmin = await adminRepository.findOne({ where: { EmailAddress } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email is already used by an admin." });
    }

    const newUser = patientRepository.create(req.body);
    const result = await patientRepository.save(newUser);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patientRepository = AppDataSource.getRepository("Patient");
    const user = await patientRepository.findOneBy({ PatientID: req.params.id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
};
const getPatientRole = async (req, res) => {
  const { PatientID, EmailAddress } = req.body;
  try {
    const user = await patientRepository.findOneBy({ PatientID: PatientID, EmailAddress: EmailAddress });
    if (user) {
      res.json(user.Role);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  getPatients,
  getPatientRole,
  createPatient,
  getPatientById,
  loginPatient,
};
