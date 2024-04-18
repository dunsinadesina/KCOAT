import multer from 'multer';
import { UserProfile } from '../model/userprofile.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

export const getUserProfile = async (req, res) => {
    const { cusid } = req.params;
    try {
        const userProfile = await UserProfile.findOne({
            where: {
                customerId: cusid
            }
        });
        if (userProfile) {
            res.status(200).json(userProfile);
        } else {
            console.log('User profile not found');
            res.status(404).json({ error: 'User profile not found' });
        }
    } catch (error) {
        console.log('Error creating user profile', error);
        res.status(500).json({ error: 'Error creating user profile' });
    }
}

export const updateUserProfile = async (req, res) => {
    const { customerId } = req.params;
    const updatedUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        state: req.body.state,
        email: req.body.email,
        country: req.body.country,
        newPassword: req.body.newPassword,
        image: req.file ? req.file.path : null
    }
    try {
        const userProfile = await UserProfile.findOne({
            where: {
                customerId: customerId
            }
        });
        if (!customerId) {
            return res.status(404).json({ error: 'User not found...' });
        }
        await userProfile.update(updatedUserData);
        res.status(200).json(updatedUserData);
    } catch (error) {
        console.log('Error updating user information', error);
        res.status(500).json({ error: 'Error updating customer information' });
    }
}