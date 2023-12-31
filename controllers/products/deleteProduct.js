const { asyncHandler } = require('../../handlers/error');
const Products = require('../../db/models/Products');

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Products.findByIdAndDelete(id);
  if (!product) {
    return res
      .status(404)
      .json({
        message:
          req.t('NOT_FOUND', {
            field: id,
          }),
      });
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteProduct };

