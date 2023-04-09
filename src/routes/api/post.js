// src/routes/api/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

//logger.debug('MADE IT TO POST JS');
module.exports = async (req, res) => {
  const api = process.env.API_URL || 'http://localhost:8080';
  const data = req.body;
  //const dataBuf = Buffer.from(data);
  const user = req.user;
  const contentType = req.headers['content-type'];

  //logger.debug(user, 'POST request user');
  //logger.info(contentType, +' fragment type in post.js');
  if (!Fragment.isSupportedType(contentType)) {
    logger.error(`${contentType} is not supported Content Type`);
    res.status(415).json(createErrorResponse(415, `${contentType} is not supported Content Type`));
  } else {
    try {
      //const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
      //console.log('\x1b[33m%s\x1b[0m', req.body);

      const fragment = new Fragment({
        ownerId: user,
        type: contentType,
        size: Buffer.byteLength(req.body),
      });
      await fragment.save();
      await fragment.setData(Buffer.from(data));
      const fragData = await fragment.getData();
      logger.info('FRAG DATA (' + fragData.toString() + ')');
      logger.info({ fragment }, 'New fragment created');

      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
      res.setHeader('Content-Length', fragment.size);

      //
      res.status(201).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
    } catch (e) {
      res.status(415).json(createErrorResponse(415, e.message));
      logger.warn(e.message, 'Error posting fragment');
    }
  }
};
