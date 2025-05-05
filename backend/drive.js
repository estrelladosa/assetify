const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

// Ruta al JSON de la cuenta de servicio
const KEYFILEPATH = path.join(__dirname, './ua-assetify-458913-b01652c86e98.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const driveService = google.drive({ version: 'v3', auth });

module.exports = driveService;
