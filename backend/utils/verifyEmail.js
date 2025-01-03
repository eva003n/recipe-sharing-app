async function verifyEmail(providedEmail, storedEmail) {
    if(providedEmail === storedEmail) {
        return true;
    }    
}
export default verifyEmail;