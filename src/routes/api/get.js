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

  try {
    //let { val } = req.query.expand;
    let expand = true;
    //if (val > 0) expand = true;
    const fragments = await Fragment.byUser(req.user, expand);

    logger.debug('Got fragments data');
    res.status(200).json(
      createSuccessResponse({
        fragment: fragments,
      })
    );
  } catch (e) {
    res.status(500).json(createErrorResponse(500, e));
  }
};
