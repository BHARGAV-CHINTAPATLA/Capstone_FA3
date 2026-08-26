const UserModel = require('../models/User.model');
const { signToken } = require('../utilities/jwt');
const { OAuth2Client } = require('google-auth-library');
const https = require('https');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getFacebookJson = (url) => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    let body = '';
    response.on('data', (chunk) => { body += chunk; });
    response.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (response.statusCode >= 400 || data.error) reject(new Error('Facebook token verification failed'));
        else resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }).on('error', reject);
});

/**
 * Handle user registration business logic
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Created user Mongoose document
 */
const signupUser = async (email, password) => {
  const existingUser = await UserModel.findUserByEmail(email.toLowerCase());
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  return UserModel.createUser({ email, password });
};

/**
 * Handle user authentication business logic
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Object containing auth token
 */
const loginUser = async (email, password) => {
  const user = await UserModel.findUserByEmailWithPassword(email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);
  return { token };
};

/**
 * Verify a Google ID token and authenticate or create the matching user.
 * @param {string} credential Google Identity Services ID token
 * @returns {Promise<Object>} Object containing auth token
 */
const loginWithGoogle = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error('Google authentication is not configured');
    error.statusCode = 503;
    throw error;
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    payload = ticket.getPayload();
  } catch (verificationError) {
    const error = new Error('Invalid Google credential');
    error.statusCode = 401;
    throw error;
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    const error = new Error('Google account email could not be verified');
    error.statusCode = 401;
    throw error;
  }

  let user = await UserModel.findUserByGoogleId(payload.sub);
  if (!user) {
    user = await UserModel.findUserByEmail(payload.email.toLowerCase());
  }
  if (!user) {
    user = await UserModel.createUser({
      email: payload.email,
      googleId: payload.sub
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await UserModel.saveUser(user);
  }

  return { token: signToken(user._id) };
};

const loginWithFacebook = async (accessToken) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    const error = new Error('Facebook authentication is not configured');
    error.statusCode = 503;
    throw error;
  }

  try {
    const appAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const debugUrl = new URL('https://graph.facebook.com/debug_token');
    debugUrl.searchParams.set('input_token', accessToken);
    debugUrl.searchParams.set('access_token', appAccessToken);
    const debugResult = await getFacebookJson(debugUrl);
    const tokenData = debugResult.data;

    if (!tokenData?.is_valid || tokenData.app_id !== process.env.FACEBOOK_APP_ID) {
      throw new Error('Invalid Facebook access token');
    }

    const userInfoUrl = new URL(`https://graph.facebook.com/${encodeURIComponent(tokenData.user_id)}`);
    userInfoUrl.searchParams.set('fields', 'id,email');
    userInfoUrl.searchParams.set('access_token', accessToken);
    const profile = await getFacebookJson(userInfoUrl);
    if (!profile.email) throw new Error('Facebook did not provide a verified email');

    let user = await UserModel.findUserByFacebookId(profile.id);
    if (!user) user = await UserModel.findUserByEmail(profile.email.toLowerCase());
    if (!user) {
      user = await UserModel.createUser({ email: profile.email, facebookId: profile.id });
    } else if (!user.facebookId) {
      user.facebookId = profile.id;
      await UserModel.saveUser(user);
    }

    return { token: signToken(user._id) };
  } catch (verificationError) {
    const error = new Error(verificationError.message === 'Facebook did not provide a verified email'
      ? verificationError.message
      : 'Invalid Facebook credential');
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  signupUser,
  loginUser,
  loginWithGoogle,
  loginWithFacebook
};
