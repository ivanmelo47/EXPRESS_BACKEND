// Manejo de respuestas exitosas
exports.handleSuccess = (res, data = null, msg = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
      validation: true,
      status: true,
      msg: msg,
      data: data
    });
  };
  
  // Manejo de errores
  exports.handleError = (res, msg = 'Error en la operación', error, statusCode = 500) => {
    console.error(error);
    return res.status(statusCode).json({
      validation: false,
      status: false,
      msg: msg,
      error: error
    });
  };
  
  // Manejo de respuesta de "no encontrado"
  exports.notFoundResponse = (res, msg = 'Recurso no encontrado') => {
    return res.status(404).json({
      validation: true,
      status: false,
      msg: msg
    });
  };

  // Manejo de respuesta Personalizado
  exports.respuestaPersonalizada = (res = null, _msg = null, _validation = null, _status = null, error = null, statusCode = null) => {
    return res.status(statusCode).json({
      validation: _validation,
      status: _status,
      msg: _msg
    });
  };
  