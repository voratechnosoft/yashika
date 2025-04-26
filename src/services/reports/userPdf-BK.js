const ObjectId = require("mongodb").ObjectId;
const pdf = require("html-pdf");
const path = require("path");
const moment = require("moment");
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const constants = require("../../config/constants");

const generateHtmlContent = (data, pageIndex, totalPages, recordsPerPage) => {
  const startIndex = pageIndex * recordsPerPage;
  const endIndex = Math.min(
    startIndex + recordsPerPage,
    data?.userData?.length
  );
  const pageData = data?.userData.slice(startIndex, endIndex);

  let currentPageNumber = pageIndex + 1;
  let totalUserRecord = data?.userData?.length;

  let headerTitle = "User List";

  let baseUrl = "https://voratechnosoft.com";
  let liveUrl = process.env.NODE_URL;

  let reportDate = moment(new Date()).format("DD-MM-YYYY");
  let periodDate = moment(new Date()).format("DD-MM-YYYY");

  let totalCount = data?.totalCount ? data?.totalCount : 0;
  let totalAdmin = data?.totalAdmin ? data?.totalAdmin : 0;
  let totalSubAdmin = data?.totalSubAdmin ? data?.totalSubAdmin : 0;
  let totalUser = data?.totalUser ? data?.totalUser : 0;
  let totalActive = data?.totalActive ? data?.totalActive : 0;
  let totalInActive = data?.totalInActive ? data?.totalInActive : 0;

  let firstTableHeader = "Date";
  let twoTableHeader = "Person Name";
  let threeTableHeader = "Mobile No";
  let fourTableHeader = "Role";
  let fiveTableHeader = "Status";

  // HTML template for each page
  let htmlInvoiceTemplate = "<!DOCTYPE html><html lang='en-US'>";

  htmlInvoiceTemplate +=
    "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Yashika User</title></head>";

  htmlInvoiceTemplate +=
    "<style>@font-face {font-family: Gilroy-Bold; src: url('" +
    baseUrl +
    "/fonts/Gilroy-Bold.ttf');} @font-face { font-family: Gilroy-Regular; src: url('" +
    baseUrl +
    "/fonts/Gilroy-Regular.ttf');}*{box-sizing: border-box; padding: 0;margin: 0;} body {background-color: #F8F9FD;color: #000; font-family: Gilroy-Bold;} table {caption-side: bottom; border-collapse: collapse;} .fwb { font-weight: 700; } .fwb-1 { margin-right: 20px !important; } .logo { width: 70px; } .bb { background-color: #000; height: 30px !important; border-bottom: 1px solid; } .top-space {margin-top: 50px;} .top-table-space {margin-top: 0px;} .invoice-wrappper { background-color: #fff; max-width: 700px;margin-left: auto;margin-right: auto; } .invoice-border { border: 1px solid #000; } td { padding: 1px 5px; font-size: 16px; } .img-td { width: 200px !important; text-align: start; } .t1td2 { vertical-align: middle; width: 500px !important; color: #fff; text-align: start; } .t1td2 p { font-weight: 700; } .main-d { padding: 0px 30px; } .table-2 { margin-top: 14px !important; } .daily-td { width: 260px; min-width: 260px; margin: auto; text-align: center; } .daily-td h5 { background-color: #794909; color: #fff; margin-top: 10px; padding: 8px; border-radius: 6px; font-weight: 700; font-size: 20px; margin-bottom: 0px; } .name-td { width: 250px; font-size: 14px; font-weight: 700; color: gray; } .name-td p { margin-bottom: 0px; } .name-td span { color: #794909; margin-bottom: 0px; } .tab-hig { min-height: 750px !important; } .name-td-1 { width: 350px; font-size: 14px; font-weight: 700; color: gray; } .name-td-1 p { margin-bottom: 0px; } .name-td-1 span { color: #794909; } .table-3 { min-width: 650px; margin-top: 25px !important; background-color: #000; color: #fff; text-align: center; font-weight: 700; font-size: 14px; margin-bottom: 50px; } .tr-bg { background-color: #794909; } .bt { border-top: 1px solid !important; } .bl { border-left: 1px solid; } .tab-3-td { width: 100px; padding: 8px; border-right: 1px solid; background-color: #794909 !important; } .tab-mh { height: 400px; } .tab-3-td2 { font-weight: 500; color: #794909; border-top: 1px solid; border-left: 1px solid; border-bottom: 1px solid; background-color: rgb(219, 219, 219); padding: 5px 0px; } .tab-footer-3-td2 { font-weight: 500; color: #794909; border-bottom: 1px solid; background-color: #fff; } .tr-h { min-height: 10px !important; } .tab-3-tdc { min-width: 100px !important; color: #000; border-right: 1px solid; font-weight: 600; padding: 4px 0px; margin-top: 10px; font-size: 15px; font-family: Gilroy-Regular; vertical-align: top;} .br { border-left: 1px solid; } .bl { border-right: 1px solid; } .tab-3-tdn { color: #000; text-align: center; min-width: 235px; } .tab-3-start { text-align: start !important; } .mh-white { background-color: #fff; } .table-4 { background-color: #794909 !important; color: #fff; text-align: center; width: 100%; } .table-4 td { padding: 8px !important; } .contact { display: flex; justify-content: end; align-items: center; } .contact-1 { text-align: end; } .contact-1 p { margin-bottom: 0px; } .page-center { text-align: center; } .tab-space {padding-left: 10px} .textCenter { text-align: center; } </style>";

  let topHeaderClass = "";
  let topTableClass = "";
  if (currentPageNumber > 1) {
    topHeaderClass = "top-space";
    topTableClass = "top-table-space";
  }
  htmlInvoiceTemplate +=
    "<body><div class='invoice-wrappper " +
    topHeaderClass +
    "'><div class='invoice-border'>";

  htmlInvoiceTemplate +=
    "<table class='bb " +
    topTableClass +
    "'><tbody class='tr-bg'><tr style='height: 70px;'><td class='img-td'><img src='" +
    baseUrl +
    "/images/110.70_logo.png' alt='logo' class='img-fluid logo'></td><td class='t1td2'><div class='contact'><div class='contact-1'><p class='fwb-1'><span class='fwb'>Contact :</span> 99988-87772</p></div></div></td></tr></tbody></table>";

  htmlInvoiceTemplate +=
    "<div class='main-d'><div class='daily-td'><h5 class=''>" +
    headerTitle +
    "</h5></div>";

  htmlInvoiceTemplate += "<table class='table-2'>";

  htmlInvoiceTemplate +=
    "<tr><td class='name-td-1'><p class=''>Report Date : <span class='tab-space'>" +
    reportDate +
    "</span></p></td><td class='name-td-1'><p class=''>Period Date : <span class='tab-space'>" +
    periodDate +
    "</span></p></td></tr>";

  htmlInvoiceTemplate +=
    "<tr><td class='name-td-1'><p class=''>Total(All) : <span class='tab-space'>" +
    totalCount +
    "</span></p></td><td class='name-td-1'><p class=''>Admin : <span class='tab-space'>" +
    totalAdmin +
    "</span></p></td></tr>";

  htmlInvoiceTemplate +=
    "<tr><td class='name-td-1'><p class=''>Sub Admin : <span class='tab-space'>" +
    totalSubAdmin +
    "</span></p></td><td class='name-td-1'><p class=''>User : <span class='tab-space'>" +
    totalUser +
    "</span></p></td></tr>";

  htmlInvoiceTemplate +=
    "<tr><td class='name-td-1'><p class=''>Active : <span class='tab-space'>" +
    totalActive +
    "</span></p></td><td class='name-td-1'><p class=''>In Active : <span class='tab-space'>" +
    totalInActive +
    "</span></p></td></tr>";

  htmlInvoiceTemplate += "</table>";

  htmlInvoiceTemplate +=
    "<div class='tab-hig'><table class='table-3'><thead class=''><tr>";

  htmlInvoiceTemplate += "<td class='tab-3-td'>" + firstTableHeader + "</td>";
  htmlInvoiceTemplate += "<td class='tab-3-td bl'>" + twoTableHeader + "</td>";
  htmlInvoiceTemplate +=
    "<td class='tab-3-td bl'>" + threeTableHeader + "</td>";
  htmlInvoiceTemplate += "<td class='tab-3-td bl'>" + fourTableHeader + "</td>";
  htmlInvoiceTemplate += "<td class='tab-3-td bl'>" + fiveTableHeader + "</td>";

  htmlInvoiceTemplate += "</tr></thead><tbody class='mh-white mh'>";

  // Loop over the data for the current page
  pageData.forEach((record) => {
    let createdDate = moment(record?.dtCreatedAt).format("DD-MM-YYYY");
    let userName = record?.vName ? record?.vName : "-----";
    let mobileNumber = record?.vMobile ? record?.vMobile : "-----";
    let role = record?.vUserRoleName ? record?.vUserRoleName : "-----";
    let status = record?.isBlock ? "Block" : "Active";

    htmlInvoiceTemplate +=
      "<tr class='tr-h tr-h-position'><td class='tab-3-tdc br'><div class='tr-h-positions'><p>" +
      createdDate +
      "</p></div></td><td class='tab-3-tdc'><div class='tr-h-positions'><p>" +
      userName +
      "</p></div></td><td class='tab-3-tdc'><div class='tr-h-positions'><p>" +
      mobileNumber +
      "</p></div></td><td class='tab-3-tdc'><div class='tr-h-positions'><p>" +
      role +
      "</p></div></td><td class='tab-3-tdc'><div class='tr-h-positions'><p>" +
      status +
      "</p></div></td></tr>";
  });

  htmlInvoiceTemplate += "</tbody>";

  if (currentPageNumber === totalPages) {
    htmlInvoiceTemplate +=
      "<tfoot class='mh-white'><tr><td class='tab-3-td2'></td><td class='tab-3-td2'></td><td class='tab-3-td2'></td><td class='tab-3-td2 bl'>Total: </td><td class='tab-3-td2'>" +
      totalUserRecord +
      "</td></tr></tfoot>";
  } else {
    htmlInvoiceTemplate +=
      "<tfoot class='mh-white'><tr><td class='tab-footer-3-td2'></td><td class='tab-footer-3-td2'></td><td class='tab-footer-3-td2'></td><td class='tab-footer-3-td2'></td><td class='tab-footer-3-td2'></td></tr></tfoot>";
  }

  htmlInvoiceTemplate += "</table></div></div></div>";

  htmlInvoiceTemplate +=
    "<table class='table-4'><tfoot><tr><td class='page-center'>Page : " +
    currentPageNumber +
    " of " +
    totalPages +
    "</td></tr></tfoot></table></div></body></html>";

  return htmlInvoiceTemplate;
};

const userPdf = async (req, res) => {
  try {
    let {
      user: { _id: userId },
      body: {},
    } = req;

    let userFilter = {
      isDeleted: false,
      _id: new ObjectId(userId),
    };

    let checkUserData = await dbService.findOneRecord("UserModel", userFilter, {
      _id: 1,
      arrUserAccess: 1,
    });

    if (!checkUserData?.arrUserAccess.includes("report")) {
      throw new Error(Message.reportNotPermission);
    }

    const data = await userList();

    let recordList = data?.data;

    if (recordList?.userData?.length === 0) {
      return res.status(200).json({
        message: "No Data Found",
      });
    }

    const recordsPerPage = 10;
    const totalPages = Math.ceil(recordList?.userData?.length / recordsPerPage);

    let reportGenerateDate = moment(new Date()).format("DD-MM-YYYY-HH:mm:ss");
    let fileName = "userPdf-" + reportGenerateDate + ".pdf";

    const pdfFilePath = path.join(
      __dirname,
      "../../../public",
      "pdf",
      "userPdf",
      fileName
    );

    // Set options for the PDF generation
    const options = {
      format: "A4", // You can choose other formats like 'A4', 'Legal', etc.
    };

    let allPagesHtml = "";
    for (let i = 0; i < totalPages; i++) {
      allPagesHtml += generateHtmlContent(
        recordList,
        i,
        totalPages,
        recordsPerPage
      );
    }

    pdf.create(allPagesHtml, options).toFile(pdfFilePath, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Fail" });
      }

      return res.status(200).json({
        message: "Success",
        fileName: "pdf/userPdf/" + fileName,
      });
    });
  } catch (error) {
    console.error("userPdfError ----------->", error);
    throw new Error(error?.message);
  }
};

const userList = async () => {
  try {
    let filter = {
      isDeleted: false,
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tblroles",
          localField: "vUserRoleId",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: {
          path: "$roleData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vMobile: 1,
          vUserRoleId: 1,
          vUserRoleName: "$roleData.vName",
          arrUserAccess: 1,
          vProfileImage: 1,
          isAdmin: 1,
          isBlock: 1,
          isActive: 1,
          isDeleted: 1,
          dtCreatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    const dataList = await dbService.aggregateData("UserModel", aggregateQuery);

    let totalCount = await dbService.recordsCount("UserModel", {
      isDeleted: false,
    });

    let totalAdmin = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: true,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.ADMIN),
    });

    let totalSubAdmin = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: true,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.SUB_ADMIN),
    });

    let totalUser = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isAdmin: false,
      vUserRoleId: new ObjectId(constants?.ROLE_ID?.USER),
    });

    let totalActive = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isBlock: false,
    });

    let totalInActive = await dbService.recordsCount("UserModel", {
      isDeleted: false,
      isBlock: true,
    });

    let result = {
      userData: dataList,
      totalCount: totalCount,
      totalAdmin: totalAdmin,
      totalSubAdmin: totalSubAdmin,
      totalUser: totalUser,
      totalActive: totalActive,
      totalInActive: totalInActive,
    };

    return { data: result };
  } catch (error) {
    console.error("userList Error ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = userPdf;
