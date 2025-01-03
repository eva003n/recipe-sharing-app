import  bcrypt from "bcryptjs";
import {createHmac} from "crypto"
export async function doHash(value, saltValue) {
    const result =  bcrypt.hash(value, saltValue);
    return result;
}

 //coma[pre the user password with the one stored iun db
export async function doHashValidation(value, hashedValue) {
    const result = bcrypt.compare(value, hashedValue);
    
    return result;
    
}

//node js hashing

export const hMacProcess = (value, key) => {
    const result = createHmac("sha256", key).update(value).digest("hex");

    return result;

}
