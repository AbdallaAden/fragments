const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug('GET BY ID INFO SECTION');
  logger.info(id + ' ' + req.user);
  try {
    const fragments = await Fragment.byId(req.user, id);
    logger.debug('Got fragments data ');
    //res.setHeader('Content-type', 'text/plain');
    //res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
    res.status(200).json(
      createSuccessResponse({
        fragment: fragments,
      })
    );
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
