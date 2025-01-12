import { Router, Express } from "express";
import authRoutes from "./auth/auth.routers";
import userRoutes from "./user/user.routers";
import menteeRoutes from "./mentee/mentee.router";
import mentorRoutes from "./mentor/mentor.routers"
import { verifyToken } from "../middlewares/verify-token";

const routes: { path: string, router: Router, useToken: boolean }[] = [
    {
        path: '/auth',
        router: authRoutes,
        useToken: false
    },
    {
        path: '/user',
        router: userRoutes,
        useToken: true
    },
    {
        path: '/mentee',
        router: menteeRoutes,
        useToken: true
    },
    {
        path: '/mentor',
        router: mentorRoutes,
        useToken: true
    }
];

const applyRouters = async (app: Express) => {
    routes.map((route) => {
        if(route.useToken){
            app.use(route.path, verifyToken, route.router)
        }else{
            app.use(route.path, route.router)
        };
    });
};

export default applyRouters;