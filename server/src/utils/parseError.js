module.exports = (error) => {
  if (!error) {
    return { message: '' };
  }

  const friendlyError = typeof error !== 'object' ? {
    message: error,
  } : {
    ...error,
  };

  if (error.name && typeof error.name === 'string') {
    friendlyError.name = error.name;
  }
  if (error.message && typeof error.message === 'string') {
    friendlyError.message = error.message;
  }
  if (error.stack && typeof error.stack === 'string') {
    friendlyError.stackString = error.stack;
    friendlyError.stack = friendlyError.stackString.split(/\s*\n\s*/g).slice(1);
  }
  return friendlyError;
};
