class BaseException extends Error {
  constructor(code, name, message) {
    super();
    this.name = name || 'BaseException';
    this.message = message || 'Base exception';
    this.code = code || 500;
  }
}

class NotImplementedException extends BaseException {
  constructor(message = 'Feature is not implemented') {
    super(501, 'NotImplemented', message);
  }
}

class AccessDeniedException extends BaseException {
  constructor(message) {
    super(403, 'AccessDenied', message);
  }
}

class UserNotFoundException extends BaseException {
  constructor(message = 'User not found') {
    super(404, 'UserNotFound', message);
  }
}

class UserAlreadyExistsException extends BaseException {
  constructor(message = 'User with such credentials already exists') {
    super(409, 'UserAlreadyExists', message);
  }
}

class WrongUserCredentialsException extends BaseException {
  constructor(message = 'Wrong credentials') {
    super(403, 'WrongUserCredentials', message);
  }
}

class UserEmailIsNotVerifiedException extends BaseException {
  constructor(message = 'User`s email is not verified') {
    super(403, 'UserIsNotVerified', message);
  }
}

class MissingUserIdException extends BaseException {
  constructor(message = 'User id is not provided') {
    super(400, 'MissingUserId', message);
  }
}

class WrongUserRoleSpecifiedException extends BaseException {
  constructor(message = 'Wrong user role specified') {
    super(400, 'WrongUserRoleSpecified', message);
  }
}

class InvalidUserDataException extends BaseException {
  constructor(message = 'Invalid user data') {
    super(400, 'InvalidUserData', message);
  }
}

class InvalidConfirmationCodeException extends BaseException {
  constructor(message = 'Specified confirmation code is invalid') {
    super(400, 'InvalidConfirmationCode', message);
  }
}

class RequestCallbackFailedException extends BaseException {
  constructor(message = 'Error while requesting callback url') {
    super(400, 'RequestCallbackFailed', message);
  }
}

class UserIsNotAuthorizedException extends BaseException {
  constructor(message = 'User is not authorized') {
    super(403, 'UserIsNotAuthorized', message);
  }
}

class JsonWebTokenDefaultException extends BaseException {
  constructor(message = 'JsonWebToken error') {
    super(400, 'JsonWebTokenDefaultError', message);
  }
}

class S3putBucketObjectException extends BaseException {
  constructor(message = 'Error while uploading to s3 bucket') {
    super(400, 's3putBucketObject', message);
  }
}

class VideoSizeIsTooLargeException extends BaseException {
  constructor(message = 'Video size is more than 5 GB') {
    super(409, 'VideoSizeIsTooLarge', message);
  }
}

class TransactionNotPassedException extends BaseException {
  constructor(message = 'Transaction failed') {
    super(409, 'TransactionNotPassed', message);
  }
}

class TwoFactorAuthenticationNotPassedException extends BaseException {
  constructor(message = 'Two Factor Authentication not passed') {
    super(403, 'TwoFactorAuthenticationNotPassed', message);
  }
}

class TwoFactorAuthenticationCodeIsInvalidException extends BaseException {
  constructor(message = 'Two Factor Authentication code is invalid') {
    super(403, 'TwoFactorAuthenticationCodeIsInvalid', message);
  }
}

module.exports = {
  AccessDeniedException,
  TransactionNotPassedException,
  UserNotFoundException,
  UserAlreadyExistsException,
  WrongUserCredentialsException,
  UserEmailIsNotVerifiedException,
  MissingUserIdException,
  WrongUserRoleSpecifiedException,
  InvalidUserDataException,
  InvalidConfirmationCodeException,
  RequestCallbackFailedException,
  UserIsNotAuthorizedException,
  JsonWebTokenDefaultException,
  S3putBucketObjectException,
  VideoSizeIsTooLargeException,
  NotImplementedException,
  TwoFactorAuthenticationNotPassedException,
  TwoFactorAuthenticationCodeIsInvalidException,
  BaseException
};
