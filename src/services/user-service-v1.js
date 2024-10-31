class UserService {
    constructor(database, emailService) {
        this.database = database;
        this.emailService = emailService;
    }

    async createUser(user) {
        if (!user.email || !user.password || !user.name) {
            throw new Error('Invalid user data [name, email, password are required]');
        }
        const userExists = await this.database.checkUserExists(user.email);
        if (userExists) {
            throw new Error('User already exists');
        }

        await this.database.save(user);
        await this.emailService.welcome(user);
        return user;
    };

    async updateUser(userId, user) {
        const user = await this.database.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        this.database.update(userId, user);
    }
}