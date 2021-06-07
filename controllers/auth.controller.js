const pool = require("../database/mysql.database");
const { signupValidation } = require("../common/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const profileTypeModel = require("../models/profileType.model");
const accountTypeModel = require("../models/accountType.model");
const statusModel = require("../models/status.model");
const profileModel = require("../models/profile.model");
const imageModel = require("../models/image.model");
const accountModel = require("../models/account.model");
module.exports.signup = async (req, res) => {
  try {
    const bodyValidation = signupValidation({
      ...JSON.parse(req.body.content),
      avatar: req.body.image,
    });
    if (bodyValidation.error) {
      throw new Error(bodyValidation.error.details[0].message);
    }

    const existsProfile = await new profileModel().findByEmail(
      bodyValidation.value.email
    );
    if (existsProfile && existsProfile.length) {
      console.log(existsProfile);
      throw new Error("existsProfile");
    } else {
      if (
        bodyValidation.value.fullName &&
        bodyValidation.value.email &&
        bodyValidation.value.profileType &&
        bodyValidation.value.accountType &&
        bodyValidation.value.status
      ) {
        let saveImage = null;
        if (bodyValidation.value.avatar) {
          const newImage = new imageModel(bodyValidation.value.avatar);
          saveImage = await newImage.create(newImage);
        }

        const [profileTypeCode, statusCode, accountTypeCode] =
          await Promise.all([
            (async () => {
              const profileTypeCode = await profileTypeModel.findByName(
                bodyValidation.value.profileType
              );
              if (profileTypeCode && profileTypeCode.length) {
                return profileTypeCode[0].profile_type_id;
              } else {
                throw new Error(
                  "Something in your profile type does not match"
                );
              }
            })(),
            (async () => {
              const statusCode = await statusModel.findByName(
                bodyValidation.value.status
              );
              if (statusCode && statusCode.length) {
                return statusCode[0].status_id;
              } else {
                throw new Error(
                  "Something in your profile status does not match"
                );
              }
            })(),
            (async () => {
              const accountTypeCode = await accountTypeModel.findByName(
                bodyValidation.value.accountType
              );
              if (accountTypeCode && accountTypeCode.length) {
                return accountTypeCode[0].account_type_id;
              } else {
                throw new Error(
                  "Something in your account type does not match"
                );
              }
            })(),
          ]);

        const newProfile = new profileModel({
          fullName: bodyValidation.value.fullName,
          email: bodyValidation.value.email,
          avatar: saveImage ? saveImage.image_id : null,
          youtubeAccount: bodyValidation.value.youtubeAccount,
          type: profileTypeCode,
          status: statusCode,
          createdAt: bodyValidation.value.createdAt,
          updatedAt: bodyValidation.value.updatedAt,
        });
        const saveProfile = await newProfile.create(newProfile);

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(
          bodyValidation.value.password,
          salt
        );
        const newAccount = new accountModel({
          email: bodyValidation.value.email,
          password: hashPassword,
          type: accountTypeCode,
          profile: saveProfile.profile_id,
          createdAt: bodyValidation.value.createdAt,
          updatedAt: bodyValidation.value.updatedAt,
        });
        const saveAccount = await newAccount.create();
        console.log(saveAccount);
      } else {
        throw new Error("Something in your profile is not valid");
      }
    }
    const token = jwt.sign({ _id: "asdhagsdjhkg" }, process.env.TOKEN_SECURE, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    let b = 123;
    return res
      .set("Authorization", `Bearer ${token}`)
      .status(200)
      .send("asjkdh");
  } catch (error) {
    console.log(b);
    // return res
    //   .status(400)
    //   .send({ message: error.message || "Something has been error..." });
  }
};
