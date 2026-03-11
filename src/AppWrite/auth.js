import AppwriteConf from '../appwriteConfigrationKeys/ConfigrationofAppwrite'
import { Client, Account, ID } from 'appwrite'

export class UserAuthentication {
    client = new Client();
    account;
    userid;

    constructor() {
        this.client.setEndpoint(AppwriteConf.appwriteUrl)
            .setProject(AppwriteConf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    // // 1. Password Based Account Creation
    // async createUserAccount({ email, password, name }) {
    //     try {
    //         const userAccount = await this.account.create(
    //             ID.unique(),
    //             email,
    //             password,
    //             name
    //         );
    //         if (userAccount) {
    //             return this.login({ email, password });
    //         }
    //         return userAccount;
    //     } catch (error) {
    //         console.error("Appwrite service :: createUserAccount :: error", error);
    //         throw error;
    //     }
    // }

    // // 2. Email/Password Login
    // async login({ email, password }) {
    //     try {
    //         return await this.account.createEmailPasswordSession(email, password);
    //     } catch (error) {
    //         console.error("Appwrite service :: login :: error", error);
    //         throw error;
    //     }
    // }

    // 3. PHASE 1: Send OTP to Email (2025 Standard)
    // Magic URL ki jagah Email Token use karein agar 6-digit code chahiye

    // send otp to user email
    async sendOtp(email) {
        // console.log(this.userid);
        try {
            // Appwrite naye user ke liye ID.unique() aur purane ke liye email se handle kar leta hai
            const sessiontoken = await this.account.createEmailToken(
                ID.unique(),
                email,
                true // Add this param to send a 6-digit phrase instead of magic URL
            );

            if (!sessiontoken) return;
            this.userid = sessiontoken.userId; // Login ke liye userId ko frontend state mein save karna hoga
            return sessiontoken;
        } catch (error) {
            console.error("Appwrite service :: sendOtp :: error", error);
            throw error;
        } finally {
            console.log("system of otp sender if finiced successfully")
        }
    }

    // 4. PHASE 2: Verify OTP and Login
    async verifyOtp(otp, userName) {
        console.log(otp, userName)
        try {
            // secret hi woh 6-digit OTP hai jo user enter karega
            const usersession = await this.account.createSession(this.userid, otp);
            if (userName) {
                this.UpdateUserName(userName).then(() => console.log("username updated successfuly")).catch((err) => console.error(err))
            }
            return usersession;
        } catch (error) {
            console.error(error);
            // throw error;
        }
    }


    // update the user current email by using otp verification
    async SendOTPforUpdateUserEmail({ newemail }) {
        try {
            await this.account.createEmailToken(this.userid, newemail, true);
            return true;
        } catch (error) {
            console.error("Send email otp failed", error);
            throw error;
        }
    }

    async UpdateUserEmail({ newemail, otp }) {
        try {
            return await this.account.updateEmail(newemail, otp);
        } catch (error) {
            console.log("Update email otp failed", error);
            throw error;
        }
    }

    // user Name update in databse
    async UpdateUserName(name) {
        try {
            return await this.account.updateName(name);
        } catch (error) {
            throw error;
        }
    }
    // 5. Get Current User auth Data
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    // 6. Logout from all the devices where user login
    async logoutFromAlldevices() {
        try {
            await this.account.deleteSessions('all');
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }

    // 7. logout only from current device 
    async logoutFromCurrentdevice() {
        try {
            await this.account.deleteSession('current');
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }
}

const userAuthService = new UserAuthentication();
export default userAuthService;