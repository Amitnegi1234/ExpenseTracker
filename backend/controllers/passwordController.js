const User = require('../models/userModel');
const ForgotPasswordRequest = require('../models/forgetPasswordRequestModel');
const sendEmail = require('../utils/sendEmail');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: { email: email }
        });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const requestId = uuidv4();
        // Deactivate previous reset links
        await ForgotPasswordRequest.update(
            { isactive: false },
            {
                where: {
                    UserId: user.id,
                    isactive: true
                }
            }
        );

        // Create new reset request
        await ForgotPasswordRequest.create({
            id: requestId,
            UserId: user.id,
            isactive: true
        });

        const resetUrl =
            `http://127.0.0.1:5502/frontend/resetpassword/index.html?id=${requestId}`;

        try {
            await sendEmail(
                    email,
                    'Reset Password',
                    `<h3>Reset your password</h3>
                    <a href="${resetUrl}">Click here to reset password</a>`
                );
        } catch (emailError) {
            console.log(
                'Email error:',
                emailError.response?.data || emailError.message
            );

            return res.status(500).json({
                message: 'Unable to send reset email'
            });
        }

        return res.status(200).json({
            message: 'Password reset link sent successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const resetPasswordPage = async (req, res) => {
    try {
        const request = await ForgotPasswordRequest.findOne({
            where: {
                id: req.params.id,
                isactive: true
            }
        });

        if (!request) {
            return res.status(404).json({
                message: 'Invalid or expired reset link'
            });
        }

        return res.status(200).json({
            message: 'Valid reset link'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        // Find active reset request
        const request = await ForgotPasswordRequest.findOne({
            where: {
                id: requestId,
                isactive: true
            }
        });

        if (!request) {
            return res.status(404).json({
                message: 'Invalid or expired reset link'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await User.update(
            { password: hashedPassword },
            {
                where: { id: request.UserId }
            }
        );

        // Deactivate reset request
        await request.update({
            isactive: false
        });

        return res.status(200).json({
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

module.exports = {
    forgotPassword, resetPasswordPage, updatePassword
};
