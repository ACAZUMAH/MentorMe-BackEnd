import authRoutes from "./auth.routers";
import userRoutes from "./user.routers";
import menteeroutes from "./mentee.router";
import mentorRoutes from "./mentor.routers"
import { verifyAccessToken } from "../helpers";
import { Application } from "express-serve-static-core";

const applyRouters = async (app: Application) => {
    app.use("/auth", authRoutes);

    app.use("/user", verifyAccessToken, userRoutes);

    app.use("/mentee", verifyAccessToken, menteeroutes);

    app.use("/mentor", verifyAccessToken, mentorRoutes);
    
    return app;
};

export default applyRouters;