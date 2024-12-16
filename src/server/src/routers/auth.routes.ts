import express, { Request, Response } from 'express';

import { login } from "../handlers/auth/login.handler";
import { register } from '../handlers/auth/register.handler';
import { authUser, getUserName } from './jwt-utils/jwt.validation';
import { logout } from '../handlers/auth/logout.handler';

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    const model = req.body;
    const result = await login(model);
    res.send(result);
});

router.post("/register", async (req: Request, res: Response) => {
    const model = req.body;
    const result = await register(model);
    res.send(result);
});

router.get("/logout", authUser, async (req: Request, res: Response) => {
    try {
        const username = getUserName(req);
        await logout(username);
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
    }
});



export default router;
