const cookie = require('vue-cookie')


export const checkLogin = (req) => {
  if (!!getCookies(tokenKey, req) && getCookies('userLoginNo', req)) {
    return getCookies('userLoginNo', req)
  } else {
    return null;
  }
}

export const setCookies = (key, value, res) => {
  if (typeof window !== 'undefined') {
    return cookie.set(key, value)
  } else if (res) {
    res.cookie(key, value)
  }

}

export const getCookies = (key, req) => {
  if (typeof window !== 'undefined') {
    return cookie.get(key)
  } else if (req) {
    return req.cookies[key]
  }
}

export const deleteCookies = (key, options) => {
  if (typeof window !== 'undefined') {
    return cookie.delete(key);
  }
}
