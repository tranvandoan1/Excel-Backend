import Month from "../modoles/DataMonth";
import _ from "lodash";
const cloudinary = require("cloudinary").v2;

export const create = async (req, res) => {
  const newData = {
    month: 'Tháng 09',
    data: JSON.stringify(req.body)
  }
  await Month.create(newData);
  Month.find((err, data) => {
    if (err) {
      return res.json({
        message: "Lỗi !",
        status: false,
        data: undefined,
      });
    }
    return res.json({
      message: "Thêm thành công",
      data: data,
      status: true,
    });
  });
};

export const categoryById = (req, res, next, id) => {
  Month.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "Không tìm thấy Danh muc",
      });
    }
    req.category = category;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.category);
};

export const remove = async (req, res) => {
  try {
    const { _id, image_id } = req.body;
    cloudinary.uploader.destroy(image_id);
    await Month.findByIdAndRemove(_id);
    Month.find((err, data) => {
      if (err) {
        return res.json(
          {
            message: 'Không có dữ liệu',
            data: [],
            status: false
          }
        );
      }
      return res.json(
        {
          message: 'Tải dữ liệu thành công',
          data: data,
          status: true
        }
      );
    });
  } catch (erorr) {
    return res.json({
      message: "Xóa thất bại !",
      status: false,
    });
  }
};

export const list = (req, res) => {
  Month.find((error, data) => {
    if (error) {
      error: "Không tìm thấy Danh muc";
    }
    return res.json({
      message: "Tải dữ liệu thành công",
      data: data,
      status: true,
      getdata: true,
    });
  });
};

export const update = async (req, res) => {
  const { _id, name, image_id, files } = req.body;
  if (req.file == undefined) {
    try {
      await Month.updateMany(
        {
          _id: { $in: _id },
        },
        {
          $set:
          {
            name: name,
          }

        }
      );
      Month.find((err, data) => {
        if (err) {
          return res.json({
            message: "Lỗi !",
            status: false,
            data: undefined,
          });
        }
        return res.json({
          message: 'Sửa thành công',
          data: data,
          status: true
        });
      });

    } catch (err) {
      return res.json({
        message: "Lỗi không thêm được !",
        status: false,
        data: undefined,
      });
    }
  } else {
    cloudinary.uploader.destroy(image_id);
    cloudinary.uploader.upload(
      req.file.path,
      { folder: "categories" },
      async function (error, result) {
        if (error) {
          Month.find((err, data) => {
            if (err) {
              return res.json({
                message: "Lỗi !",
                status: false,
                data: undefined,
              });
            }
            return res.json({
              message: 'Lỗi xin thử lại',
              data: data,
              status: false
            });
          });
        } else {

          try {
            await Month.updateMany(
              {
                _id: { $in: _id },
              },
              {
                $set: req.file == undefined ?
                  {
                    name: name,
                  }
                  : {
                    name: name,
                    photo: result.url,
                    image_id: result.public_id,
                  },
              }
            );
            Month.find((err, data) => {
              if (err) {
                return res.json({
                  message: "Lỗi !",
                  status: false,
                  data: undefined,
                });
              }
              return res.json({
                message: 'Sửa thành công',
                data: data,
                status: true
              });
            });

          } catch (err) {
            return res.json({
              message: "Lỗi không thêm được !",
              status: false,
              data: undefined,
            });
          }
        }
      }
    );
  }



}