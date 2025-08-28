const __user_username = Symbol('username');
const __user_password = Symbol('password');
const __user_familyName = Symbol('familyName');
const __user_givenName = Symbol('givenName');
const __user_middleName = Symbol('middleName');
const __user_email = Symbol('email');
import bcrypt from 'bcrypt';


export class User{
    constructor(username, password, givenName, middleName, familyName, email){
        this.__user_username = username;
        this.__user_password = password;
        this.__user_familyName = familyName;
        this.__user_middleName = middleName;
        this.__user_givenName = givenName;
        this.__user_email = email;
    }

    get username(){ return this.__user_username; }
    set username(newUserName) { this.__user_username = newUserName; }
    
    get password() { return this.__user_password; }
    set password(newUserPassword) { this.__user_password = newUserPassword; }
    

    get familyName() {return this.__user_familyName;}
    set familyName(newFamilyName) { this.__user_familyName = newFamilyName; }

    get middleName() { return this.__user_middleName; }
    set middleName(newMiddleName) { this.__user_middleName = newMiddleName; }

    get givenName() { return this.__user_givenName; }
    set givenName(newGivenName) { this.__user_givenName = newGivenName; }

    get email() { return this.__user_email; }
    set email(newEmail) { this.__user_email = newEmail; }

    userInformation() {
        return {
            username: this.__user_username,
            givenName: this.__user_givenName,
            middleName: this.__user_middleName,
            familyName: this.__user_familyName,
            email: this.__user_email
        };
    }
}

export class AbstarctUserStore{
    async close() {}
    async update(username, updateObject) {}
    async create(username, password, givenName, middleName, familyName, email) {}
    async read(username) {}
    async destroy(username) {}
    async usernamelist() {}
    async count() {}
}
