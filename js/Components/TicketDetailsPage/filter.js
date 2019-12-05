
export const findState = (user1, item, users, ticketComments, index) => {
    try {
        let commentedUser = users.find(user => user.userId == item.userId2);
         //Ticket #202 - Mobile App will crash if a PU feed has been commented by SU1 and hereafter viewed by SU2
        if(typeof commentedUser == 'undefined')
          commentedUser = {"userDetailsId":0,"userId":0,"tenantId":1,"firstName":"-","lastName":"-","userProfilePic":"default.jpg","userType":"Technician","userState":"AVAIL","location":"Los Angeles,CA","lastActiveDatetime":1548938600300};
        switch (item.ticketState) {
            case "TCR":
                return user1 + " created ticket and assigned to " + commentedUser.firstName;
                break;
            case "TA":
                return user1 + " assigned ticket to " + commentedUser.firstName;
                break;
            case "TF":
                return user1 + " provided feedback";
                break;
            case "TC":
                return user1 + " closed the ticket";
                break;
            case "CM":
                // let comment = ticketComments.find(comment => {
                //     comment.commentId.updatedAt == item.ticketDate
                // });
                return ticketComments[index - 1].comment;
                break;
            case "TO":
                return user1 + " reopened the ticket";
                break;
            default:
                return ""
                break;
        }
    }
    catch (e) {
        console.log("findState Error", e)
        return [];
    }
}


export const sortFeedBackHstory = (feedbackHistory) => {
    try {
        let arrayList = [];
        feedbackHistory.forEach(element => {
            arrayList.push(element);
        });
        return arrayList.sort(custom_sortCheckupTime).reverse();
    }
    catch (e) {
        console.log("sortFeedBackHstory Error", e)
        return [];
    }
}

function custom_sort(a, b) {
    return new Date(a.commentId.updatedAt).getTime() - new Date(b.commentId.updatedAt).getTime();
}

function custom_sortCheckupTime(a, b) {
    return new Date(a.checkupTime).getTime() - new Date(b.checkupTime).getTime();
}