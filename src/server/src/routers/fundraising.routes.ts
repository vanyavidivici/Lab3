import express from 'express';
import { authUser, getUserName } from './jwt-utils/jwt.validation';
import { createProjectHandler } from '../handlers/fundraising/create-project.handler';
import { contributeHandler } from '../handlers/fundraising/contribute.handler';
import { refundHandler } from '../handlers/fundraising/refund.handler';
import { changeProjectDeadlineHandler } from '../handlers/fundraising/change-project-deadline.handler';
import { getContributorsHandler } from '../handlers/fundraising/get-contributors.handler';
import { getContributionHandler } from '../handlers/fundraising/get-contribution.handler';
import { isProjectOpenHandler } from '../handlers/fundraising/is-project-open.handler';
import { getOpenProjectsHandler } from '../handlers/fundraising/get-open-projects.handler';
import { getBalanceHandler } from '../handlers/fundraising/get-balance.handler';
import { changeProjectHandler } from '../handlers/fundraising/change-project.handler';
import { deleteProjectHandler } from '../handlers/fundraising/delete-project.handler';
import { getProjectHandler } from '../handlers/fundraising/get-project.handler';

const router = express.Router();

router.post('/create-project', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await createProjectHandler(req.body, userName);
    console.log(result);
    res.status(result ? 200 : 500).json(result);
});

router.get('/get-project/:projectId', authUser, async (req, res) => {
    const result = await getProjectHandler(parseInt(req.params.projectId));
    res.status(result ? 200 : 500).json(result);
});

router.post('/change-project', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await changeProjectHandler(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Project changed successfully" : "Failed to change project");
});

router.post('/delete-project/:projectId', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await deleteProjectHandler(parseInt(req.params.projectId), userName);
    res.status(result ? 200 : 500).send(result ? "Project deleted successfully" : "Failed to delete project");
});

router.post('/contribute', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await contributeHandler(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Contribution successful" : "Failed to contribute");
});

router.post('/balance', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await getBalanceHandler(userName);
    res.status(result ? 200 : 500).json(result);
});

router.post('/refund', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await refundHandler(req.body.projectId, userName);
    res.status(result ? 200 : 500).send(result ? "Refund successful" : "Failed to refund");
});

router.post('/change-deadline', authUser, async (req, res) => {
    const userName = getUserName(req);
    const result = await changeProjectDeadlineHandler(req.body, userName);
    res.status(result ? 200 : 500).send(result ? "Deadline changed successfully" : "Failed to change deadline");
});

router.get('/contributors/:projectId', authUser, async (req, res) => {
    const result = await getContributorsHandler(parseInt(req.params.projectId));
    res.status(result ? 200 : 500).json(result);
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
    res.status(result ? 200 : 500).json(result);
});

export default router;