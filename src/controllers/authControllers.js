require("dotenv").config();
const User = require("../models/User");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

let refreshTokens = [];

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage",
);

const authController = {
    registerUser: async (req, res) => {
        try {
            const check = await User.findOne({ email: req.body.email }).populate('role').exec();
            if (check) {
                return res.status(400).json({
                    status: "error",
                    message: "Has already existed email",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = await new User({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
            });

            const user = await newUser.save();
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password, ...others } = user._doc;
            res.status(200).json({
                status: "success",
                message: "Login successfully",
                data: {
                    userData: {
                        ...others,
                    },
                    token: {
                        accessToken,
                        refreshToken,
                        expiresIn: "1d",
                    },
                },
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: "Register failed",
                error: err,
            });
        }
    },
    loginGoogle: async (req, res) => {
        try {
            const userProfile = await oAuth2Client.verifyIdToken({
                idToken: req.body.idToken,
                audience: req.body.clientId,
            });

            const payload = userProfile.getPayload();

            const user = await User.findOne({ email: payload["email"] }).populate('role').exec();

            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(payload["sub"], salt);

                const newUser = await new User({
                    avatar: payload["picture"],
                    fullname: payload["name"],
                    email: payload["email"],
                    password: hashedPassword,
                });

                const user = await newUser.save();
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                const resUser = await User.findOne({ email: payload["email"] }).populate('role').exec();

                const { password, ...others } = resUser._doc;
                res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    data: {
                        userData: {
                            ...others,
                        },
                        token: {
                            accessToken,
                            refreshToken,
                            expiresIn: "1d",
                        },
                    },
                });
            } else {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const { password, ...others } = user._doc;
                res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    data: {
                        userData: {
                            ...others,
                        },
                        token: {
                            accessToken,
                            refreshToken,
                            expiresIn: "1d",
                        },
                    },
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: "Login failed",
                error: err,
            });
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1d" },
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" },
        );
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email }).populate('role').exec();
            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "Không tìm thấy tài khoản",
                });
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password,
            );

            if (!validPassword) {
                res.status(404).json({
                    status: "error",
                    message: "Password is not correct",
                });
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const { password, ...others } = user._doc;
                res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    data: {
                        userData: {
                            ...others,
                        },
                        token: {
                            accessToken,
                            refreshToken,
                            expiresIn: "1d",
                        },
                    },
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Login failed",
                error: error,
            });
        }
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshTokens);
        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "You are not authenticated" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res
                .status(403)
                .json({ message: "Refresh token is not valid" });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user_) => {
            if (err) {
                console.log(err);
            }
            user_ = {
                _id: user_.id,
                admin: user_.admin,
            };
            refreshTokens = refreshTokens.filter(
                (token) => token !== refreshToken,
            );
            const newAccessToken = authController.generateAccessToken(user_);
            const newRefreshToken = authController.generateRefreshToken(user_);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            if (err) {
                res.status(403).json({
                    status: "error",
                    message: "Invalid token",
                });
            } else {
                req.user = user_;
                res.status(200).json({
                    status: "success",
                    message: "Token is valid",
                    token: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        expiresIn: "1d",
                    },
                });
            }
        });
    },
};

module.exports = authController;
