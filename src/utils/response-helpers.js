const handleResponse = (res, code, body) => {
  res.status(code);
  return res.json(body);
};

const sendSuccessResponse = (data, res, code) => {
  const responseBody = { data };
  const statusCode = code || 200;
  return handleResponse(res, statusCode, responseBody);
};

const sendErrorResponse = (res, error, code) => {
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

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
