import throwHttpErrors from 'throw-http-errors';

const isCustomError = (error: any): boolean => {
  if (Object.keys(throwHttpErrors).includes(error.name) || (error.status && Object.keys(throwHttpErrors).includes(error.status.toString()))) {
    return true;
  }
  return false;
};

export default Object.assign(
  {},
  throwHttpErrors,
  {
    isCustomError,
  },
);
