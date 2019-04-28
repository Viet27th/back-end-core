const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKEY = fs.readFileSync('./public.key', 'utf8');
const privateKEY = fs.readFileSync('./private.key', 'utf8');

module.exports = {
  /**
   * Refer: https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
   * Payload config: https://tools.ietf.org/html/rfc7519#section-4.1
   * @param {Object} payload
   * @param {Object} options
   * @returns {*}
   */
  sign: (payload, options = {}) => {
    let signOptions = {
      issuer:  'Xuan Dieu',
      subject:  '@dieu.me',
      audience: 'Client_Identity', // this should be provided by client
      // expiresIn:  10,    // 10s. If it's empty, token never expired.
      algorithm:  'RS256'
    };
    
    signOptions = {...signOptions,...options};
    
    try {
      return jwt.sign(payload, privateKEY, signOptions);
    } catch (error) {
      console.log('Sign Error, whether Private/public key pair error or another? :',error);
      throw error;
    }
  },
  
  /**
   *
   * @param token
   * @returns {*}
   */
  verify: (token) => {
    const verifyOptions = {
      algorithm:  ['RS256'], // verify alg mismatch.
      ignoreExpiration: false // verify validate the expiration of the token.
    };
  
    try{
      return jwt.verify(token, publicKEY, verifyOptions);
    }catch (error){
      console.log('Our Verify Err:', error);
      throw error;
    }
  },
  
  /**
   * Returns the decoded payload without verifying if the signature is valid.
   * @param {String} token
   * @returns {*}
   */
  decode: (token) => {
    return jwt.decode(token, {complete: true});
  }
  
};
