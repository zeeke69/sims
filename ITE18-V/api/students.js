import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'students.json');

export default function handler(req, res) {
  // Create JSON file if missing
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

  const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
  const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  if (req.method === 'GET') {
    const students = readData();
    res.status(200).json(students);
  } 
  else if (req.method === 'POST') {
    const { id, name, gender, gmail, program, year, university } = req.body;

    if (!id || !name || !gmail) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    const students = readData();
    if (students.find(s => s.id === id)) {
      return res.status(400).json({ message: 'Student ID already exists!' });
    }

    students.push({ id, name, gender, gmail, program, year, university });
    writeData(students);
    res.status(200).json({ message: 'Student added successfully!' });
  } 
  else if (req.method === 'DELETE') {
    const id = req.query.id;
    let students = readData();
    const filtered = students.filter(s => s.id !== id);

    if (filtered.length === students.length) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    writeData(filtered);
    res.status(200).json({ message: 'Student deleted successfully!' });
  } 
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
