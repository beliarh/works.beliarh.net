import moment from 'moment';

export const random = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const getRandomChar = ({ chars, additionalChars, excludedChars } = {}) => {
  chars = chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  additionalChars = additionalChars || '';
  excludedChars = excludedChars || '';

  const charsArray = [...chars, ...additionalChars].filter(char => excludedChars.indexOf(char) === -1);

  return charsArray.length ? charsArray[random(0, chars.length - 1)] : '';
};

export const getRandomString = ({
  chars,
  additionalChars,
  excludedChars,
  prefix = '',
  suffix = '',
  minLength = 5,
  maxLength = 10,
  excludedStrings = [],
} = {}) => {
  let string;

  do {
    const length = random(minLength, maxLength);
    const randomChars = [];

    for (let i = 0; i < length; i++) {
      randomChars.push(
        getRandomChar({
          chars,
          additionalChars,
          excludedChars,
        })
      );
    }

    string = prefix + randomChars.join('') + suffix;
  } while (excludedStrings.includes(string));

  return string;
};

export const getRandomLogin = (excludedLogins = []) => {
  return getRandomString({
    prefix: 'user_',
    chars: '0123456789',
    minLength: 4,
    maxLength: 4,
    excludedStrings: excludedLogins,
  });
};

export const getRandomPassword = () => {
  return getRandomString({
    additionalChars: '$%^&*',
    excludedChars: 'oO0iIl1S5',
    minLength: 8,
    maxLength: 12,
  });
};

export const getRecordById = (records, id) => {
  return records.find(record => record.id === id);
};

export const getUrlsFromFileList = fileList => {
  return fileList.filter(file => file.status === 'done' && file.url).map(file => file.url);
};

export const formatDate = date => {
  return moment(date).format('YYYY-MM-DD');
};

export const isExpiredDate = date => {
  return moment(date)
    .endOf('day')
    .isBefore(moment.now());
};

export const isIE11 = () => {
  return !!window.MSInputMethodContext && !!document.documentMode;
};
