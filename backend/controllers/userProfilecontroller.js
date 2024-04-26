import { UserProfile } from '../model/userprofile.js';

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
    const { cusid } = req.params;
    try {
        const { firstName, lastName, address, state, email, country, newPassword, phoneNumber } = req.body;
        const updatedUserData = {
            firstName,
            lastName,
            address,
            state,
            email,
            country,
            newPassword,
            phoneNumber
        };
        console.log('Updated User Data: ', updatedUserData);
        const userProfile = await UserProfile.findOne({
            where: {
                customerId: cusid
            }
        });
        console.log("User Profile: ", userProfile);
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }
        await userProfile.update(updatedUserData);
        res.status(200).json(userProfile);
    } catch (error) {
        console.log('Error updating user information', error);
        res.status(500).json({ error: 'Error updating customer information' });
    }
};