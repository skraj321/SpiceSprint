import jwt from "jsonwebtoken";
const generateToken = ({ id, role }) => {
    try{
        const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '5h' });
        return token;

    }catch(err){
        console.error('Error generating token:', err);
        throw new Error('Token generation failed');
    }
}
export default generateToken;