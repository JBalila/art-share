const createJWT = require('../../createJWT');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const EXPIRE_TIME = '20m';

let user = {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'jdoe@mail.com',
    Username: 'jdoe'
};

let userAccessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: EXPIRE_TIME});
let refreshedUser = jwt.decode(userAccessToken, {json:true, complete:true}).payload;

test('createJWT(user)', () => {
    expect(createJWT.createToken(user).accessToken)
    .toBe(userAccessToken);
});

test('isExpired(userAccessToken)', () => {
    expect(createJWT.isExpired(userAccessToken))
    .toBe(false);
});

test('refresh(userAccessToken)', () => {
    let refreshedUser = jwt.decode(userAccessToken, {json:true, complete:true}).payload;
    delete refreshedUser.iat;
    delete refreshedUser.exp;
    let refreshedUserAccessToken = jwt.sign(refreshedUser, process.env.ACCESS_TOKEN_SECRET, {expiresIn: EXPIRE_TIME});
    expect(createJWT.refresh(userAccessToken).accessToken)
    .toBe(refreshedUserAccessToken);
});