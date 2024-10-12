const express = require('express');
const router = express.Router();
const companyController = require("../controller/companyController");

// POST request to create a company (e.g., for new company data)
router.post("/", (request, response) => {
    // Call the controller method to handle creating a company
    companyController.createCompany(request, response);
});

// GET request to retrieve a company based on an ID or query
router.get("/:query", (request, response) => {
    // Call the controller method to handle retrieving company details
    companyController.getCompanyId(request, response);
});

// PUT request to update company data (used for your AJAX PUT request)
router.put("/update", (req, res) => {
    console.log('PUT request received at /api/private/company');
    
    // Send a JSON response to confirm the request was received
    res.status(200).json({
        status: 1,
        msg: "success"
    });
});

module.exports = router;
