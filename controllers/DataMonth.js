import Month from "../modoles/DataMonth";
import _ from "lodash";
const cloudinary = require("cloudinary").v2;

export const create = async (req, res) => {
  const newData = {
    month: req.body.name,
    data: JSON.stringify(req.body.data),
  };
  console.log(newData, "newData");
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
    const { _id } = req.body;
    await Month.findByIdAndRemove(_id);
    Month.find((err, data) => {
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
  const { _id, data } = req.body;
  try {
    await Month.updateMany(
      {
        _id: { $in: _id },
      },
      {
        $set: {
          data: JSON.stringify(data),
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
        message: "Sửa thành công",
        data: data,
        status: true,
      });
    });
  } catch (err) {
    return res.json({
      message: "Lỗi không thêm được !",
      status: false,
      data: undefined,
    });
  }
};
