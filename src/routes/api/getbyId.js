const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const path = require('node:path');

module.exports = async (req, res) => {
  //logger.info('id name: ' + req.params.id.split('.')[0]);
  const id = req.params.id.split('.')[0];
  const extension = path.extname(req.params.id);
  //logger.debug('GET BY ID SECTION EXT ' + extension);
  //logger.info(id + ' ' + req.user);

  try {
    let valid = false; ////////////////////////////TEST THIS IN THE MORNING
    const fragments = new Fragment(await Fragment.byId(req.user, id));
    if (extension.length > 0 && Fragment.extType(extension) === '') {
      res
        .status(415)
        .json(
          createErrorResponse(
            415,
            `a ${fragments.type} fragment cannot be returned as a ${extension}`
          )
        );
    }

    const fragData = await fragments.getData();
    let displayData = fragData.toString();

    if (extension === '.html') {
      valid = true;
      var type = Fragment.extType(extension);
      var newFrag = await fragments.convertFrag(fragData, type);
      displayData = newFrag; /*.toString();*/
      fragments.size = displayData.length;
      logger.debug(newFrag, ' new frag data');
      //logger.debug(newFrag.size, ' DISPLAY DATA');

      //logger.debug(fragments.size, ' DISPLAY DATA Size');
    }

    //const st = 'HTTP/1.1 200 OK';
    logger.debug('Got fragments data ');

    //res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
    if (valid) {
      res.setHeader('Content-type', type);
      //res.setHeader('Content-Length', newFrag.size);
      res.status(200).send(newFrag);
    } else {
      res.setHeader('Content-type', fragments.type);
      res.status(200).send(fragData);
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
