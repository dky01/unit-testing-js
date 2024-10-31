class UserService {
    constructor(database) {
        this.database = database;
    }

    async createUser(user) {
        const userExists = await this.database.checkUserExists(user.username);
        if (userExists) {
            throw new Error('User already exists');
        }

        await this.database.createUser(user);
    }

    async welcome(user) {
        const welcomeMessage = `Welcome, ${user.username}!`;
        console.log(welcomeMessage);
    }
}