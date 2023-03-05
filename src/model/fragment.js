// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const validTypes = [
  'text/plain',
  'text/plain; charset=utf-8',
  `text/markdown`,
  `text/html`,

  /*Currently, only text/plain is supported. Others will be added later.
  
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,*/
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    //logger.info(size + ' size of fragment passed');
    if (!ownerId && !type) throw new Error('ownerId and type are required'); //throw Error
    if (!ownerId && type) throw new Error('ownerId is required');
    if (ownerId && !type) throw new Error('type is required');
    if (!Fragment.isSupportedType(type))
      throw new Error('common text types are supported, other types are not supported');
    if (typeof size !== 'number' || Number.isNaN(size)) throw new Error('size must be a number');
    if (size < 0) throw new Error('size cannot be negative');
    else {
      this.id = id ? id : randomUUID();
      this.ownerId = ownerId;
      this.created = created ? created : new Date().toISOString();
      this.updated = updated ? updated : new Date().toISOString();
      this.type = type;
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    logger.debug({ ownerId, expand }, 'byUser()');
    try {
      return listFragments(ownerId, expand);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const data = await readFragment(ownerId, id);

      if (data === undefined) {
        throw new Error('Fragment does not exist.');
      }

      //logger.debug({ data }, 'byId()');
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    if (ownerId && id) {
      try {
        return deleteFragment(ownerId, id);
      } catch (err) {
        throw new Error(err);
      }
    } else throw Error('Invalid data passed');
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    //logger.debug(this, 'save()');
    this.updated = new Date().toISOString();
    try {
      return writeFragment(this);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (!data) {
        throw Error('Data is missing');
      }

      if (!Buffer.isBuffer(data)) {
        throw Error('Data is not buffer');
      }

      // logger.debug({ data }, 'setData() data'); // Is lengthy for larger files

      this.size = Buffer.byteLength(data);
      logger.info(this.size + ' buffer size in setData()');
      this.updated = new Date().toISOString();
      await this.save();
      return writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.includes('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return ['text/plain']; //only type supported for now
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    logger.info(value + ' parameter passed');
    return Object.values(validTypes).includes(value);
    //return true;
  }
}

module.exports.Fragment = Fragment;
