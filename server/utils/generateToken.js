const generateToken = (res, userId, getSignedJwtToken) => {
    const token = getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.cookie('token', token, options);
    return token;
};

export default generateToken;
