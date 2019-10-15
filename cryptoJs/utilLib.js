import CryptoJS from './aes'

const SECRET_KEY = CryptoJS.enc.Utf8.parse("0123456789abcdef")
const IV = CryptoJS.enc.Utf8.parse("0123456789abcdef")


function encrypt(message){
    return CryptoJS.AES.encrypt(message,SECRET_KEY,{
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

function decrypt(sercet){
    return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(sercet,SECRET_KEY,{
        iv:IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }))
}
function sign(data){
    return CryptoJS.HmacSHA1(data,SECRET_KEY).toString().toUpperCase();
}

export {
    encrypt,
    decrypt,
    sign
}