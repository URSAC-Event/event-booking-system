const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connection = require('./connection/db');
const councilRoutes = require('./routes/route'); // Using your existing DB connection file
const app = express();
const verificationRoutes = require('./routes/route');
const PORT = 5000;
const routes = require('./routes/route');
const fs = require('fs');
// Middleware
app.use(cors());
app.use('/api', routes);
app.use(express.json());
app.use(verificationRoutes);
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static("uploads"));


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();

cloudinary.config({
  cloud_name: "dgqu5rdof",
  api_key: "934136579321956",
  api_secret: "R6jXXcHIoXw-uRsCf4YLPhJBupw",
});






//reset password
// Reset password route
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Check if the email exists in the users table
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      // If no user is found with that email
      return res.status(404).json({ message: 'Email not found' });
    }

    // Email exists, now update the password
    const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
    connection.query(updatePasswordQuery, [newPassword, email], (err, result) => {
      if (err) {
        console.log('Error updating password:', err);
        return res.status(500).json({ message: 'Failed to update password' });
      }

      // Password successfully updated
      res.status(200).json({ message: 'Password successfully updated!' });
    });
  });
});



app.post('/api/reset-passwordadmin', (req, res) => {
  const { email, newPassword } = req.body;

  // Check if the email exists in the users table
  const checkEmailQuery = 'SELECT * FROM admin WHERE adminemail = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      // If no user is found with that email
      return res.status(404).json({ message: 'Email not found' });
    }

    // Email exists, now update the password
    const updatePasswordQuery = 'UPDATE admin SET adminpassword = ? WHERE adminemail = ?';
    connection.query(updatePasswordQuery, [newPassword, email], (err, result) => {
      if (err) {
        console.log('Error updating password:', err);
        return res.status(500).json({ message: 'Failed to update password' });
      }

      // Password successfully updated
      res.status(200).json({ message: 'Password successfully updated!' });
    });
  });
});



//admin email check


app.post('/api/check-email-admin', (req, res) => {
  const { email } = req.body;

  // Query to check if email exists in the users table
  connection.query('SELECT * FROM admin WHERE adminemail = ?', [email], (err, result) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }

    if (result.length > 0) {
      // Email exists
      res.status(200).send({ exists: true, message: 'Email exists' });
    } else {
      // Email does not exist
      res.status(404).send({ exists: false, message: 'No email found' });
    }
  });
});



// Route to check if the email exists in the database
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Query to check if the email exists
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      // Email exists in the database
      res.status(200).json({ message: 'Email exists' });
    } else {
      // Email does not exist
      res.status(404).json({ message: 'Email not found' });
    }
  });
});


// check email 
// Route to check if email exists in the database
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;

  // Query to check if email exists in the users table
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      res.status(500).send('Server error');
      return;
    }

    if (result.length > 0) {
      // Email exists
      res.status(200).send({ exists: true, message: 'Email exists' });
    } else {
      // Email does not exist
      res.status(404).send({ exists: false, message: 'No email found' });
    }
  });
});


// Route to submit a report (User side)
app.post('/api/submitReportadmin', (req, res) => {
  const { userId, message } = req.body;

  // Insert the report into the database
  const query = 'INSERT INTO reports (user_id, messageadmin, status) VALUES (?, ?, "pending")';
  connection.query(query, [userId, message], (err, result) => {
    if (err) {
      console.error('Error inserting report:', err);
      return res.status(500).json({ error: 'Failed to submit report' });
    }

    console.log('Report submitted:', result);
    res.status(200).json({ message: 'Report submitted successfully', reportId: result.insertId });
  });
});


// Route to submit a report (User side)
app.post('/api/submitReport', (req, res) => {
  const { userId, message, org } = req.body;

  // Log the data to ensure it's being passed correctly
  console.log("Received data:", { userId, message, org });

  // Insert the report into the database with "hello" as the default for messageadmin
  const query = 'INSERT INTO reports (user_id, message, status, org, messageadmin) VALUES (?, ?, "pending", ?, ?)';

  connection.query(query, [userId, message, org, 'hello'], (err, result) => {
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

// Delete all reports (admin)

// app.delete('/api/reports/deleteall', (req, res) => {
//   const query = 'DELETE FROM reports'; // Delete all rows from the reports table

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error('Error deleting all reports:', err);
//       return res.status(500).json({ error: 'Failed to delete all reports' });
//     }

//     res.status(200).json({ message: 'All reports deleted successfully' });
//   });
// });






// Serve files from the 'documents' and 'uploads' folders
app.use('/api/adviserpic', express.static(path.join(__dirname, 'adviserpic')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//FOR SLIDESHOW
// Endpoint to fetch the list of images from the 'uploads' folder
app.get("/api/slideshow-images", (req, res) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Fetch approved images with a future or current date
  connection.query(
    "SELECT photo FROM approved WHERE datefrom >= ?",
    [today],
    (err, results) => {
      if (err) {
        console.error("Error fetching images from database:", err);
        return res.status(500).json({ message: "Database query failed" });
      }

      // Directly return Cloudinary image URLs from the database
      const imageUrls = results.map((row) => row.photo);
      res.json(imageUrls);
    }
  );
});


// Define the path for the 'uploads' folder
const uploadFolder = path.join(__dirname, 'uploads');

// Setup file storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "event-booking", // Cloudinary folder where failes will be stored
      public_id: Date.now() + "-" + file.originalname, // Unique filename
      resource_type: file.mimetype === "application/pdf" ? "raw" : "image", // Use 'raw' for PDFs, 'image' for images
    };
  },
});

const upload = multer({ storage });



app.get('/api/organizations', (req, res) => {
  const query = 'SELECT organization FROM councils';  // Select only the "organization" column
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching organizations:', err);
      return res.status(500).json({ message: 'Error fetching organizations' });
    }
    res.status(200).json(results);  // Send only the organization data
  });
});

app.post('/api/events', upload.fields([{ name: 'document' }, { name: 'poster' }]), (req, res) => {
  if (req.files && (!req.files.document || !req.files.poster)) {
    return res.status(400).json({ message: 'Missing required files.' });
  }

  const { venue, name, organization, date, datefrom, duration } = req.body;
  const document = req.files.document ? req.files.document[0].path : null; // Store Cloudinary URL
  const poster = req.files.poster ? req.files.poster[0].path : null; // Store Cloudinary URL

  const query = 'INSERT INTO events (name, organization, date, datefrom, duration, documents, photo, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, organization, date, datefrom, duration, document, poster, venue], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error inserting event data', error: err.message });
    }
    res.status(200).json({ message: 'Event added successfully', eventId: results.insertId });
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
  const query = 'SELECT id, name, username, email, password, organizationz FROM users';
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
  let { name, username, email, password, organizationz } = req.body;
  name = "User";

  // Simple validation
  if (!name || !username || !email || !password || !organizationz) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // First, check if an account already exists for the given organization
  const checkOrgQuery = 'SELECT * FROM users WHERE organizationz = ?';
  connection.query(checkOrgQuery, [organizationz], (err, results) => {
    if (err) {
      console.error('Error checking organization:', err);
      return res.status(500).json({ message: 'Database error while checking organization' });
    }
    if (results.length > 0) {
      // If there is already a user for this organization, send an error response
      return res.status(400).json({ message: 'An account for this organization already exists' });
    }

    // No existing account for this organization, so proceed to insert the new user
    const insertQuery = 'INSERT INTO users (name, username, email, password, organizationz) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, username, email, password, organizationz], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error inserting user' });
      }
      res.status(201).json({ id: results.insertId, name, username, email, organizationz });
    });
  });
});


app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, username, email } = req.body;

  // Validate email format
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if the username already exists (excluding the current user)
  const checkUsernameQuery = 'SELECT id FROM users WHERE username = ? AND id != ?';
  connection.query(checkUsernameQuery, [username, id], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ message: 'Error checking username' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Update user details
    const updateQuery = 'UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?';
    connection.query(updateQuery, [name, username, email, id], (err, updateResults) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Error updating user' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    });
  });
});

//COUNCILSS SLIDEBAR SELECTION and display
app.get('/api/councilsdisplay', (req, res) => {
  connection.query('SELECT * FROM councils', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(results); // Send all council details to the frontend
  });
});

const failedAttempts = {}; // Store failed attempts { username: { count, lockUntil } }

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!failedAttempts[username]) {
    failedAttempts[username] = { count: 0, lockUntil: null };
  }

  const userAttempts = failedAttempts[username];

  // Check if user is locked out
  if (userAttempts.lockUntil && Date.now() < userAttempts.lockUntil) {
    return res.status(403).json({ success: false, message: "Too many failed attempts. Try again later." });
  }

  const query = "SELECT * FROM users WHERE BINARY username = ?";

  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      if (results[0].password === password) {
        // Reset failed attempts on successful login
        delete failedAttempts[username];

        return res.json({
          success: true,
          message: "Login successful",
          userId: results[0].id,
          role: results[0].role,
          organization: results[0].organizationz, // Ensure correct field name
        });
      } else {
        userAttempts.count += 1;

        if (userAttempts.count >= 5) {
          userAttempts.lockUntil = Date.now() + 10 * 60 * 1000; // Lock for 10 mins
          return res.status(403).json({ success: false, message: "Too many failed attempts. Try again later." });
        }

        return res.status(401).json({
          success: false,
          message: "Incorrect password",
          attempts: userAttempts.count, // Send the exact failed attempt count
        });
      }
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  });
});




// Login route for admin
// Store failed login attempts
const failedAdminAttempts = {}; // { username: { count, lockUntil } }

app.post('/api/adminlogin', (req, res) => {
  const { username, password } = req.body;

  // Check if user is locked out
  if (failedAdminAttempts[username] && failedAdminAttempts[username].lockUntil > Date.now()) {
    return res.status(403).json({ success: false, message: "Too many failed attempts. Try again later." });
  }

  const query = "SELECT * FROM admin WHERE BINARY adminuser = ?";
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0 && results[0].adminpassword === password) {
      // Reset failed attempts on successful login
      delete failedAdminAttempts[username];

      return res.json({ success: true, message: "Admin login successful" });
    }

    // Track failed attempts
    if (!failedAdminAttempts[username]) {
      failedAdminAttempts[username] = { count: 1, lockUntil: 0 };
    } else {
      failedAdminAttempts[username].count++;
    }

    // Lock out user after 5 failed attempts
    if (failedAdminAttempts[username].count >= 5) {
      failedAdminAttempts[username].lockUntil = Date.now() + 10 * 60 * 1000; // Lock for 10 mins
      return res.status(403).json({ success: false, message: "Too many failed attempts. Try again later." });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials", attempts: failedAdminAttempts[username].count });
  });
});










//calendar

app.get('/api/approved', (req, res) => {
  const { date } = req.query;

  // Get the current date in YYYY/MM/DD format
  const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

  if (!date) {
    // Fetch approved events with dates today or in the future
    connection.query(
      'SELECT * FROM approved WHERE DATE_FORMAT(date, "%Y/%m/%d") >= ?',
      [currentDate],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).json({ message: 'Database query error' });
        }
        res.json(results); // Return filtered events
      }
    );
  } else {
    // Convert the provided date to YYYY/MM/DD format for comparison
    const formattedDate = new Date(date).toISOString().split("T")[0].replace(/-/g, "/");

    // Fetch events for the specific date range
    connection.query(
      'SELECT * FROM approved WHERE DATE_FORMAT(date, "%Y/%m/%d") <= ? AND DATE_FORMAT(datefrom, "%Y/%m/%d") >= ?',
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

app.get('/api/approvedhistory', (req, res) => {
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



app.delete('/api/approved-table/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Received delete request for ID:", id);

  try {
    // Ensure ID is properly formatted
    const numericId = Number(id);
    if (isNaN(numericId)) {
      console.error("Invalid ID:", id);
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Execute DELETE query using async/await
    const [result] = await connection.promise().query('DELETE FROM approved WHERE id = ?', [numericId]);

    console.log("Delete query result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Event deleted successfully" });
    } else {
      console.warn("Event not found in the database for ID:", numericId);
      return res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Database error while deleting event:", error);
    return res.status(500).json({ message: "Server error while deleting event", error: error.message });
  }
});

















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
  console.log(`Received request to approve event with ID: ${id}`);

  const query = 'SELECT * FROM events WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).json({ message: 'Error fetching event', error: err });
    }

    if (results.length > 0) {
      const event = results[0];

      // Directly use the Cloudinary image URL
      const insertQuery = `
        INSERT INTO approved (id, name, organization, date, datefrom, duration, documents, photo, venue)
        SELECT id, name, organization, date, datefrom, duration, documents, photo, venue
        FROM events
        WHERE id = ?;
      `;

      connection.query(insertQuery, [id], (err, result) => {
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
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  });
});


//COUNCILSS SLIDEBAR SELECTION and display
app.put('/api/councilsedit/:id', upload.single('adviserPIC'), async (req, res) => {
  const councilId = req.params.id;
  const {
    adviser,
    link,
    president,
    vicePresident,
    secretary,
    treasurer,
    auditor,
    pro,
    rep,
    representative,
    trdrepresentative,
    frthrepresentative
  } = req.body;

  try {
    let adviserPicture = null;

    // Check if a new file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'event-booking' });
      adviserPicture = result.secure_url; // Get Cloudinary URL
    }

    // Fetch existing adviserPIC if no new file is uploaded
    connection.query('SELECT adviserPIC FROM councils WHERE id = ?', [councilId], (err, rows) => {
      if (err) {
        console.error('Error fetching existing council:', err);
        return res.status(500).json({ error: 'Error fetching existing council' });
      }
      const existingAdviserPIC = rows.length > 0 ? rows[0].adviserPIC : null;
      adviserPicture = adviserPicture || existingAdviserPIC; // Use existing if no new file

      const updateQuery = `
        UPDATE councils
        SET adviser = ?, 
            link = ?,
            president = ?, 
            vicePresident = ?, 
            secretary = ?, 
            treasurer = ?, 
            auditor = ?, 
            pro = ?, 
            rep = ?, 
            representative = ?,
            trdrepresentative = ?,
            frthrepresentative = ?,
            adviserPIC = ?
        WHERE id = ?
      `;

      const values = [
        adviser || null,
        link || null,
        president || null,
        vicePresident || null,
        secretary || null,
        treasurer || null,
        auditor || null,
        pro || null,
        rep || null,
        representative || null,
        trdrepresentative || null,
        frthrepresentative || null,
        adviserPicture,
        councilId
      ];

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
  } catch (error) {
    console.error('Error updating council:', error);
    res.status(500).json({ error: 'An error occurred while updating council details' });
  }
});





const storageForAdviserPic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'adviserpic')); // Store files in 'adviserpic' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  },
});

const uploadForAdviserPic = multer({ storage: storageForAdviserPic }).single('adviserPicture');




app.post('/api/councils-add', upload.single('adviserPIC'), async (req, res) => {
  const {
    organization,
    adviser,
    link,
    president,
    vicePresident,
    secretary,
    treasurer,
    auditor,
    pro,
    rep,
    representative,
    thirdRepresentative, // New field
    fourthRepresentative // New field
  } = req.body;

  let adviserPicture = null;

  try {
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'event-booking',
      });
      adviserPicture = result.secure_url; // Cloudinary URL
    }

    // Validate required fields
    if (!organization || !adviser || !link || !rep) {
      return res.status(400).json({ message: 'Organization, Link, Adviser, and Rep are required fields.' });
    }

    const query = `
      INSERT INTO councils (organization, adviser, adviserPIC, link, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative, trdrepresentative, frthrepresentative)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      organization,
      adviser,
      adviserPicture,
      link,
      president,
      vicePresident,
      secretary,
      treasurer,
      auditor,
      pro,
      rep,
      representative,
      thirdRepresentative, // New value
      fourthRepresentative // New value
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error saving data to the database:', err.sqlMessage || err.message);
        return res.status(500).json({ message: 'Error saving data to the database', error: err.sqlMessage || err.message });
      }

      res.status(200).json({
        message: 'Council data saved successfully!',
        data: { organization, adviser, adviserPicture, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative, thirdRepresentative, fourthRepresentative },
      });
    });

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    res.status(500).json({ message: 'Error uploading file to Cloudinary', error: error.message });
  }
});





// Delete a council by ID
app.delete("/api/delete-council/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM councils WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting council:", err);
      return res.status(500).json({ error: "Failed to delete council" });
    }
    res.json({ message: "Council deleted successfully" });
  });
});


// Endpoint to delete user by id
app.delete('/api/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  console.log("Received userId:", userId); // Log the userId to verify it is correct

  // SQL query to delete the user based on the id
  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).send('Failed to delete user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User deleted successfully');
  });
});


// In your server.js (Node.js example)
app.delete('/api/users-delete/:username', (req, res) => {
  const { username } = req.params;

  // Perform the deletion in your database, e.g. MySQL or MongoDB
  // Example SQL query (using MySQL):
  const query = 'DELETE FROM users WHERE username = ?';

  connection.query(query, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});




// Assuming you're using Express
app.put('/api/update-council/:id', (req, res) => {
  const { id } = req.params;
  const { organization, adviser, link, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative, trdrepresentative, frthrepresentative } = req.body;

  // Make sure the ID exists in the database and update the data
  const query = `
    UPDATE councils SET organization = ?, adviser = ?, link = ?, president = ?, vicePresident = ?, secretary = ?, treasurer = ?, auditor = ?, pro = ?, rep = ?, representative = ?, trdrepresentative = ?, frthrepresentative = ?
    WHERE id = ?
  `;

  const values = [organization, adviser, link, president, vicePresident, secretary, treasurer, auditor, pro, rep, representative, trdrepresentative, frthrepresentative, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating council:', err);
      return res.status(500).json({ message: 'Error updating council data', error: err.message });
    }
    res.status(200).json({ message: 'Council updated successfully!' });
  });
});

// Backend route to check if username exists
app.post('/api/users', (req, res) => {
  const { name, username, email, password, organizationz } = req.body;

  // Input validation (basic example)
  if (!name || !username || !email || !password || !organizationz) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Query to insert user into the database
  const query = 'INSERT INTO users (name, username, email, password, organization) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, username, email, password, organizationz], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Error adding user' });
    }
    res.status(201).json({ id: results.insertId, name, username, email, organizationz });
  });
});





app.get('/api/getApprovedData', async (req, res) => {
  const { organization } = req.query; // Get organization from the query parameter
  const orgString = String(organization); // Ensure it's treated as VARCHAR

  try {
    const query = 'SELECT venue, organization, duration, date, datefrom FROM approved WHERE organization = ?';
    connection.query(query, [orgString], (error, results) => {
      if (error) {
        return res.status(500).send('Error fetching data');
      }
      if (results.length > 0) {
        res.json(results); // Return all results as an array
      } else {
        res.status(404).send('No matching data found for this organization');
      }
    });
  } catch (error) {
    res.status(500).send('Error fetching approved data');
  }
});

// GET endpoint to fetch forbidden days from the settings table
app.get('/api/forbidden-days', (req, res) => {

  console.log("pls work");


  connection.query('SELECT forbiddenDays FROM settings WHERE id = 1', (err, results) => {
    if (err) {
      console.error('Error querying forbiddenDays:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (results.length > 0) {
      const forbiddenDays = results[0].forbiddenDays;

      // Log the value directly
      console.log("Forbidden days from database:", forbiddenDays);

      // Respond with the forbiddenDays as they are (no need for parsing)
      res.json({ forbiddenDays });
    } else {
      res.json({ forbiddenDays: [] });
    }
  });
});




app.put('/api/forbidden-days', (req, res) => {
  // Destructure the forbiddenDays array from the request body
  const { forbiddenDays } = req.body;

  // Validate that forbiddenDays is an array
  if (!Array.isArray(forbiddenDays)) {
    return res.status(400).json({ message: 'Invalid data format, forbiddenDays must be an array' });
  }

  // Convert the array to a JSON string for storage in the JSON column
  const forbiddenDaysStr = JSON.stringify(forbiddenDays);
  console.log("PUT /api/forbidden-days");

  // Update the settings record (assuming id = 1)
  connection.query('UPDATE settings SET forbiddenDays = ? WHERE id = 1', [forbiddenDaysStr], (err, results) => {
    if (err) {
      console.error('Error updating forbiddenDays:', err);
      // Send a 500 status if there's an error during update
      return res.status(500).json({ message: 'Database update error' });
    }
    // Respond with a success message if update is successful
    res.json({ message: 'Forbidden days updated successfully.' });
  });
});







//Validation sa admin
app.post('/api/events/check-overlap', async (req, res) => {
  const { startDate, endDate, duration } = req.body;
  const [newStartTime, newEndTime] = duration.split(" to ");

  console.log(`Checking overlap for event: ${startDate} to ${endDate} (${newStartTime} - ${newEndTime})`);

  try {
    const query = `SELECT date, datefrom, duration FROM approved`;

    connection.query(query, [], (error, results) => {
      if (error) {
        console.error("Error fetching approved events:", error);
        return res.status(500).json({ message: "Error fetching approved events." });
      }

      console.log(`Found ${results.length} approved events.`);

      const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return hours * 60 + minutes; // Convert to minutes for easier comparison
      };

      const newStart = parseTime(newStartTime);
      const newEnd = parseTime(newEndTime);

      for (let event of results) {
        let [existingStartTime, existingEndTime] = event.duration.split(" to ");

        const approvedStartDate = event.date;
        const approvedEndDate = event.datefrom;

        console.log(`Checking against approved event: ${approvedStartDate} to ${approvedEndDate} (${existingStartTime} - ${existingEndTime})`);

        const existingStart = parseTime(existingStartTime);
        const existingEnd = parseTime(existingEndTime);

        // 1-hour grace period before and after the event
        const graceBefore = existingStart - 60; // No event should end past this time
        const graceAfter = existingEnd + 60; // No event should start before this time

        const isTimeOverlap =
          (newStart < existingEnd + 60 && newEnd > existingStart - 60) ||  // Overlaps main event or grace period
          (newStart <= existingStart && newEnd >= existingEnd);            // Fully contains an existing event

        const isDateOverlap = (startDate <= approvedEndDate && endDate >= approvedStartDate);

        if (isDateOverlap && isTimeOverlap) {
          console.log("❌ Overlap detected! Rejecting event.");
          return res.status(400).json({
            message: 'An event is already approved in this time range (including grace period).',
          });
        }
      }

      console.log("✅ No overlap detected. Event can be approved.");
      return res.status(200).json({ message: 'No overlap found. Event can be approved.' });
    });
  } catch (error) {
    console.error("Error checking overlap:", error);
    res.status(500).json({ message: "Error checking event overlap." });
  }
});













app.get('/api/date-timecheck', (req, res) => {
  const sql = 'SELECT id, date, datefrom, duration FROM approved';

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
