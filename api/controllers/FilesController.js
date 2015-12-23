/**
 * Upload File
 *
 * (POST /file/upload)
 */
module.exports = {

    upload: function(req, res) {
        req.file('uploadFile').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            // Save the "fd" and the url where the File for a user can be accessed
            Files.create(req.session.me, {
                    // Generate a unique URL where the File can be downloaded.
                    fileUrl: require('util').format('%s/user/file/%s', sails.getBaseUrl(), req.session.me),

                    // Grab the first file and use it's `fd` (file descriptor)
                    fileFd: uploadedFiles[0].fd,
                    size: uploadedFiles[0].size,
                    fileName: uploadedFiles[0].filename,
                    type: uploadedFiles[0].type
                })
                .exec(function(err) {
                    if(err) console.log(err);
                    if (err) return res.negotiate(err);
                    return res.ok();
                });
        });
    },

    /**
     * Download File of the user with the specified id
     *
     * (GET /file/storage/:id)
     */
    Storage: function(req, res) {

        req.validate({
            id: 'string'
        });

        Files.findOne(req.param('id')).exec(function(err, user) {
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();

            // User has no File image uploaded.
            // (should have never have hit this endpoint and used the default image)
            if (!user.FileFd) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk( /* optional opts */ );

            // Stream the file down
            fileAdapter.read(user.FileFd)
                .on('error', function(err) {
                    return res.serverError(err);
                })
                .pipe(res);
        });
    }
}
