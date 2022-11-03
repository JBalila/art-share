exports.handleErrors = function(endpoint, ...args) {
    if (endpoint === '/api/sendFriendRequest')
        handleSendFriendRequest(args[0], args[1]);
    else if (endpoint === '/api/acceptFriendRequest')
        handleRemoveFriendRequest(args[0], args[1]);
    else if (endpoint === '/api/declineFriendRequest')
        handleRemoveFriendRequest(args[0], args[1]);
    else if (endpoint === '/api/removeFriend')
        handleRemoveFriend(args[0], args[1]);
};

// Error handling for sending a friend-request
function handleSendFriendRequest(user, friend) {
    // Null-checking
    if (user == null)
        throw {message: 'The logged-in userID is invalid'};
    if (friend == null)
        throw {message: 'This user does not exist'};

    if (user.Username === friend.Username)
        throw {message: 'You cannot send a friend-request to yourself'};
    if (user.SentRequests.includes(friend._id))
        throw {message: `You have already sent a friend-request to ${friend.Username}`};
    if (user.PendingRequests.includes(friend._id))
        throw {message: `${friend.Username} has already sent a friend-request to you`};
    if (user.Clique.includes(friend._id))
        throw {message: `${friend.Username} is already in your clique`};
}

// Error handling for accepting/declining a friend-request
function handleRemoveFriendRequest(user, friend) {
    if (user == null)
        throw {message: 'The logged-in userID is invalid'};
    if (friend == null)
        throw {message: 'This user does not exist'};

    if (user.Username === friend.Username)
        throw {message: 'You cannot accept/decline your own friend-request'};

    if (!user.PendingRequests.includes(friend._id))
        throw {message: `You did not receive a friend-request from ${friend.Username}`};
    if (user.Clique.includes(friend._id))
        throw {message: `${friend.Username} is already in your Clique`};

    if (!friend.SentRequests.includes(user._id))
        throw {message: `${friend.Username} did not send a friend-request to you`};
    if (friend.Clique.includes(user._id))
        throw {message: `${user.Username} is already in ${friend.Username}'s Clique`};
}

// Error handling for '/api/removeFriend' endpoint
function handleRemoveFriend(user, friend) {
    if (user == null)
        throw {message: 'The logged-in userID is invalid'};
    if (friend == null)
        throw {message: 'This user does not exist'};

    if (user.Username === friend.Username)
        throw {message: 'You cannot remove yourself as a friend'};

    if (!user.Clique.includes(friend._id))
        throw {message: `${friend.Username} is not in your Clique`};
    if (!friend.Clique.includes(user._id))
        throw {message: `${user.Username} is not in ${friend.Username}'s Clique`};
}

