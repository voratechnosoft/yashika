const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vGroupId, vGroupName, arrUserId, vGroupLinkImage = "" },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vGroupId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("GroupModel", condition, {
      _id: 1,
      vGroupImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let groupUrlImage = vGroupLinkImage;
    if (Object.keys(file).length > 0) {
      groupUrlImage = "image/group/" + file?.filename;
    }

    let updateData = {
      vGroupName,
      arrUserId,
      vGroupImage: groupUrlImage ? groupUrlImage : checkData?.vGroupImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "GroupModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vGroupName: updateResponse?.vGroupName,
      arrUserId: updateResponse?.arrUserId,
      vGroupImage: updateResponse?.vGroupImage,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
