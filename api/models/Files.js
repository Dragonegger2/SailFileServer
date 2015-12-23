/**
 * Files.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        createdOn: {
            type: 'string',
            required: true
        },
        size: {
        	type:'float',
        	required:true
        },
        fileType: {
        	type: 'string',
        	required:true
        }

    }
};
