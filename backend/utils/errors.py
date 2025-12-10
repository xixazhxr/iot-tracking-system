class AppError(Exception):
    def __init__(self, message, status_code=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors

    def to_dict(self):
        rv = dict(self.errors or ())
        rv['message'] = self.message
        rv['error'] = self.__class__.__name__
        return rv

class NotFoundError(AppError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, 404)

class ValidationError(AppError):
    def __init__(self, message="Validation error", errors=None):
        super().__init__(message, 400, errors)
