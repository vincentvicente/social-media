const express = require('express');
const router = express.Router();

const userDB = [
    {
        id: 'a',
        username: 'Pete',
        password: '123'
    },
    {
        id: 'b',
        username: 'Yu',
        password: '234',
    }
]

// localhost:3000/api/user
//  ?name=P
router.get('/', function(request, response) {
    const query = request.query;
    const nameStartsWith = query.name;

    console.log(nameStartsWith)

    if(nameStartsWith) {
        const matchingUsers = [];

        for(let i = 0; i < userDB.length; i++ ) {
            const user = userDB[i];
            if(user.username.startsWith(nameStartsWith)) {
                matchingUsers.push(user);
            }
        }
        return response.send(matchingUsers);

    } else {
        response.send(userDB);
    }

})

// https://www.google.com/search
// ?
// q=playstation+465
// &
// sort=reverse
/*
    {
        q: "playstation 465",
        sort: "reverse"
    }
*/


router.post('/', function(request, response) {

    /*
        {
            username: 'Hunter',
            password: '345',
            id: 'c'
        }
    */
    const body = request.body;
    const username = body.username;
    const password = body.password;

    if(!username || !password) {
        response.status(400);
        response.send("Missing username or password");
        return;
    }

    const id = makeid();

    userDB.push({
        username: username,
        password: password,
        id: id,
    });

    response.send("Request received. New user created " + id);
})

// /api/user/a
//   -> userId = 'a'
router.put('/:inputUserId', function(request, response) {
    const userId = request.params.inputUserId;
    const username = request.body.username;
    const password = request.body.password;

    if(!username || !password) {
        response.status(400);
        response.send("Missing username or password");
        return;
    }

    for(let i = 0; i < userDB.length; i++ ) {
        const user = userDB[i];
        if(user.id === userId) {
            userDB[i].password = password;
            userDB[i].username = username;
            return response.send('Successfully updated user ' + userId)
        }
    }

    response.status(400);
    response.send('No matching user found for ID ' + userId)

})

router.delete('/:userId', function(request, response) {
    const userId = request.params.userId;

    let userIdxToDelete;

    for(let i = 0; i < userDB.length; i++ ) {
        const user = userDB[i];
        if(user.id === userId) {
            userIdxToDelete = i;
        }
    }

    if(userIdxToDelete) { 
        userDB.splice(userIdxToDelete, 1);
    }

    response.send('User entry deleted');


});


function makeid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


module.exports = router;