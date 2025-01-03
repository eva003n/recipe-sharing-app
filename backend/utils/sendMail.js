import {generateKey} from "crypto"
function sendVerificationCode (email) {
    generateKey("hmac", {length: 3}, (err, key) => {
        console.log(key.export().toString("hex"));
    })
    

}