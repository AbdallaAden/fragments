// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  //logger.debug('req.query: ' + JSON.stringify(req.query));
  //logger.debug(req.user + ' get by User section');
  logger.debug(`req.query: ${JSON.stringify(req.query)}`);
  logger.debug('EXPAND ' + req.query.expand);
  try {
    let val = false;
    if (req.query.expand == 1) {
      val = true;
    }
    logger.debug('value of expand = ' + val);
    //logger.info(req.query.expand + 'value of expand');

    //let expand = true;
    //if (val > 0) expand = true;
    const fragment = await Fragment.byUser(req.user, val);

    logger.debug('Got fragments data');
    res.status(200).json(
      createSuccessResponse({
        fragments: fragment,
      })
    );
  } catch (e) {
    res.status(500).json(createErrorResponse(500, e));
  }
};
