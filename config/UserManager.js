const User = require('./model');

class UserManager {

    constructor() {
        this.users = []
    }

    getUserById(id) {
        return this.users.filter(user => user._id === id)[0]
    }

    getUserByEmail(email) {
        return this.users.filter(user => user.email === email)[0]
    }

    addUser(email, isLive = false) {
        if(!this.getUserByEmail(email)) {
            this.users.push(new User({ email, isLive }))
        } else {
            // Meaning the user already exists, so lets update it
            this.users = this.users.map(user => {
                if(user.email === email) {
                    user.isLive = isLive
                    return user
                } else {
                    return user
                }
            })
        }
    }

    removeUser(email) {
        this.users = this.users.filter(user => user.email !== email)
    }

}

module.exports = UserManager