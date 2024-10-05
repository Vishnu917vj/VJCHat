export const getSender = (user, users) => {
  if (!Array.isArray(users) || users.length <= 1) {
    return ""; // Ensure users is an array and has more than 1 user
  }

  const otherUser = users.find((u) => u._id !== user._id);
  return otherUser ? otherUser.username : ""; // Handle undefined case
};


export const getPic=(users,loggedUser)=>
{
    if(users[0]._id===loggedUser._id
    )
    {
        console.log("pic:",users[1].profilePicture)
        return users[1].profilePicture
    }
    else
    {
        console.log("pic:",users[0].profilePicture)
        return users[0].profilePicture
    }
}
export const isSameSender = (messages, m, i, userId) => {
    return (
      i > 0 && // Make sure we are not on the first message
      messages[i - 1].sender._id !== m.sender._id && // Check if the previous message is from a different sender
      m.sender._id !== userId // And make sure this message is not from the user
    );
  };
  

export const isLastMessage = (messages, index, userId) => {
    return (
      index === messages.length - 1 && // It must be the last message in the list
      messages[index].sender._id === userId // It must be sent by the current user
    );
  };
  