const express = require('express');
const router = express.Router();
const userModel = require('./db/user.model');
const jwtHelpers = require('./helpers/jwt')

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




router.post('/login', async function(request, response) {

    const username = request.body.username;
    const password = request.body.password;


    try {
        const user = await userModel.findUserByUsername(username);

        if (user.password === password) {



            request.cookie('pokemonToken', jwtHelpers.generateToken(username));
            return response.send('Log in successful');

        }

        response.status(400);
        return response.send('Username or password is not valid');

    } catch (error) {

        response.status(400);
        return response.send('Username or password is not valid');

    }


})

router.post('/signup', async function(request, response) {

    try {
        const user = await userModel.createUser(request.body);

        response.cookie('pokemonToken', jwtHelpers.generateToken(user.username));
        return response.send('Log in successful');

    } catch (error) {
        response.status(400);
        console.log(error);
        return response.send('Error creating new user');
    }


})

router.post('/logout', function(request, response) {
    response.clearCookie('pokemonToken'); // this doesn't delete the cookie, but expires it immediately
    response.send();
})

router.get('/isLoggedIn', function(request, response) {
    const username = jwtHelpers.decrypt(request.cookies.pokemonToken);
    if (!username) {
        response.status(400);
    }
    response.send();

})

// localhost:3000/api/user
//  ?name=P
// router.get('/', function(request, response) {
//     const query = request.query;
//     const nameStartsWith = query.name;

//     console.log(nameStartsWith)

//     if(nameStartsWith) {
//         const matchingUsers = [];

//         for(let i = 0; i < userDB.length; i++ ) {
//             const user = userDB[i];
//             if(user.username.startsWith(nameStartsWith)) {
//                 matchingUsers.push(user);
//             }
//         }
//         return response.send(matchingUsers);

//     } else {
//         response.send(userDB);
//     }

// })

// // https://www.google.com/search
// // ?
// // q=playstation+465
// // &
// // sort=reverse
// /*
//     {
//         q: "playstation 465",
//         sort: "reverse"
//     }
// */


// router.post('/', function(request, response) {

//     /*
//         {
//             username: 'Hunter',
//             password: '345',
//             id: 'c'
//         }
//     */
//     const body = request.body;
//     const username = body.username;
//     const password = body.password;

//     if(!username || !password) {
//         response.status(400);
//         response.send("Missing username or password");
//         return;
//     }

//     const id = makeid();

//     userDB.push({
//         username: username,
//         password: password,
//         id: id,
//     });

//     response.send("Request received. New user created " + id);
// })

// // /api/user/a
// //   -> userId = 'a'
// router.put('/:inputUserId', function(request, response) {
//     const userId = request.params.inputUserId;
//     const username = request.body.username;
//     const password = request.body.password;

//     if(!username || !password) {
//         response.status(400);
//         response.send("Missing username or password");
//         return;
//     }

//     for(let i = 0; i < userDB.length; i++ ) {
//         const user = userDB[i];
//         if(user.id === userId) {
//             userDB[i].password = password;
//             userDB[i].username = username;
//             return response.send('Successfully updated user ' + userId)
//         }
//     }

//     response.status(400);
//     response.send('No matching user found for ID ' + userId)

// })

// router.delete('/:userId', function(request, response) {
//     const userId = request.params.userId;

//     let userIdxToDelete;

//     for(let i = 0; i < userDB.length; i++ ) {
//         const user = userDB[i];
//         if(user.id === userId) {
//             userIdxToDelete = i;
//         }
//     }

//     if(userIdxToDelete) { 
//         userDB.splice(userIdxToDelete, 1);
//     }

//     response.send('User entry deleted');


// });


// function makeid() {
//     let result = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const charactersLength = characters.length;
//     let counter = 0;
//     while (counter < 10) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//       counter += 1;
//     }
//     return result;
// }


module.exports = router;