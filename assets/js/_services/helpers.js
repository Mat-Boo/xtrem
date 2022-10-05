import DOMPurify from 'dompurify';

const nl2br = (str, is_xhtml) => {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

const sanitizedData = (message) => ({
    __html: DOMPurify.sanitize(nl2br(message))
})

const replaceAccent = (text) => {
    if (text.includes('é')) {
        text = text.replace('é', 'e');
    }
    if (text.includes('è')) {
        text = text.replace('è', 'e');
    }
    if (text.includes('ê')) {
        text = text.replace('ê', 'e');
    }
    if (text.includes('ë')) {
        text = text.replace('ë', 'e');
    }
    if (text.includes('â')) {
        text = text.replace('â', 'a');
    }
    if (text.includes('à')) {
        text = text.replace('à', 'a');
    }
    if (text.includes('ä')) {
        text = text.replace('ä', 'a');
    }
    if (text.includes('ô')) {
        text = text.replace('ô', 'o');
    }
    if (text.includes('ö')) {
        text = text.replace('ö', 'o');
    }
    if (text.includes('û')) {
        text = text.replace('û', 'u');
    }
    if (text.includes('ù')) {
        text = text.replace('ù', 'u');
    }
    if (text.includes('ü')) {
        text = text.replace('ü', 'u');
    }
    if (text.includes('î')) {
        text = text.replace('î', 'i');
    }
    if (text.includes('ï')) {
        text = text.replace('ï', 'i');
    }
    if (text.includes('ç')) {
        text = text.replace('ç', 'c');
    }
    return text;
}

export const helpers = {
    sanitizedData, replaceAccent
};