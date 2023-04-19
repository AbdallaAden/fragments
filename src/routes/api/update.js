const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  const { id } = req.params;
  const contentType = req.headers['content-type'];
  logger.debug('content type is: ', contentType);
  logger.debug('Update SECTION, id: ', id);
  //res.status(200).send('made it to put request section');
  logger.info(id + ' ' + req.user);
  try {
    const fragments = await Fragment.byId(req.user, id);
    if (!fragments) {
      res.status(404).json(createErrorResponse(404, 'could not find fragment with id: ', id));
    }

    logger.debug('Got fragments data ', req);

    logger.debug('req body: ', req.body);
    //res.setHeader('Content-type', 'text/plain');
    //res.setHeader('Location', api + '/v1/fragments/' + fragment.id);

    const newFrag = new Fragment({
      ownerId: req.user,
      id: id,
      created: fragments.created,
      type: contentType,
      //size: req.body.length,
    });
    await newFrag.save();
    await newFrag.setData(req.body);
    const fragData = await newFrag.getData();
    res.status(200).send(fragData);
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
