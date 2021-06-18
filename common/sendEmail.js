"use strict";
const nodemailer = require("nodemailer");
const { createError } = require("./createError");

const fs = require("fs");

const { promisify } = require("util");

const readFile = promisify(fs.readFile);

const htmlRender = (link) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!--<![endif]-->
      <title></title>
  
      <style type="text/css">
        table,
        td {
          color: #000000;
        }
        a {
          color: #0000ee;
          text-decoration: underline;
        }
        @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
  
          .u-row .u-col-100 {
            width: 600px !important;
          }
        }
  
        @media (max-width: 620px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: calc(100% - 40px) !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
        }
        body {
          margin: 0;
          padding: 0;
        }
  
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
  
        p {
          margin: 0;
        }
  
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
  
        * {
          line-height: inherit;
        }
  
        a[x-apple-data-detectors="true"] {
          color: inherit !important;
          text-decoration: none !important;
        }
      </style>
  
      <!--[if !mso]><!-->
      <link
        href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
        rel="stylesheet"
        type="text/css"
      />
      <!--<![endif]-->
    </head>
  
    <body
      class="clean-body"
      style="
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        background-color: #e0e5eb;
        color: #000000;
      "
    >
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table
        style="
          border-collapse: collapse;
          table-layout: fixed;
          border-spacing: 0;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          vertical-align: top;
          min-width: 320px;
          margin: 0 auto;
          background-color: #e0e5eb;
          width: 100%;
        "
        cellpadding="0"
        cellspacing="0"
      >
        <tbody>
          <tr style="vertical-align: top">
            <td
              style="
                word-break: break-word;
                border-collapse: collapse !important;
                vertical-align: top;
              "
            >
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e0e5eb;"><![endif]-->
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 6px 0px 0px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                  >
                                    <tr>
                                      <td
                                        style="
                                          padding-right: 0px;
                                          padding-left: 0px;
                                        "
                                        align="center"
                                      >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: #6720b0;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #6720b0;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #ffffff;
                                      line-height: 140%;
                                      text-align: center;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 140%">
                                      Welcome to MusicGu
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #e03add;
                                      line-height: 140%;
                                      text-align: center;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 140%">
                                      <strong
                                        ><span
                                          style="
                                            font-size: 22px;
                                            line-height: 30.8px;
                                          "
                                          >&nbsp;YOU CAN ACTIVE YOUR ACCOUNT NOW !
                                        </span></strong
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: #6a21af;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #6a21af;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #ffffff;
                                      line-height: 140%;
                                      text-align: center;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 140%">
                                      <span
                                        style="font-size: 30px; line-height: 42px"
                                        ><strong
                                          ><span
                                            style="
                                              line-height: 42px;
                                              font-size: 30px;
                                            "
                                            >Download our app and get
                                            started</span
                                          ></strong
                                        ></span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 25px 10px 10px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <div align="center">
                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Open Sans',sans-serif;"><tr><td style="font-family:'Open Sans',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.youtube.com/" style="height:58px; v-text-anchor:middle; width:124px;" arcsize="17%" stroke="f" fillcolor="#e03add"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
                                    <a
                                      href=${link}
                                      target="_blank"
                                      style="
                                        box-sizing: border-box;
                                        display: inline-block;
                                        font-family: 'Open Sans', sans-serif;
                                        text-decoration: none;
                                        -webkit-text-size-adjust: none;
                                        text-align: center;
                                        color: #ffffff;
                                        background-color: #e03add;
                                        border-radius: 10px;
                                        -webkit-border-radius: 10px;
                                        -moz-border-radius: 10px;
                                        width: auto;
                                        max-width: 100%;
                                        overflow-wrap: break-word;
                                        word-break: break-word;
                                        word-wrap: break-word;
                                        mso-border-alt: none;
                                        border-top-color: #b93cc0;
                                        border-top-style: solid;
                                        border-top-width: 0px;
                                        border-left-color: #b93cc0;
                                        border-left-style: solid;
                                        border-left-width: 0px;
                                        border-right-color: #b93cc0;
                                        border-right-style: solid;
                                        border-right-width: 0px;
                                        border-bottom-color: #b93cc0;
                                        border-bottom-style: solid;
                                        border-bottom-width: 4px;
                                      "
                                    >
                                      <span
                                        style="
                                          display: block;
                                          padding: 15px 25px;
                                          line-height: 120%;
                                        "
                                        ><strong
                                          ><span
                                            style="
                                              font-size: 24px;
                                              line-height: 28.8px;
                                            "
                                            >Active</span
                                          ></strong
                                        ><br
                                      /></span>
                                    </a>
                                    <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 10px 40px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <div
                                    style="
                                      color: #ffffff;
                                      line-height: 170%;
                                      text-align: center;
                                      word-wrap: break-word;
                                    "
                                  >
                                    <p style="font-size: 14px; line-height: 170%">
                                      <span
                                        style="
                                          font-size: 16px;
                                          line-height: 27.2px;
                                          font-family: Lato, sans-serif;
                                        "
                                        >Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Vestibulum sed lobortis
                                        ipsum. Interdum et malesuada fames ac ante
                                        ipsum primis in faucibus. Ut sodales
                                        mollis ante et molestie.
                                      </span>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <div
                class="u-row-container"
                style="padding: 0px; background-color: transparent"
              >
                <div
                  class="u-row"
                  style="
                    margin: 0 auto;
                    min-width: 320px;
                    max-width: 600px;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    word-break: break-word;
                    background-color: transparent;
                  "
                >
                  <div
                    style="
                      border-collapse: collapse;
                      display: table;
                      width: 100%;
                      background-color: transparent;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
  
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div
                      class="u-col u-col-100"
                      style="
                        max-width: 320px;
                        min-width: 600px;
                        display: table-cell;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 100% !important">
                        <!--[if (!mso)&(!IE)]><!--><div
                          style="
                            padding: 0px;
                            border-top: 0px solid transparent;
                            border-left: 0px solid transparent;
                            border-right: 0px solid transparent;
                            border-bottom: 0px solid transparent;
                          "
                        ><!--<![endif]-->
                          <table
                            style="font-family: 'Open Sans', sans-serif"
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="
                                    overflow-wrap: break-word;
                                    word-break: break-word;
                                    padding: 0px;
                                    font-family: 'Open Sans', sans-serif;
                                  "
                                  align="left"
                                >
                                  <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                  >
                                    <tr>
                                      <td
                                        style="
                                          padding-right: 0px;
                                          padding-left: 0px;
                                        "
                                        align="center"
                                      >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
  
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
  
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
  </html>
  `;
};

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMailActive = async (tokenActive, email) => {
  try {
    // create reusable transporter object using the default SMTP transport
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // const testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "minhchau2652@gmail.com", // generated ethereal user
        pass: "minhchau2652000", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "minhchau2652@gmail.com", // sender address
      to: "chouchousisme@gmail.com", //"bar@example.com, baz@example.com", // list of receivers
      subject: "Welcome to MusicGu ✔", // Subject line
      text: "Hello world?", // plain text body
      // html: await readFile(
      //   "/media/troutrous/Work/Nodejs/Hiwin/musicgu/public/mailhtml/index.html",
      //   "utf8"
      // ), // html body
      html: htmlRender(`https://localhost:4000/auth/active/${tokenActive}`),
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    throw createError(400, "Can't send email activation");
  }
};

// async..await is not allowed in global scope, must use a wrapper
module.exports.sendMailReset = async (tokenActive, email) => {
  try {
    // create reusable transporter object using the default SMTP transport
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // const testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "minhchau2652@gmail.com", // generated ethereal user
        pass: "minhchau2652000", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "minhchau2652@gmail.com", // sender address
      to: "chouchousisme@gmail.com", //"bar@example.com, baz@example.com", // list of receivers
      subject: "Welcome to MusicGu ✔", // Subject line
      text: "Hello world?", // plain text body
      // html: await readFile(
      //   "/media/troutrous/Work/Nodejs/Hiwin/musicgu/public/mailhtml/index.html",
      //   "utf8"
      // ), // html body
      html: htmlRender(`https://localhost:4000/auth/active/${tokenActive}`),
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    throw createError(400, "Can't send email activation");
  }
};

module.exports.sendMailForgetPassword = async (newPassword, email) => {
  try {
    // create reusable transporter object using the default SMTP transport
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // const testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "minhchau2652@gmail.com", // generated ethereal user
        pass: "minhchau2652000", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "minhchau2652@gmail.com", // sender address
      to: "chouchousisme@gmail.com", //"bar@example.com, baz@example.com", // list of receivers
      subject: "Reset Password MusicGu ✔", // Subject line
      text: `Your reset password is ${newPassword}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    throw createError(400, "Can't send email forget password");
  }
};
