const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const Messages = require('../../db/models/Messages');

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Messages.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, id));
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteMessage };

