require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serviranje statičkih fajlova (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../')));

// Ruta za početnu stranicu
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Konfiguracija Nodemailer transportera (zajednička)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ruta za rezervacije
app.post('/reservation', (req, res) => {
  const { 
    name, 
    phone, 
    email, 
    "event-type": eventType, 
    "event-date": eventDate, 
    guests, 
    message 
  } = req.body;

  console.log("Primljeni podaci za rezervaciju:", req.body);

  // Validacija osnovnih polja
  if (!name || !phone || !email || !eventType || !eventDate) {
    return res.status(400).json({ 
      success: false, 
      message: 'Molimo popunite sva obavezna polja.' 
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Nova rezervacija od ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Nova Rezervacija
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Ime i prezime:</strong></td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Telefon:</strong></td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Email:</strong></td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Tip događaja:</strong></td>
            <td style="padding: 10px;">${eventType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Datum događaja:</strong></td>
            <td style="padding: 10px;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Broj gostiju:</strong></td>
            <td style="padding: 10px;">${guests || 'Nije navedeno'}</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 10px; background: #f9f9f9;" colspan="2"><strong>Poruka:</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;" colspan="2">${message}</td>
          </tr>
          ` : ''}
        </table>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Greška pri slanju emaila:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Došlo je do greške pri slanju rezervacije.' 
      });
    } else {
      console.log('Email poslan: ' + info.response);
      res.json({ 
        success: true, 
        message: 'Rezervacija primljena! Hvala što ste nas kontaktirali.' 
      });
    }
  });
});

// Ruta za kontakt formu
app.post('/contact', (req, res) => {
  const { 
    name, 
    phone, 
    email, 
    subject, 
    message 
  } = req.body;

  console.log("Primljeni podaci iz kontakt forme:", req.body);

  // Validacija osnovnih polja
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Molimo popunite sva obavezna polja.' 
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: subject ? `Kontakt: ${subject}` : `Nova poruka od ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Nova Poruka - Kontakt Forma
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Ime i prezime:</strong></td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Telefon:</strong></td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Email:</strong></td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          ${subject ? `
          <tr>
            <td style="padding: 10px; background: #f9f9f9;"><strong>Tema:</strong></td>
            <td style="padding: 10px;">${subject}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; background: #f9f9f9;" colspan="2"><strong>Poruka:</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;" colspan="2">${message}</td>
          </tr>
        </table>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Greška pri slanju emaila:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Došlo je do greške pri slanju poruke.' 
      });
    } else {
      console.log('Email poslan: ' + info.response);
      res.json({ 
        success: true, 
        message: 'Hvala vam! Vaša poruka je uspješno poslana.' 
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Došlo je do greške na serveru.' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Stranica nije pronađena.' 
  });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
  console.log(`Email konfigurisan: ${process.env.EMAIL_USER || 'nije postavljen'}`);
});