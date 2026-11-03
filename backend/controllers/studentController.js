import Student from '../models/Student.js';

export async function getStudents(req, res, next) {
  try { res.json(await Student.find().sort({ name: 1 })); }
  catch (error) { next(error); }
}

export async function createStudent(req, res, next) {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) { next(error); }
}
