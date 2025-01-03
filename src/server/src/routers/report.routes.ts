import express from 'express';
import { getProjectsReportHandler } from '../handlers/report/get-projects-report.handler';
import { authUser } from './jwt-utils/jwt.validation';

const router = express.Router();

router.get('/projects-report', authUser, async (req, res) => {
    const result = await getProjectsReportHandler();
    res.status(result ? 200 : 500).json(result);
});

export default router;