class ResponseHandler {
  static success(data) {
    return {
      success: true,
      data: data,
    };
  }

  static failure(message, code = null) {
    return {
      success: false,
      message: message,
      code: code,
    };
  }
}

module.exports = ResponseHandler;
