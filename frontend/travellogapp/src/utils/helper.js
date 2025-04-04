import tempLogo from '../assets/images/travellogico.png'
import NO_LOGS_FOUND from '../assets/images/NoLogsFound.png'
import ADD_LOG_IMG from '../assets/images/ADD_LOG_IMG.png'

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i = 0; i < Math.min(words.length, 2); i++){
        initials += words[i][0];
    }

    return initials.toUpperCase();

};

export const getEmptyCardMessage = (filterType) => {
    switch(filterType){
        case "search":
            return `Oops! no stories found matching your search.`;
        case "date":
            return `No logs found in the given date range`;
        default:
            return ``;
    }
};

export const getEmptyCardImg = (filterType) => {
    switch(filterType){
        case "search":
            return NO_LOGS_FOUND;
        case "date":
            return NO_LOGS_FOUND;
        default:
            return ADD_LOG_IMG;
    }
};