const { OAuth2Client } = require("google-auth-library");
const {
  signupValidation,
  signinSystemValidation,
  signupSocialValidation,
  changePasswordValidation,
  changeProfileValidation,
  changeAvatarValidation,
} = require("../common/validation");
const { default: fetch } = require("node-fetch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const typeModel = require("../models/type.model");
const statusModel = require("../models/status.model");
const profileModel = require("../models/profile.model");
const imageModel = require("../models/image.model");
const accountModel = require("../models/account.model");
const { createError } = require("../common/createError");
const { sendMail, sendMailActive, sendMailForgetPassword } = require("../common/sendEmail");
const { downloadImage } = require("../common/downloadFile");

const client = new OAuth2Client(process.env.BACKEND_GOOGLE_CLIENT_ID);

//////////////////////////////////////////////////////////////////////////////////

module.exports.signupSystem = async (req, res, next) => {
  let saveImage = null;
  let saveProfile = null;
  let saveAccount = null;
  let token = null;
  try {
    const bodyValidation = signupValidation({
      ...JSON.parse(req.body.content),
      avatar: req.body.image,
    });
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    const [existsAccount] = await Promise.all([
      (async () => {
        //check exists account
        const existsAccount = await accountModel.findByEmail(
          bodyValidation.value.username
        );
        if (existsAccount && existsAccount.length) {
          return existsAccount[0];
        } else {
          return null;
        }
      })(),
    ]);

    if (existsAccount) {
      throw createError(401, "The email address is already !!!");
    }

    const [
      profileTypeCode,
      accountTypeCode,
      profileStatusCode,
      accountStatusCode,
      existsProfile,
    ] = await Promise.all([
      (async () => {
        const profileTypeCode = await typeModel.findByName(
          bodyValidation.value.profileType
        );
        if (profileTypeCode && profileTypeCode.length) {
          return profileTypeCode[0].typeId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const accountTypeCode = await typeModel.findByName(
          bodyValidation.value.accountType
        );
        if (accountTypeCode && accountTypeCode.length) {
          return accountTypeCode[0].typeId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const statusCode = await statusModel.findByName(
          bodyValidation.value.profileStatus
        );
        if (statusCode && statusCode.length) {
          return statusCode[0].statusId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const statusCode = await statusModel.findByName(
          bodyValidation.value.accountStatus
        );
        if (statusCode && statusCode.length) {
          return statusCode[0].statusId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        //check exists profile
        const existsProfile = await profileModel.findByEmail(
          bodyValidation.value.username
        );
        if (existsProfile && existsProfile.length) {
          return existsProfile[0];
        } else {
          return null;
        }
      })(),
      (async () => {
        if (bodyValidation.value.avatar) {
          //if create avatar
          const newImage = new imageModel(bodyValidation.value.avatar);
          saveImage = await imageModel.create(newImage);
        }
      })(),
    ]);

    //create hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(bodyValidation.value.password, salt);

    if (!existsProfile) {
      //create profile
      const newProfile = new profileModel({
        fullName: bodyValidation.value.fullName,
        email: bodyValidation.value.username,
        avatar: saveImage ? saveImage.imageId : null,
        youtubeAccount: bodyValidation.value.youtubeAccount,
        profileType: profileTypeCode,
        profileStatus: profileStatusCode,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });
      //save profile
      saveProfile = await profileModel.create(newProfile);

      //create account
      const newAccount = new accountModel({
        username: bodyValidation.value.username,
        password: hashPassword,
        accountType: accountTypeCode,
        accountStatus: accountStatusCode,
        profile: saveProfile.profileId,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });

      //save account
      saveAccount = await accountModel.create(newAccount);
    } else {
      //create account
      const newAccount = new accountModel({
        username: bodyValidation.value.username,
        password: hashPassword,
        accountType: accountTypeCode,
        accountStatus: accountStatusCode,
        profile: existsProfile.profileId,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });

      //save account
      saveAccount = await accountModel.create(newAccount);
    }

    token = jwt.sign(
      {
        accountId: saveAccount.accountId,
        accountType: saveAccount.accountType,
        profileId: saveAccount.profileId,
        profileType: saveAccount.profileType,
      },
      process.env.TOKEN_SECURE,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );

    const tokenActive = jwt.sign(
      {
        accountId: saveAccount.accountId,
      },
      process.env.TOKEN_SECURE,
      {
        expiresIn: process.env.TOKEN_ACTIVE_EXPIRATION,
      }
    );
    //send mail confirm
    sendMailActive(tokenActive, bodyValidation.value.username);

    return res
      .set("Authorization", `Bearer ${token}`)
      .status(200)
      .send({
        accountId: saveAccount.accountId,
        username: saveAccount.username,
        accountType: saveAccount.accountType,
        accountStatus: saveAccount.accountStatus,
        socialAuthorization: saveAccount.socialAuthorization,
        profileId: saveProfile
          ? saveProfile.profileId
          : existsProfile.profileId,
        email: saveProfile ? saveProfile.email : existsProfile.email,
        fullName: saveProfile ? saveProfile.fullName : existsProfile.fullName,
        profileType: saveProfile
          ? saveProfile.profileType
          : existsProfile.profileType,
        profileStatus: saveProfile
          ? saveProfile.profileStatus
          : existsProfile.profileStatus,
        avatarId: existsProfile
          ? existsProfile.avatar
          : saveImage
          ? saveImage.imageId
          : null,
        avatarPath: existsProfile
          ? existsProfile.avatarPath
          : saveImage
          ? saveImage.path
          : null,
        avatarAlt: existsProfile
          ? existsProfile.avatarAlt
          : saveImage
          ? saveImage.alt
          : null,
      });
  } catch (error) {
    if (saveAccount && saveAccount.accountId) {
      await accountModel.delete(saveAccount.accountId);
    }
    if (saveProfile && saveProfile.profileId) {
      await profileModel.delete(saveProfile.profileId);
    }
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

const signinWithSystem = async (username, password, type) => {
  try {
  } catch (error) {
    throw error;
  }
  //sign in system account
  if (!username || !password)
    throw createError(401, "The email or password can't be empty");
  const existAccount = await accountModel.findWithProfileByEmail(
    username,
    type
  );
  if (!existAccount || !existAccount[0]) {
    throw createError(401, "The email does not match!");
  }
  const validPassword = bcrypt.compareSync(password, existAccount[0].password);
  if (!validPassword) throw createError(401, "The password does not match!");
  if (existAccount[0].accountStatus === 5)
    throw createError(401, "The account is inactive!");
  return {
    accountId: existAccount[0].accountId,
    username: existAccount[0].username,
    accountType: existAccount[0].accountType,
    accountStatus: existAccount[0].accountStatus,
    socialAuthorization: existAccount[0].socialAuthorization,
    profileId: existAccount[0].profileId,
    email: existAccount[0].email,
    fullName: existAccount[0].fullName,
    profileType: existAccount[0].profileType,
    profileStatus: existAccount[0].profileStatus,
    avatarId: existAccount[0].avatarId,
    avatarPath: existAccount[0].avatarPath,
    avatarAlt: existAccount[0].avatarAlt,
  };
};

///////////////////////////////////////////////////////////////////////////////////////////
const signupWithSocial = async (dataSocial) => {
  let saveImage = null;
  let saveProfile = null;
  let saveAccount = null;
  let token = null;
  try {
    const bodyValidation = signupSocialValidation(dataSocial);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    const [
      profileTypeCode,
      accountTypeCode,
      profileStatusCode,
      accountStatusCode,
      existsProfile,
    ] = await Promise.all([
      (async () => {
        const profileTypeCode = await typeModel.findByName(
          bodyValidation.value.profileType
        );
        if (profileTypeCode && profileTypeCode.length) {
          return profileTypeCode[0].typeId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const accountTypeCode = await typeModel.findByName(
          bodyValidation.value.accountType
        );
        if (accountTypeCode && accountTypeCode.length) {
          return accountTypeCode[0].typeId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const statusCode = await statusModel.findByName(
          bodyValidation.value.profileStatus
        );
        if (statusCode && statusCode.length) {
          return statusCode[0].statusId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        const statusCode = await statusModel.findByName(
          bodyValidation.value.accountStatus
        );
        if (statusCode && statusCode.length) {
          return statusCode[0].statusId;
        } else {
          throw createError(
            401,
            "Something in your account type does not match"
          );
        }
      })(),
      (async () => {
        //check exists profile
        const existsProfile = await profileModel.findByEmail(
          bodyValidation.value.email
        );
        if (existsProfile && existsProfile.length) {
          return existsProfile[0];
        } else {
          return null;
        }
      })(),
      (async () => {
        if (bodyValidation.value.avatar) {
          //if create avatar
          const newImage = new imageModel(bodyValidation.value.avatar);
          saveImage = await imageModel.create(newImage);
        }
      })(),
    ]);

    if (!existsProfile) {
      //create profile
      const newProfile = new profileModel({
        fullName: bodyValidation.value.fullName,
        email: bodyValidation.value.email,
        avatar: saveImage ? saveImage.imageId : null,
        youtubeAccount: bodyValidation.value.youtubeAccount,
        profileType: profileTypeCode,
        profileStatus: profileStatusCode,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });
      //save profile
      saveProfile = await newProfile.create(newProfile);

      //create account
      const newAccount = new accountModel({
        socialAuthorization: bodyValidation.value.socialAuthorization,
        accountType: accountTypeCode,
        accountStatus: accountStatusCode,
        profile: saveProfile.profileId,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });

      //save account
      saveAccount = await newAccount.create(newAccount);
    } else {
      //create account
      const newAccount = new accountModel({
        socialAuthorization: bodyValidation.value.socialAuthorization,
        accountType: accountTypeCode,
        accountStatus: accountStatusCode,
        profile: existsProfile.profileId,
        createdAt: bodyValidation.value.createdAt,
        updatedAt: bodyValidation.value.updatedAt,
      });
      //save account
      saveAccount = await accountModel.create(newAccount);
    }
    return {
      accountId: saveAccount.accountId,
      username: saveAccount.username,
      accountType: saveAccount.accountType,
      accountStatus: saveAccount.accountStatus,
      socialAuthorization: saveAccount.socialAuthorization,
      profileId: saveProfile ? saveProfile.profileId : existsProfile.profileId,
      email: saveProfile ? saveProfile.email : existsProfile.email,
      fullName: saveProfile ? saveProfile.fullName : existsProfile.fullName,
      profileType: saveProfile
        ? saveProfile.profileType
        : existsProfile.profileType,
      profileStatus: saveProfile
        ? saveProfile.profileStatus
        : existsProfile.profileStatus,
      avatarId: existsProfile
        ? existsProfile.avatar
        : saveImage
        ? saveImage.imageId
        : null,
      avatarPath: existsProfile
        ? existsProfile.avatarPath
        : saveImage
        ? saveImage.path
        : null,
      avatarAlt: existsProfile
        ? existsProfile.avatarAlt
        : saveImage
        ? saveImage.alt
        : null,
    };
  } catch (error) {
    if (saveAccount && saveAccount.accountId) {
      await accountModel.delete(saveAccount.accountId);
    }
    if (saveProfile && saveProfile.profileId) {
      await profileModel.delete(saveProfile.profileId);
    }
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////////

const signinWithFacebook = async (socialAuthorization, accessToken, type) => {
  try {
    const existAccount =
      await accountModel.findWithProfileBySocialAuthorization(
        socialAuthorization,
        type
      );

    if (existAccount && existAccount[0]) {
      return existAccount[0];
    } else {
      const [dataFB, pictureFB] = await Promise.all([
        (async () => {
          const urlGraphFacebook = `https://graph.facebook.com/v11.0/${socialAuthorization}/?fields=id,name,email&access_token=${accessToken}`;
          const responseGraphFacebook = await (
            await fetch(urlGraphFacebook, {
              method: "GET",
            })
          ).json();

          if (
            !responseGraphFacebook ||
            !responseGraphFacebook.name ||
            !responseGraphFacebook.email ||
            !responseGraphFacebook.id
          )
            throw createError(400, "Invalid Facebook Account");
          return responseGraphFacebook;
        })(),
        (async () => {
          const urlPicture = `https://graph.facebook.com/v11.0/${socialAuthorization}/picture?width=256&height=256&redirect=false`;
          const responsePictureFacebook = await (
            await fetch(urlPicture, {
              method: "GET",
            })
          ).json();
          if (responsePictureFacebook && responsePictureFacebook.data) {
            const pictureFB = await downloadImage(
              responsePictureFacebook.data.url
            );
            return pictureFB;
          }
          return null;
        })(),
      ]);

      return await signupWithSocial({
        accountType: "facebook",
        socialAuthorization: dataFB.id,
        fullName: dataFB.name,
        email: dataFB.email,
        avatar: {
          path: pictureFB.path,
          alt: pictureFB.alt,
          size: pictureFB.size,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////

const signinWithGoogle = async (socialAuthorization, accessToken, type) => {
  try {
    const existAccount =
      await accountModel.findWithProfileBySocialAuthorization(
        socialAuthorization,
        type
      );
    if (existAccount && existAccount[0]) {
      return existAccount[0];
    } else {
      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: [
          process.env.BACKEND_GOOGLE_CLIENT_ID,
          `407408718192.apps.googleusercontent.com`,
        ],
      });
      const { name, email, picture, sub } = ticket.getPayload();
      const pictureGG = await downloadImage(picture.split("=s")[0] + "=s256-c");
      return await signupWithSocial({
        accountType: "google",
        socialAuthorization: sub,
        fullName: name,
        email: email,
        avatar: {
          path: pictureGG.path,
          alt: pictureGG.alt,
          size: pictureGG.size,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.signin = async (req, res, next) => {
  try {
    const bodyValidation = signinSystemValidation(req.body);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    const accountTypeCode = await typeModel.findByName(
      bodyValidation.value.accountType
    );

    if (!accountTypeCode || !accountTypeCode[0])
      return res
        .status(400)
        .send({ message: "Something in your account type does not match" });

    let account = null;
    switch (bodyValidation.value.accountType) {
      case "system":
        //sign in system account
        account = await signinWithSystem(
          bodyValidation.value.username,
          bodyValidation.value.password,
          accountTypeCode[0].typeId
        );
        break;
      case "facebook":
        account = await signinWithFacebook(
          bodyValidation.value.socialAuthorization,
          bodyValidation.value.accessToken,
          accountTypeCode[0].typeId
        );
        break;
      case "google":
        account = await signinWithGoogle(
          bodyValidation.value.socialAuthorization,
          bodyValidation.value.accessToken,
          accountTypeCode[0].typeId
        );
        break;
      default:
        break;
    }
    if (!account) throw createError(401, "The account does not exist!");

    const token = jwt.sign(
      {
        accountId: account.accountId,
        accountType: account.accountType,
        profileId: account.profileId,
        profileType: account.profileType,
      },
      process.env.TOKEN_SECURE,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );
    return res
      .set("Authorization", `Bearer ${token}`)
      .status(200)
      .send(account);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.resignin = async (req, res, next) => {
  try {
    const account = await accountModel.findWithProfileById(
      req.dataToken.accountId
    );
    if (!account || !account[0]) {
      throw createError(401, "The email does not match!");
    }

    return res.set("Authorization", `Bearer ${req.newToken}`).status(200).send({
      accountId: account[0].accountId,
      username: account[0].username,
      accountType: account[0].accountType,
      accountStatus: account[0].accountStatus,
      socialAuthorization: account[0].socialAuthorization,
      profileId: account[0].profileId,
      email: account[0].email,
      fullName: account[0].fullName,
      profileType: account[0].profileType,
      profileStatus: account[0].profileStatus,
      avatarId: account[0].avatarId,
      avatarPath: account[0].avatarPath,
      avatarAlt: account[0].avatarAlt,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.active = async (req, res, next) => {
  try {
    const tokenParam = req.params.id;
    const dataToken = jwt.verify(tokenParam, process.env.TOKEN_SECURE);
    if (!dataToken) return res.status(401).send({ message: "Unauthorized" });
    const status = await accountModel.findByIdAndActive(dataToken.accountId);
    return res.status(200).send(status);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.resetPassword = async (req, res, next) => {
  try {
    if (!req.body.username) {
      throw createError(400, "Username can't be empty'");
    }
    const existsAccount = await accountModel.findByEmail(req.body.username);
    if (!existsAccount || !existsAccount[0]) {
      throw createError(401, "The username does not match!");
    }

    const newPassword = Math.random().toString(36).slice(-8);

    //create hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, salt);

    const updateStatus = await accountModel.updatePasswordById(
      existsAccount[0].accountId,
      hashPassword
    );
    sendMailForgetPassword(newPassword, req.body.username);
    return res.status(200).send({ status: "successfully" });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.changePassword = async (req, res, next) => {
  try {
    const bodyValidation = changePasswordValidation(req.body);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    const existsAccount = await accountModel.findPasswordById(
      req.dataToken.accountId
    );
    if (!existsAccount || !existsAccount[0]) {
      throw createError(401, "The account does not match!");
    }
    const validPassword = bcrypt.compareSync(
      bodyValidation.value.oldPassword,
      existsAccount[0].password
    );
    if (!validPassword)
      throw createError(401, "The old password does not match!");
    //create hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(
      bodyValidation.value.newPassword,
      salt
    );

    const updateStatus = await accountModel.updatePasswordById(
      existsAccount[0].accountId,
      hashPassword
    );
    return res
      .status(200)
      .set("Authorization", `Bearer ${req.newToken}`)
      .send(updateStatus);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.changeProfile = async (req, res, next) => {
  try {
    const bodyValidation = changeProfileValidation(req.body);
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }
    const existsProfile = await profileModel.findById(req.dataToken.profileId);
    if (!existsProfile || !existsProfile[0]) {
      throw createError(401, "The profile does not match!");
    }
    bodyValidation.value.fullName
      ? (existsProfile[0].fullName = bodyValidation.value.fullName)
      : null;
    bodyValidation.value.youtubeAccount
      ? (existsProfile[0].youtubeAccount = bodyValidation.value.youtubeAccount)
      : null;

    const updateStatus = await profileModel.updateById(existsProfile[0]);

    return res
      .status(200)
      .set("Authorization", `Bearer ${req.newToken}`)
      .send(bodyValidation.value);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////

module.exports.changeavatar = async (req, res, next) => {
  let saveImage = null;
  try {
    const bodyValidation = changeAvatarValidation({
      avatar: req.body.image,
    });
    if (bodyValidation.error) {
      throw createError(400, bodyValidation.error.details[0].message);
    }

    const [existsProfile] = await Promise.all([
      (async () => {
        const existsProfile = await profileModel.findById(
          req.dataToken.profileId
        );
        if (!existsProfile || !existsProfile[0]) {
          throw createError(401, "The profile does not match!");
        }
        return existsProfile[0];
      })(),
      (async () => {
        if (bodyValidation.value.avatar) {
          //if create avatar
          const newImage = new imageModel(bodyValidation.value.avatar);
          saveImage = await imageModel.create(newImage);
        }
      })(),
    ]);

    existsProfile.avatar = saveImage.imageId;

    await profileModel.updateById(existsProfile);

    return res
      .status(200)
      .set("Authorization", `Bearer ${req.newToken}`)
      .send(saveImage);
  } catch (error) {
    next(error);
  }
};
