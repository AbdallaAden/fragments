// src/routes/api/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

//logger.debug('MADE IT TO POST JS');
module.exports = async (req, res) => {
  const api = process.env.API_URL || 'http://localhost:8080';

  const user = req.user;
  const contentType = req.headers['content-type'];

  logger.debug(user, 'POST request user');
  //logger.info(Fragment.type, +' fragment type in post.js');
  if (!Fragment.isSupportedType(contentType)) {
    logger.error(`${contentType} is not supported Content Type`);
    res.json(createErrorResponse(415, `${contentType} is not supported Content Type`));
  } else {
    try {
      //const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });

      const fragment = new Fragment({
        ownerId: user,
        type: contentType,
        size: Buffer.byteLength(req.body),
      });
      await fragment.save();
      await fragment.setData(req.body);

      logger.debug({ fragment }, 'New fragment created');

      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
      res.status(201).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
    } catch (e) {
      res.status(415).json(createErrorResponse(500, e.message));
      logger.warn(e.message, 'Error posting fragment');
    }
  }
};
