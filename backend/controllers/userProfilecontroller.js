import fs from 'fs';
import { UserProfile } from '../model/userprofile.js';
import cloudinaryV2 from './cloudinary.js';

const uploadResponse = await cloudinaryV2.uploader.upload(image, {
    upload_preset: "kcoatstyle"
})
const defaultAvatarPath = 'backend/controllers/default_image.jpeg';
let imageUrl = uploadResponse.secure_url;

const upload = multer({ storage: storage }).single('image');

export const getAllUserProfiles = async (req, res) => {
    try {
        const userProfiles = await UserProfile.findAll();
        res.status(200).json(userProfiles);
    } catch (error) {
        console.log('Error getting all user profiles', error);
        res.status(500).json({ error: 'Internal Server error' })
    }
}

export const getUserProfile = async (req, res) => {
    const { cusid } = req.params;
    try {
        const userProfile = await UserProfile.findOne({
            where: {
                customerId: cusid
            }
        });
        if (userProfile) {
            if (!userProfile.image){
                userProfile.image = defaultAvatarPath;
            }
            console.log(defaultAvatarPath);
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
    // Call the upload middleware to handle file upload
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'File upload error' });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        const { cusid } = req.params;
        const updatedUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            state: req.body.state,
            email: req.body.email,
            country: req.body.country,
            newPassword: req.body.newPassword,
            phoneNumber: req.body.phoneNumber,
            image: imageUrl
        }
        try {
            const userProfile = await UserProfile.findOne({
                where: {
                    customerId: cusid
                }
            });
            if (!userProfile) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (userProfile.image !== defaultAvatarPath && fs.existsSync(userProfile.image)) {
                fs.unlinkSync(userProfile.image);
            }
            await userProfile.update(updatedUserData);
            res.status(200).json(updatedUserData);
        } catch (error) {
            console.log('Error updating user information', error);
            res.status(500).json({ error: 'Error updating customer information' });
        }
    });
}