import busMessage from './error'

export const responseFilter = (res, callback) => {
  const msgCode = Number(res['msgCode']);
  const {message, busCode, code} = res;

  if (msgCode === 402) {
    // 如果在登录页面就不弹这个提示
    if (typeof location !== 'undefined' && location.pathname !== '/login') {
      return callback(message);
    }
  } else if (msgCode === 500 || msgCode === 501) {
    return message || busMessage[busCode] || "未知错误";
  } else if (msgCode === 400 || msgCode === 404) {
    return message;
  } else if (code === 2) {
    console.log('browser error:', res);
    return msgToZh(message);
  }
  return true
};

// 临时处理改中文提示
function msgToZh(resMessage) {
  resMessage = resMessage || '';
  switch (resMessage.toLowerCase()) {
    case 'failed to fetch': // chrome
    case 'network request failed': // IE
    case 'type error': // safari
    case 'networkerror when attempting to fetch resource.': // firefox
      resMessage = '网络开小差了，请检查联网情况';
      break;
    default:
      break;
  }
  return resMessage;
}
