const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer'); 
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("MongoDB connection error:", error));

// Teacher schema
const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  teacherId: { type: String, unique: true, required: true },
  dob: Date,
  gender: String,
  experience: String,
  specialization: String,
  phone: String,
  address: String,
  password: { type: String, required: true },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Student schema
const studentSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  name: String,
  email: String,
  rollno: { type: String, unique: true, required: true },
  phone: String,
  address: String,
  department: String,
  className: String, // Avoiding conflict with 'class'
  section: String,
  year: String,
  subjects: [
    {
      subjectName: String,
      marks: Number,
    },
  ],
  attendance: [
    {
      date: String,
      day: String,
      totalPeriod: Number,
      attendedPeriod: Number,
    },
  ],
});

const ManageStudents = mongoose.model("managestudents", studentSchema);



// Sign-up endpoint to register a new teacher
app.post('/api/signup', async (req, res) => {
  const { name, email, teacherId, dob, gender, experience, specialization, phone, address, password } = req.body;

  try {
    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { teacherId }] });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email or ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      name,
      email,
      teacherId,
      dob,
      gender,
      experience,
      specialization,
      phone,
      address,
      password: hashedPassword,
    });

    await teacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error("Error registering teacher:", error);
    res.status(500).json({ message: 'Error registering teacher' });
  }
});

// Login endpoint for teacher authentication
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ $or: [{ email: identifier }, { teacherId: identifier }] });
    if (teacher && await bcrypt.compare(password, teacher.password)) {
      res.json({ teacherId: teacher.teacherId, email: teacher.email, name: teacher.name });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch teacher details by teacherId (excluding password)
app.get('/api/teacher/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findOne({ teacherId }).select('-password');
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update teacher details by teacherId
app.put('/api/teacher/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  const updatedData = req.body;

  try {
    const teacher = await Teacher.findOneAndUpdate(
      { teacherId },
      { $set: updatedData },
      { new: true }
    ).select('-password');

    if (teacher) {
      res.json({ message: 'Profile updated successfully', teacher });
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error("Error updating teacher data:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student route to add students for a teacher
app.post('/api/managestudents', async (req, res) => {
  const { teacherId, name, email, rollno, phone, address, department, className, section, year, subjects, attendance } = req.body;

  if (!teacherId) {
    return res.status(400).json({ message: 'Teacher ID is required' });
  }

  try {
    const newStudent = new ManageStudents({
      teacherId,
      name,
      email,
      rollno,
      phone,
      address,
      department,
      className,
      section,
      year,
      subjects,
      attendance,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully!' });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(400).json({ message: 'Error adding student.' });
  }
});

app.get('/api/managestudents/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Fetch all students by teacherId
    const students = await ManageStudents.find({ teacherId });

    // If no students found, send an appropriate response
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for this teacher' });
    }

    // Return the student details as JSON
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// Define Platform Schema and Model
const platformSchema = new mongoose.Schema({
  name: String,
  link: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  image: String,
  status: String,
  teacherid: String, // New field for filtering by teacher
});

const Platform = mongoose.model('Platform', platformSchema);

// Routes

// GET platforms for a specific teacher
app.get('/api/platforms', async (req, res) => {
  const { teacherid } = req.query;
  try {
      const query = teacherid ? { teacherid } : {};
      const platforms = await Platform.find(query);
      res.json(platforms);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching platforms', error });
  }
});

// POST a new platform
app.post('/api/platforms', async (req, res) => {
  const platformData = req.body;
  try {
      const newPlatform = new Platform(platformData);
      await newPlatform.save();
      res.status(201).json(newPlatform);
  } catch (error) {
      res.status(500).json({ message: 'Error adding platform', error });
  }
});

// PUT update an existing platform
app.put('/api/platforms/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
      const updatedPlatform = await Platform.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedPlatform) {
          return res.status(404).json({ message: 'Platform not found' });
      }
      res.json(updatedPlatform);
  } catch (error) {
      res.status(500).json({ message: 'Error updating platform', error });
  }
});

// DELETE a platform
app.delete('/api/platforms/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedPlatform = await Platform.findByIdAndDelete(id);
      if (!deletedPlatform) {
          return res.status(404).json({ message: 'Platform not found' });
      }
      res.json({ message: 'Platform deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting platform', error });
  }
});

// Endpoint to fetch student details by roll number
app.get('/api/managestudents/student/:rollno', async (req, res) => {
  const { rollno } = req.params;

  try {
    const student = await ManageStudents.findOne({ rollno });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error while fetching student details' });
  }
});



// Course Schema
const courseSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  courseName: String,
  image: String,
  title: String,
  courseId: { type: String, unique: true, required: true },
  contents: [String],
  notes: String, // URL or file path to notes
});

const Course = mongoose.model('Course', courseSchema);

// API Routes

// Create a new course
app.post('/api/courses', async (req, res) => {
  const { teacherId, courseName, image, title, courseId, contents, notes } = req.body;

  try {
    // Check if courseId already exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }

    // Create a new course document
    const newCourse = new Course({
      teacherId,
      courseName,
      image,
      title,
      courseId,
      contents,
      notes,
    });

    // Save the course to the database
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course' });
  }
});

// Get all courses by teacherId
app.get('/api/courses/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    const courses = await Course.find({ teacherId });
    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this teacher' });
    }
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});


// Assessment schema
const assessmentSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  name: String,
  marks: Number,
  images: [String],
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

// Multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// Post new assessment
app.post('/api/assessments', upload.array('images', 5), async (req, res) => {
  const { teacherId, name, marks, startDate, endDate, startTime, endTime } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);
  
  try {
    const assessment = new Assessment({ teacherId, name, marks, images, startDate, endDate, startTime, endTime });
    await assessment.save();
    res.status(201).json({ message: 'Assessment added successfully' });
  } catch (error) {
    console.error('Error posting assessment:', error);
    res.status(500).json({ message: 'Error posting assessment' });
  }
});

// Fetch assessments by teacherId
app.get('/api/assessments/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  try {
    const assessments = await Assessment.find({ teacherId });
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Error fetching assessments' });
  }
});

// Fetch specific assessment details by assessmentId
app.get('/api/assessments/details/:assessmentId', async (req, res) => {
  const { assessmentId } = req.params;
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    res.status(500).json({ message: 'Error fetching assessment details' });
  }
});


// Define Discussion schema
const discussionSchema = new mongoose.Schema({
  teacherId: String,
  name: String,
  message: String,
  replies: [
    {
      name: String,
      replyMessage: String,
      date: { type: Date, default: Date.now }
    }
  ],
});

const Discussion = mongoose.model('Discussion', discussionSchema);

// Endpoint to add a new discussion
app.post('/addDiscussion', async (req, res) => {
  try {
    const { teacherId, name, message } = req.body;
    const newDiscussion = new Discussion({ teacherId, name, message });
    await newDiscussion.save();
    res.status(201).send({ success: true, message: 'Discussion added' });
  } catch (error) {
    res.status(500).send({ success: false, error: 'Error adding discussion' });
  }
});

// Endpoint to edit a discussion
app.put('/editDiscussion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );
    res.status(200).send({ success: true, updatedDiscussion });
  } catch (error) {
    res.status(500).send({ success: false, error: 'Error editing discussion' });
  }
});

// Endpoint to add a reply to a discussion
app.post('/addReply/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, replyMessage } = req.body;
    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      id,
      { $push: { replies: { name, replyMessage } } },
      { new: true }
    );
    res.status(200).send({ success: true, updatedDiscussion });
  } catch (error) {
    res.status(500).send({ success: false, error: 'Error adding reply' });
  }
});

// Endpoint to get discussions for a specific teacher
app.get('/getDiscussions/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const discussions = await Discussion.find({ teacherId });
    res.status(200).send(discussions);
  } catch (error) {
    res.status(500).send({ success: false, error: 'Error retrieving discussions' });
  }
});




// Define the schema for CAT and SEM reports with catNumber and semNumber
const catSchema = new mongoose.Schema({
  rollno: String, // rollno is the key for each student
  reports: [
    {
      catNumber: Number,  // New field for CAT number
      date: Date,
      marks: [{ subject: String, marks: Number }],
    },
  ],
});

const semSchema = new mongoose.Schema({
  rollno: String, // rollno is the key for each student
  reports: [
    {
      semNumber: Number,  // New field for SEM number
      date: Date,
      marks: [
        {
          courseCode: String,
          courseId: String,
          credits: Number,
          marksScored: Number,
        },
      ],
    },
  ],
});

// Models for the CAT and SEM collections
const CAT = mongoose.model('CAT', catSchema);
const SEM = mongoose.model('SEM', semSchema);

// Route to add CAT or SEM report
app.post('/api/reports/add', async (req, res) => {
  const { reportType, rollno, catNumber, semNumber, date, marks } = req.body;

  try {
    if (reportType === 'CAT') {
      const existingCatReport = await CAT.findOne({ rollno });
      if (existingCatReport) {
        existingCatReport.reports.push({ catNumber, date, marks });
        await existingCatReport.save();
      } else {
        const newCatReport = new CAT({ rollno, reports: [{ catNumber, date, marks }] });
        await newCatReport.save();
      }
    } else if (reportType === 'SEM') {
      const existingSemReport = await SEM.findOne({ rollno });
      if (existingSemReport) {
        existingSemReport.reports.push({ semNumber, date, marks });
        await existingSemReport.save();
      } else {
        const newSemReport = new SEM({ rollno, reports: [{ semNumber, date, marks }] });
        await newSemReport.save();
      }
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    res.status(201).json({ message: 'Report added successfully' });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});


// Endpoint to get CAT reports
app.get('/api/reports/CAT/:rollno', async (req, res) => {
  const { rollno } = req.params;
  try {
    const reports = await CAT.findOne({ rollno });
    if (reports) {
      return res.json({ reports: reports.reports });
    } else {
      return res.status(404).json({ message: 'No CAT reports found for this roll number' });
    }
  } catch (error) {
    console.error('Error fetching CAT reports:', error);
    res.status(500).json({ error: 'Failed to fetch CAT reports' });
  }
});

// Endpoint to get SEM reports
app.get('/api/reports/SEM/:rollno', async (req, res) => {
  const { rollno } = req.params;
  try {
    const reports = await SEM.findOne({ rollno });
    if (reports) {
      return res.json({ reports: reports.reports });
    } else {
      return res.status(404).json({ message: 'No SEM reports found for this roll number' });
    }
  } catch (error) {
    console.error('Error fetching SEM reports:', error);
    res.status(500).json({ error: 'Failed to fetch SEM reports' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const sapschema = new mongoose.Schema({
  name : String,
  rollno : String,
  sap : Number,
  Dep : String,
  Content : String,
  Activity : String,
  No : Number,
  Marks : Number,
  Totalm : Number,
});



