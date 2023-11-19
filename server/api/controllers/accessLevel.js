var jwt = require('jsonwebtoken');


function isAdmin(req, res, next) {
    var myToken = req.query.token || req.body.token || req.cookies.token
    if (myToken) {
        jwt.verify(myToken, process.env.AUTH_KEY, function (e, payload) {
            if (e) {
                res.status(401).jsonp(e)
            }
            else if (payload.level == "admin") {
                req.user = payload.username
                req.level = payload.level
                req.token = myToken
                next()
            }
            else {
                res.status(401).jsonp(e)
            }
        })
    }
    else {
        res.status(401).jsonp(e)
    }
}

function hasAccess(req, res, next) {
    var myToken = req.query.token || req.body.token || req.cookies.token
    if (myToken) {
        jwt.verify(myToken, process.env.AUTH_KEY, function (e, payload) {
            if (e) {
                res.status(401).jsonp(e)
            }
            else {
                req.user = payload.username
                req.level = payload.level
                req.token = myToken
                next()
            }
        })
    }
}

function isMeOrAdmin(req, res, next){ // hasAccess must be called before this
    if(req.params.id == req.user || req.level == "admin"){
        next()
    }
    else{
        res.status(401).jsonp(e)
    }
}

function hasLevelAdmin(req, res, next){
    if(req.level == "admin"){
        next()
    }
    else{
        res.status(401).jsonp(e)
    }
}

module.exports = { isAdmin, hasAccess, isMeOrAdmin, hasLevelAdmin }