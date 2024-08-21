class userController {
    async registartion(req, res) {

    }

    async login(req, res) {

    }

    async checkAuth(req, res) {
        const {id} = req.query
        res.json(id) 
    }
}

module.exports = new userController()