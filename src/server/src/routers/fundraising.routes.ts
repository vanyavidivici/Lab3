import express from 'express';
import { authUser, getUserName } from './jwt-utils/jwt.validation';
import { createProjectHandle } from '../handlers/fundraising/create-project.handler';
import { contributeHandle } from '../handlers/fundraising/contribute.handler';
import { refundHandler } from '../handlers/fundraising/refund.handler';
import { changeProjectDeadlineHandle } from '../handlers/fundraising/change-project-deadline.handler';
import { getContributorsHandler } from '../handlers/fundraising/get-contributors.handler';
import { getContributionHandler } from '../handlers/fundraising/get-contribution.handler';
import { isProjectOpenHandler } from '../handlers/fundraising/is-project-open.handler';
import { getOpenProjectsHandler } from '../handlers/fundraising/get-open-projects.handler';

const router = express.Router();

router.post('/create-project', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await createProjectHandle(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Project created successfully" : "Failed to create project");
});

router.post('/contribute', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await contributeHandle(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Contribution successful" : "Failed to contribute");
});

router.post('/refund', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await refundHandler(req.body.projectId, userName);
    res.status(result ? 200 : 500).send(result ? "Refund successful" : "Failed to refund");
});

router.post('/change-deadline', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await changeProjectDeadlineHandle(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Deadline changed successfully" : "Failed to change deadline");
});

router.get('/contributors/:projectId', authUser, async (req, res) => {
    const result = await getContributorsHandler(parseInt(req.params.projectId));
    res.status(result.length > 0 ? 200 : 500).json(result);
});

router.get('/contribution/:projectId', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await getContributionHandler(parseInt(req.params.projectId), userName);
    res.status(result ? 200 : 500).json(result);
});

router.get('/is-project-open/:projectId', authUser, async (req, res) => {
    const result = await isProjectOpenHandler(parseInt(req.params.projectId));
    res.status(result ? 200 : 500).json(result);
});

router.get('/open-projects', authUser, async (req, res) => {
    const result = await getOpenProjectsHandler();
    res.status(result.length > 0 ? 200 : 500).json(result);
});

export default router;