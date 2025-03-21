import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
	const token = req.headers['x-auth-token']; // Get token from header

	if (!token) {
		return res.status(401).json({ message: 'No token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach decoded user info to request object
		next();
	} catch (err) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

export default verifyToken;