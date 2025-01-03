import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {

    const requestHeader = req.headers["Authorization"]

    const token = requestHeader && requestHeader.split(" ")[0];

    if(token === null) {
        res.status(401).res.json({
            message: "Token cannot be null"
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403);
        req.user = user;

        next();
    })
}