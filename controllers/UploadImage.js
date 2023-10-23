import Uploadimage from "../modoles/UploadImage";
const cloudinary = require("cloudinary").v2;
import _ from "lodash";
export const create = async (req, res) => {
  const fileIds = [];
  console.log(req.files.length, 'req.files')
  function uploadFile(fileMetadata, media) {
    console.log(fileMetadata, 'fileMetadata', media)
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileMetadata,
        { folder: "upload_image" },
        async function (error, result) {
          console.log(result, 'result')
          if (error) {
            Uploadimage.find((err, data) => {
              if (err) {
                return res.json({
                  message: "Không tìm thấy ảnh",
                  data: "data",
                  status: false,
                });
              }
              return res.json({
                message: "Bình luân không thành công",
                data: data,
                status: false,
              });
            });
          } else {
            console.log(result, 'result')
            resolve({
              image_id: result.public_id,
              photo: result.url,
            }); // Trả về ID file
          }
        }
      );
    });
  }
  for (let i = 0; i < req.files.length; i++) {
    try {
      console.log(req.files[i].path, 'req.files[i]')
      const fileId = await uploadFile(req.files[i].path);
      console.log(fileId, 'fileId')
      fileIds.push(fileId); // Thêm ID file vào mảng
    } catch (err) {
      Uploadimage.find((err, data) => {
        if (err) {
          return res.json({
            message: "Không tìm thấy ảnh",
            data: "data",
            status: 1,
          });
        }
        return res.json({
          message: "Không thêm được ảnh. Xin thử lại !",
          data: data,
          status: 1,
        });
      });
    }
  }
  if (fileIds.length > 0) {
    console.log(fileIds.length, 'fileIds.length')
    try {
      const newComment = {
        photo: JSON.stringify(fileIds),
      };

      await Uploadimage.create(newComment);
      Uploadimage.find((err, data) => {
        if (err) {
          return res.json({
            message: "Không tìm thấy ảnh",
            data: "data",
            status: true,
          });
        }
        return res.json({
          message: "Lấy dữ liệu thành công",
          data: data,
          status: true,
        });
      });
    } catch (error) {
      return res.json({
        message: "Lấy dữ liệu không thành công",
        data: [],
        status: true,
      });
    }
  }
};

export const Id = (req, res, next, id) => {
  Comments.findById(id).exec((err, comment) => {
    if (err || !comment) {
      res.status(400).json({
        error: "Không tìm thấy comments",
      });
    }
    req.comment = comment;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.comment);
};

export const remove = async (req, res) => {
  try {
    if (req.body.photo.length > 0) {
      for (let i = 0; i < req.body.photo.length; i++) {
        cloudinary.uploader.destroy(req.body.photo[i].image_id);
      }
    }

    await Comments.findByIdAndRemove(req.body._id);
    Comments.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không có dữ liệu",
          data: [],
          status: false,
        });
      }
      return res.json({
        message: "Tải dữ liệu thành công",
        data: data,
        status: true,
      });
    });
  } catch (erorr) {
    return res.json({
      message: "Xóa thất bại !",
      status: false,
    });
  }
};

export const listAllImage = (req, res) => {
  Uploadimage.find((err, data) => {
    if (err) {
      return res.json({
        message: "Không tìm thấy ảnh",
        data: "data",
        status: 1,
      });
    }
    return res.json({
      message: "Lấy dữ liệu thành công",
      data: data,
      status: 1,
    });
  });
};

export const update = async (req, res) => {
  const { _id, value, image } = req.body
  const originalImage = []
  const removeImage = []
  JSON.parse(image).map(item => {
    if (item.check == 1) {
      originalImage.push({ image_id: item.image_id, photo: item.photo })
    } else if (item.check = 'remove' && item.photo !== undefined) {
      removeImage.push({ image_id: item.image_id, photo: item.photo })

    }
  })
  const fileIds = [];
  if (req.files.length > 0) {
    function uploadFile(fileMetadata, media) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          fileMetadata,
          { folder: "products" },
          async function (error, result) {
            if (error) {
              Comments.find((err, data) => {
                if (err) {
                  return res.json({
                    message: "Không tìm thấy bình luận",
                    data: "data",
                    status: false,
                  });
                }
                return res.json({
                  message: "Bình luân không thành công",
                  data: data,
                  status: false,
                });
              });
            } else {
              resolve({
                image_id: result.public_id,
                photo: result.url,
              }); // Trả về ID file
            }
          }
        );
      });
    }
    for (let i = 0; i < req.files.length; i++) {
      try {
        const fileId = await uploadFile(req.files[i].path);
        fileIds.push(fileId); // Thêm ID file vào mảng
      } catch (err) {
        Comments.find((err, data) => {
          if (err) {
            return res.json({
              message: "Không tìm thấy bình luận",
              data: "data",
              status: 1,
            });
          }
          return res.json({
            message: "Không thêm được ảnh. Xin thử lại !",
            data: data,
            status: 1,
          });
        });
      }
    }
  }
  if (req.files.length > 0 ? fileIds.length > 0 : (fileIds.length > 0 || value)) {
    if (removeImage.length > 0) {
      for (let i = 0; i < removeImage.length; i++) {
        cloudinary.uploader.destroy(removeImage[i].image_id);
      }
    }
    const newImage = [...originalImage, ...fileIds]
    try {
      await Comments.updateMany(
        {
          _id: { $in: _id },
        },
        {
          $set: {
            comment: value,
            photo: newImage
          },
        }
      );
      Comments.find((err, data) => {
        if (err) {
          return res.json({
            message: "Không tìm thấy bình luận",
            data: "data",
            status: true,
          });
        }
        return res.json({
          message: "Lấy dữ liệu thành công",
          data: data,
          status: true,
        });
      });
    } catch (error) {
      return res.json({
        message: "Lấy dữ liệu không thành công",
        data: [],
        status: true,
      });
    }
  }
};
