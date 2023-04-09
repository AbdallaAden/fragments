const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  const { id } = req.params;
  //logger.debug('Delete BY ID  SECTION');
  //logger.info(id + ' ' + req.user);
  try {
    const fragments = await Fragment.byId(req.user, id);
    logger.debug('Got fragments data, deleting now ');
    if (fragments) {
      await Fragment.delete(fragments.ownerId, fragments.id);

      res.status(200).json(createSuccessResponse());
    } else res.status(404).json(createErrorResponse(404, 'No fragment with that Id found'));
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
