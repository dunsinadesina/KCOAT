import { UserProfile } from '../model/userprofile.js';
import cloudinaryV2 from './cloudinary.js';


const defaultAvatarPath = 'backend/controllers/default_image.jpeg';

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
            if (!userProfile.image) {
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
    try {
        const { firstName, lastName, address, state, email, country, newPassword, phoneNumber, image } = req.body;
        const uploadResponse = await cloudinaryV2.uploader.upload(image, {
            upload_preset: "kcoatstyle"
        })
        let imageUrl = uploadResponse.secure_url;
        const { cusid } = req.params;
        const updatedUserData = {
            firstName,
            lastName,
            address,
            state,
            email,
            country,
            newPassword,
            phoneNumber,
            image: imageUrl
        }
        const userProfile = await UserProfile.findOne({
            where: {
                customerId: cusid
            }
        });
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }
        await userProfile.update(updatedUserData);
        res.status(200).json(updatedUserData);
    } catch (error) {
        console.log('Error updating user information', error);
        res.status(500).json({ error: 'Error updating customer information' });
    }
};
