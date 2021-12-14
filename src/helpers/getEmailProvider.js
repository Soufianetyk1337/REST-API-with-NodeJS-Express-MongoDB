const supportedServices = [
    "126",
    "163",
    "1und1",
    "AOL",
    "DebugMail",
    "DynectEmail",
    "FastMail",
    "GandiMail",
    "Gmail",
    "Godaddy",
    "GodaddyAsia",
    "GodaddyEurope",
    "hot.ee",
    "Hotmail",
    "iCloud",
    "mail.ee",
    "Mail.ru",
    "Maildev",
    "Mailgun",
    "Mailjet",
    "Mailosaur",
    "Mandrill",
    "Naver",
    "OpenMailBox",
    "Outlook365",
    "Postmark",
    "QQ",
    "QQex",
    "SendCloud",
    "SendGrid",
    "SendinBlue",
    "SendPulse",
    "SES",
    "SES-US-EAST-1",
    "SES-US-WEST-2",
    "SES-EU-WEST-1",
    "Sparkpost",
    "Yahoo",
    "Yandex",
    "Zoho",
    "qiye.aliyun",
]

export const getEmailProvider = (email) => {
    const emailProvider = email.split("@")[1].split(".")[0]
    const capitalizeEmailProvider = emailProvider.split("")[0].toUpperCase() + emailProvider.slice(1)
    return supportedServices.includes(capitalizeEmailProvider) ? capitalizeEmailProvider : false;
}