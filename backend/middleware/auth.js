import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

const JWT_SECRET = process.env.JWT_SECRET;

export default (req, res, next) => {

    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ msg: 'Pääsy evätty. Token puuttuu.' });
    }

    const token = authHeader.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ msg: 'Pääsy evätty. Token ei ole oikeassa muodossa.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.userId = decoded.userId; 
        
        next(); 
    } catch (e) {
        console.error('JWT varmennus epäonnistui:', e.message);
        res.status(401).json({ msg: 'Token ei ole kelvollinen tai vanhentunut.' });
    }
};