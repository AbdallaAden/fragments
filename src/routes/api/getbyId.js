const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const path = require('node:path');

module.exports = async (req, res) => {
  logger.info('id name: ' + req.params.id.split('.')[0]);
  const id = req.params.id.split('.')[0];
  const extension = path.extname(req.params.id);
  logger.debug('GET BY ID SECTION EXT ' + extension);
  logger.info(id + ' ' + req.user);
  try {
    const fragments = await Fragment.byId(req.user, id);
    const fragData = await fragments.getData();
    const displayData = fragData.toString();
    const st = 'HTTP/1.1 200 OK';
    logger.debug('Got fragments data ');
    res.setHeader('Content-type', fragments.type);
    //res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
    res
      .status(200)
      .send(
        st +
          '\nContent-type: ' +
          fragments.type +
          '\nContent-length: ' +
          fragments.size +
          '\n\n' +
          displayData
      );
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
