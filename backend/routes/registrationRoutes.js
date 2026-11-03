import { Router } from 'express';
import { createRegistration, getRegistrations, deleteRegistration } from '../controllers/registrationController.js';
const router = Router();
router.get('/', getRegistrations);
router.post('/', createRegistration);
router.delete('/:id', deleteRegistration);
export default router;
