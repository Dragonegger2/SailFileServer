/**
 * FilesController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    upload: function(req, res) {
        res.setTimeout(0);
        req.file('uploadFile')
            .upload({
                // You can apply a file upload limit (in bytes)
                maxBytes: 0
            }, function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.serverError(err);
                }

                console.log("File uploaded.");
                console.log(uploadedFiles);
                console.log(uploadedFiles[0].UploadedFileMetaData.filename);
                Files.create({
                    "name": uploadedFiles.filename,
                    "createdOn" : "test",
                    "size" : 120.00,
                    "fileType" : uploadedFiles.type
                }).exec(function createCB(err, created) {
                    console.log('Created error with name ' + err);
                    console.log('Created file entry with name ' + JSON.stringify(created));
                });

                return res.json({
                    status: 200
                });
            });
    }
};
