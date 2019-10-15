/**
 * 加密存入localstorage的算法
 */
import {encrypt, decrypt, sign} from './cryptoJs/utilLib';

const defaultOptions = {
  storage: localStorage,
  prefix: Math.random().toString(16).slice(2, 6),
  expires: 0,
}

function Storage(options) {
  const {storage, prefix, expires} = Object.assign({}, defaultOptions, options);
  this.stg = storage;
  this.prefix = prefix;
  this.expires = expires;
}

const P = Storage.prototype;
/**
 * key,value,expires,secret
 * */
P.set = function (key, value, config = {}) {
  const {secret} = config;
  const expires = config.expires === 'undefined' ? this.expires : (+config.expires || 0);
  const valStr = JSON.stringify(value);
  const data = {expires: expires ? (Date.now() + expires) : 0};
  if (secret) {
    data.value = encrypt(valStr);
    data.secret = true;
  } else {
    data.value = value;
  }
  data.signature = sign(JSON.stringify(data.value) + data.expires);

  this.stg.setItem(`@${this.prefix}/${key}`, JSON.stringify(data));
}

P.get = function (key) {
  const _val = this.stg.getItem(`@${this.prefix}/${key}`);
  if (_val === null) {
    return null;
  } else {
    const {expires, secret, signature, value} = JSON.parse(_val);
    // 校验sign
    if (sign(JSON.stringify(value) + expires) !== signature) {
      return null;
    } else {
      if (expires !== 0 && Date.now() > expires) {
        this.remove(key);
        return null;
      }
      return secret ? JSON.parse(decrypt(value)) : value;
    }
  }
}

P.remove = function (key) {
  this.stg.removeItem(`@${this.prefix}/${key}`);
}

P.keys = function () {
  const keys = [];
  const regexp = new RegExp(`^@${this.prefix}/`);
  for (let i = 0, len = this.stg.length; i < len; i++) {
    const key = this.stg.key(i);
    regexp.test(key) && keys.push(key.replace(regexp, ''));
  }
  return keys;
}

P.clear = function () {
  const keys = this.keys();
  keys.forEach(key => this.remove(key));
}

Object.defineProperties(P, {
  'length': {
    get: function () {
      return this.keys().length;
    },
    set(v) {
    }
  }
})

export default Storage;