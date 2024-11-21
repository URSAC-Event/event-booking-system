const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connection = require('./connection/db');
const councilRoutes = require('./routes/route'); // Using your existing DB connection file
const app = express();
const PORT = 5000;
const fs = require('fs');
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static("uploads"));


//report 

// Route to submit a report (User side)
app.post('/submitReport', (req, res) => {
  const { userId, message } = req.body;

  // Insert the report into the database
  const query = 'INSERT INTO reports (user_id, message, status) VALUES (?, ?, "pending")';
  connection.query(query, [userId, message], (err, result) => {
    if (err) {
      console.error('Error inserting report:', err);
      return res.status(500).json({ error: 'Failed to submit report' });
    }

    console.log('Report submitted:', result);
    res.status(200).json({ message: 'Report submitted successfully', reportId: result.insertId });
  });
});

// Route to fetch all reports (Admin side)
app.get('/api/reports', (req, res) => {
  const query = 'SELECT * FROM reports WHERE status = "pending"';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.status(200).json(results);
  });
});

// Route to delete a report (Admin side)
app.delete('/api/reports/:id', (req, res) => {
  const reportId = req.params.id;

  const query = 'DELETE FROM reports WHERE id = ?';
  connection.query(query, [reportId], (err, result) => {
    if (err) {
      console.error('Error deleting report:', err);
      return res.status(500).json({ error: 'Failed to delete report' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  });
});






// Serve files from the 'documents' and 'uploads' folders
app.use('/documents', express.static(path.join(__dirname, 'documents')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//FOR SLIDESHOW
// Endpoint to fetch the list of images from the 'uploads' folder
app.get('/api/slideshow-images', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads');
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading uploads folder' });
    }
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(imageFiles); // Send the list of image filenames to the frontend
  });
});

// Define the path for the 'uploads' folder
const uploadFolder = path.join(__dirname, 'uploads');

// Setup file storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ storage, fileFilter });


// POST route to add an event
app.post('/api/events', upload.fields([{ name: 'document' }, { name: 'poster' }]), (req, res) => {
  const { venue, name, organization, date, datefrom, duration } = req.body;
  const document = req.files.document ? req.files.document[0].filename : null;
  const poster = req.files.poster ? req.files.poster[0].filename : null;

  const query = 'INSERT INTO events (name, organization, date, datefrom, duration, documents, photo, venue) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
  connection.query(query, [name, organization, date, datefrom, duration, document, poster, venue], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error inserting event data' });
    }
    res.status(200).json({ message: 'Event added successfully', eventId: results.insertId });
  });
});


// POST route to add councils
app.post('/api/councils', (req, res) => {
  const { organization, adviser, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative } = req.body;

  const query = `
    INSERT INTO councils (organization, adviser, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [organization, adviser, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative], (err, results) => {
    if (err) {
      console.error('Error inserting council data:', err);
      return res.status(500).json({ message: 'Error saving council data' });
    }
    res.status(200).json({ message: 'Council data saved successfully', councilId: results.insertId });
  });
});


// GET route to fetch all events
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Error fetching event data' });
    }
    res.status(200).json(results);
  });
});





// GET route to fetch all councils
app.get('/api/councils', (req, res) => {
  const query = 'SELECT * FROM councils';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching councils:', err);
      return res.status(500).json({ message: 'Error fetching councils' });
    }
    res.status(200).json(results);
  });
});

// GET route to fetch all user
app.get('/api/users', (req, res) => {
  const query = 'SELECT name, username, password, organizationz FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.status(200).json(results);
  });
});

//Adding user for council 

app.post('/api/users', (req, res) => {
    const { name, username, password, organizationz } = req.body;

    // Simple validation
    if (!name || !username || !password || !organizationz) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password before inserting into the database
    // You can use bcrypt.js for password hashing, for now we are storing it as plain text (but it's not recommended for production)
    const query = 'INSERT INTO users (name, username, password, organizationz) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, username, password, organizationz], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error adding user' });
        }
        res.status(201).json({ id: results.insertId, name, username, organizationz });
    });
});



// Login route for users
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  connection.query(query, [username], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (results.length > 0) {
          if (results[0].password === password) {
              return res.json({ success: true, message: 'Login successful' });
          } else {
              return res.status(401).json({ success: false, message: 'Incorrect password' });
          }
      } else {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
  });
});

// Login route for admin
app.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with username:', username); // Debugging line

  const query = 'SELECT * FROM admin WHERE adminuser = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    console.log('Query results:', results); // Debugging line
    if (results.length > 0 && results[0].adminpassword === password) {
      return res.json({ success: true, message: 'Admin login successful' });
    }
    res.status(401).json({ success: false, message: 'Invalid admin username or password' });
  });
});


// Check database connection
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});







//calendar

app.get('/api/approved', (req, res) => {
  const { date } = req.query;

  if (!date) {
    // Fetch all approved events if no date is provided
    connection.query('SELECT * FROM approved', (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ message: 'Database query error' });
      }
      res.json(results); // Return all approved events
    });
  } else {
    // Convert the provided date to YYYY-MM-DD format for comparison
    const formattedDate = new Date(date).toISOString().split("T")[0];
    
    // Fetch events for the specific date range
    connection.query(
      'SELECT * FROM approved WHERE DATE(date) <= ? AND DATE(datefrom) >= ?',
      [formattedDate, formattedDate],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results); // Return filtered events
      }
    );
  }
});










//deleteee



// DELETE route to remove an event by ID
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete event with ID: ${id}`);  // Log received ID

  const sql = 'DELETE FROM events WHERE id = ?';

  connection.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Error deleting event:', err);
          return res.status(500).json({ message: 'Error deleting event', error: err });
      }

      if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Event deleted successfully' });
      } else {
          res.status(404).json({ message: 'Event not found' });
      }
  });
});






// aprrovving daterow and moving to tables AND renaming Photos

// Approve the event and move it to the approved table
// Function to find the next available event image name
const getNextEventImageName = (uploadsDir) => {
  let eventNumber = 1;
  let eventImageName = `event${eventNumber}.jpg`;
  let eventImagePath = path.join(uploadsDir, eventImageName);

  // Check if the file already exists, and increment the number until an available name is found
  while (fs.existsSync(eventImagePath)) {
    eventNumber++;
    eventImageName = `event${eventNumber}.jpg`;
    eventImagePath = path.join(uploadsDir, eventImageName);
  }

  return eventImageName;
};

app.post('/api/events/approve/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to approve event with ID: ${id}`); // Log received ID

  const query = 'SELECT * FROM events WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).json({ message: 'Error fetching event', error: err });
    }

    if (results.length > 0) {
      const event = results[0];
      const uploadsDir = path.join(__dirname, 'uploads');
      
      // Get the next available image name
      const newImageName = getNextEventImageName(uploadsDir);
      const oldImagePath = path.join(uploadsDir, event.photo);
      const newImagePath = path.join(uploadsDir, newImageName);

      // Check if the old file exists
      fs.access(oldImagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File not found:', oldImagePath);
          return res.status(404).json({ message: 'File not found for renaming' });
        }

        // Rename the file
        fs.rename(oldImagePath, newImagePath, (err) => {
          if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ message: 'Error renaming file', error: err });
          }

          console.log(`File renamed successfully to ${newImageName}`);

          // Continue with the rest of the process (approving the event)
          const insertQuery = `
            INSERT INTO approved (id, name, organization, date, datefrom, duration, documents, photo, venue)
            SELECT id, name, organization, date, datefrom, duration, ?, ?, venue
            FROM events
            WHERE id = ?;
          `;

          connection.query(insertQuery, [newImageName, newImageName, id], (err, result) => {
            if (err) {
              console.error('Error approving event:', err);
              return res.status(500).json({ message: 'Error approving event', error: err });
            }

            const deleteQuery = 'DELETE FROM events WHERE id = ?';
            connection.query(deleteQuery, [id], (err, deleteResult) => {
              if (err) {
                console.error('Error deleting event after approval:', err);
                return res.status(500).json({ message: 'Error cleaning up original event', error: err });
              }

              res.status(200).json({ message: 'Event approved successfully!' });
            });
          });
        });
      });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  });
});







//COUNCILSS SLIDEBAR SELECTION and display
app.get('/api/councils', (req, res) => {
  connection.query('SELECT * FROM councils', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results); // Send all council details to the frontend
  });
});


//edit council on council display 
// Update council details endpoint
app.put('/api/councils/:id', (req, res) => {
  const councilId = req.params.id; // ID from the URL
  const { adviser, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative } = req.body;

  // Ensure created_at is never included
  const updateQuery = `
    UPDATE councils
    SET adviser = ?, 
        president = ?, 
        vicePresident = ?, 
        secretary = ?, 
        treasurer = ?, 
        auditor = ?, 
        pro = ?, 
        rep = ?, 
        representative = ? 
    WHERE id = ?
  `;

  const values = [adviser, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative, councilId];

  connection.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error updating council details:', err);
      return res.status(500).json({ error: 'An error occurred while updating council details' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Council not found' });
    }
    res.status(200).json({ message: 'Council updated successfully' });
  });
});

  


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
