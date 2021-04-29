const handleResponse = ( res, code, body ) => {
  res.status(code);
  return res.json(body);
};

const handleSuccessResponse = (data, res, code) => {
  const responseBody = { data };
  const statusCode = code || 200;
  return handleResponse(res, statusCode, responseBody);
};

const handleErrorResponse = (res, error, code) => {
  const status = code || 500;
  const detail = error.message || 'Internal server error';
  const responseBody = {
    errors: [{
      status,
      detail,
    }],
  };
  return handleResponse(res, status, responseBody);
};

const throwCustomException = (message) => {
  throw new Error(message || 'Internal server error');
};

module.exports = {
  handleSuccessResponse,
  handleErrorResponse,
  throwCustomException
};

