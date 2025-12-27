import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new ApiError(401, "Authorization token missing or invalid");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

export default validateToken;
