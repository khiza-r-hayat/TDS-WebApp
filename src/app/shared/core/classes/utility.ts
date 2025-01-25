import { DatePipe } from "@angular/common";
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { environment } from "environments/environment";

export class Utility {
  static CustomFieldType: string;

  public static parseToDate(dateValue: string, format?: string) {
    var datePipe = new DatePipe(CONSTANTS.LOCALE_EN_US, "+00:00");
    return (
      new Date(
        datePipe.transform(
          dateValue ?? new Date(),
          format ? format : CONSTANTS.FORMAT_DATE_TIME
        )
      ) ?? null
    );
  }

  public static getLatestDateObject(list: any[]) {
    const latestObject = list.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest
    );
    return latestObject;
  }

  static readonly FORMAT_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ssZZZZZ";
  static readonly LOCALE_EN_US = "en-US";

  public static getSessionExpiryTime(): Date {
    // Create a new date and add 1 hour
    const expiryDate = new Date();

    expiryDate.setMinutes(expiryDate.getMinutes() + environment.minutes);

    return expiryDate;
  }

  public static formatDate(dateTime: any) {
    const datePipe = new DatePipe(Utility.LOCALE_EN_US);
    const formattedDate = datePipe.transform(dateTime, "yyyy-MM-dd");
    return formattedDate;
  }

  public static isDateBetween(date: any, startDate: any, endDate: any) {
    const dateToCheck = new Date(date);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    const isInRange = dateToCheck >= rangeStart && dateToCheck <= rangeEnd;
    return isInRange;
  }

  public static getUTCTime() {
    var datePipe = new DatePipe(CONSTANTS.LOCALE_EN_US, "+00:00");

    if (datePipe)
      return datePipe.transform(new Date(), CONSTANTS.FORMAT_DATE_TIME);
    else return null;
  }

  public static isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  public static sortArrayOfObject(array, field) {
    return array.sort((a, b) => {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
  }

  public static moveArrayElement(array, fromIndex, toIndex) {
    const element = array.splice(fromIndex, 1)[0];

    if (array[toIndex] === undefined) array[toIndex] = [];

    array.splice(toIndex, 0, element);
    return array;
  }

  public static getUserRoles(id: number): Array<any> | undefined {
    const userRole: any[] = [
      { id: 1, name: "SUPER_ADMINISTRATOR" },
      { id: 2, name: "Event Admin" },
      { id: 3, name: "Sponsor Admin" },
      { id: 4, name: "VENDOR" },
      { id: 5, name: "Supervisor" },
      { id: 6, name: "Staff" },
    ];
    return userRole.find((role) => role.id === id);
  }

  static multiOptionRequiredFor = ["select", "radio", "checkbox"];

  // Setup the roles
  static boothStaff = [
    {
      id: 5,
      label: "Supervisor",
      value: "supervisor",
      description: "Team Manager",
    },
    {
      id: 6,
      label: "Booth Personnel",
      value: "booth_staff",
      description: "Booth Personnel",
    },
  ];
  static eventOrganizers = [
    {
      id: 2,
      label: "Event Admin",
      value: "Event Admin",
      description: "Event Admin",
    },
  ];

  //for Nestle
  static inventoryConditionOptions = [
    "New",
    "Repaired",
    "Useable",
    "Rebranding",
    "Other",
  ];

  public static removeSpacesAndLower(text: string): string {
    // Remove spaces from the text
    const textWithoutSpaces = text.replace(/\s+/g, "-");

    // Convert the text to lowercase
    const textLower = textWithoutSpaces.toLowerCase();

    return textLower;
  }

  public static isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  public static capitalizeEachWord(str: string): string {
    const words = str.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
    const combined = words.map(this.capitalizeFirstLetter).join(" ");
    return this.capitalizeFirstLetter(combined);
  }

  public static capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  public static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public static generateStrongPassword(length: number = 12): string {
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialCharacters = "@$!%*?&";

    const allCharacters =
      lowerCaseLetters + upperCaseLetters + digits + specialCharacters;

    // Ensure at least one character from each set is included
    let password = "";
    password += lowerCaseLetters.charAt(
      Math.floor(Math.random() * lowerCaseLetters.length)
    );
    password += upperCaseLetters.charAt(
      Math.floor(Math.random() * upperCaseLetters.length)
    );
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += specialCharacters.charAt(
      Math.floor(Math.random() * specialCharacters.length)
    );

    // Fill the rest of the password length with random characters from all characters
    for (let i = password.length; i < length; i++) {
      password += allCharacters.charAt(
        Math.floor(Math.random() * allCharacters.length)
      );
    }

    // Shuffle the password characters
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  public static noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise((resolve) => {
        const isWhitespace = (control.value || "").trim().length === 0;
        resolve(isWhitespace ? { whitespace: true } : null);
      });
    };
  }

  public static generatePassword(): string {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  public static getEndDate(subscription) {
    const currentDate = new Date();
    const sixMonthsLater = new Date(currentDate);
    sixMonthsLater.setUTCMonth(sixMonthsLater.getUTCMonth() + 6);

    const endDate = sixMonthsLater.toISOString(); // Output: "2023-10-24T12:49:36.623Z"
    return endDate;
  }

  public static adjustStartAndEndDates(
    startDateString: string,
    endDateString: string
  ): { startDateUTC: string; endDateUTC: string } {
    const startDate = new Date(startDateString);
    startDate.setHours(0, 0, 0, 0); // Set to 00:00:00

    const endDate = new Date(endDateString);
    endDate.setHours(23, 59, 59, 999); // Set to 23:59:59

    // Convert both dates to UTC format
    const startDateUTC = startDate.toISOString();
    const endDateUTC = endDate.toISOString();

    return {
      startDateUTC: startDateUTC.replace("Z", "+00:00"), // Change the format if needed
      endDateUTC: endDateUTC.replace("Z", "+00:00"),
    };
  }

  public static getFieldValueBasedOnFieldName(
    fieldName,
    account,
    password,
    orgName = undefined
  ) {
    switch (fieldName) {
      case "email":
        return account.email;
      case "password":
        return password;
      case "firstName":
        return account.firstName;
      case "lastName":
        return account.lastName;
      case "reset_password_link":
        return environment.siteResetUrl;
      case "site_url":
        return environment.siteUrl;
      case "event_name":
        return "";
      case "sponsor_company_name":
        return orgName != undefined ? orgName : "";
      case "campaign_name":
        return "";
      // Add more cases for other fields as needed
      default:
        return ""; // Return a default value or handle unknown fields appropriately
    }
  }
  public static getFieldValueBasedOnFieldNameTest(fieldName, password) {
    switch (fieldName) {
      case "email":
        return "muhammad.abdullah@e2esp.com";
      case "password":
        return "password";
      case "firstName":
        return "Abdullah";
      case "lastName":
        return "Ejaz";
      case "reset_password_link":
        return environment.siteResetUrl;
      case "site_url":
        return environment.siteUrl;
      case "event_name":
        return "";
      case "sponsor_company_name":
        return "";
      case "campaign_name":
        return "";
      // Add more cases for other fields as needed
      default:
        return ""; // Return a default value or handle unknown fields appropriately
    }
  }

  public static getFieldValueBasedOnFieldNameWithOutPassword(
    fieldName,
    account
  ) {
    switch (fieldName) {
      case "email":
        return account.email;
      case "password":
        return environment.siteResetUrl;
      case "firstName":
        return account.firstName;
      case "lastName":
        return account.lastName;
      case "reset_password_link":
        return environment.siteResetUrl;
      case "site_url":
        return environment.siteUrl;
      case "event_name":
        return "";
      case "sponsor_company_name":
        return "";
      case "campaign_name":
        return "";
      // Add more cases for other fields as needed
      default:
        return ""; // Return a default value or handle unknown fields appropriately
    }
  }
  public static getFieldValueBasedOnFieldNameCampaign(
    fieldName,
    account,
    campaign_name,
    event_name
  ) {
    switch (fieldName) {
      case "email":
        return account.email;
      case "password":
        return environment.siteResetUrl;
      case "firstName":
        return account.firstName;
      case "lastName":
        return account.lastName;
      case "reset_password_link":
        return environment.siteResetUrl;
      case "site_url":
        return environment.siteUrl;
      case "event_name":
        return event_name;
      case "sponsor_company_name":
        return "";
      case "campaign_name":
        return campaign_name;
      // Add more cases for other fields as needed
      default:
        return ""; // Return a default value or handle unknown fields appropriately
    }
  }

  //   public static generateEmailTemplatesForOrgs(tenantId: string): TenantEmailTemplate[] {
  //     const _welcomeEmailTemplate = {
  //       id: this.generateUUID(),
  //       tenantId: tenantId,
  //       title: 'Welcome Email Template',
  //       to: null,
  //       subject: 'Welcome to ExpoGenie Lead Scanning',
  //       from: null,
  //       template: '<p>Hi {firstName} {lastName},</p><p><br></p><p>Welcome to ExpoGenie Lead Scanning. We are excited to have you on board. You can login to the lead scanning portal/app with the following credentials.</p><p><br></p><p>Portal: {site_url}</p><p><br></p><p>User: {email}</p><p>Password: {password}</p><p><br></p><p>Google Play: <a href="https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share" rel="noopener noreferrer" target="_blank">https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share</a></p><p>Apple App Store: <a href="https://apps.apple.com/nz/app/expogenie-leads/id6469518790" rel="noopener noreferrer" target="_blank">https://apps.apple.com/nz/app/expogenie-leads/id6469518790</a></p><p><br></p><p>Thanks</p><p>ExpoGenie</p>',
  //       templateType: 1,
  //       default: true
  //     };

  //     const _resetEmailTemplate = {
  //       id: this.generateUUID(),
  //       tenantId: tenantId,
  //       title: 'Password Reset Email Template',
  //       to: null,
  //       subject: 'Password reset request',
  //       from: null,
  //       template: '<p>Dear {firstName} {lastName},</p><p><br></p><p>We have received a request to reset the password for your account. If you did not make this request, please ignore this email.</p><p><br></p><p>To reset your password, click on the following link:</p><p>{reset_password_link}</p><p><br></p><p>If the above link does not work, copy and paste the above URL into your browser:</p><p><br></p><p>Thanks</p><p>ExpoGenie</p>',
  //       templateType: 2,
  //       default: true
  //     };
  //     const _campEmailTemplate = {
  //       id: this.generateUUID(),
  //       tenantId: tenantId,
  //       title: 'Campaign Invite Email Template',
  //       to: null,
  //       subject: 'You have been added to {campaign_name}',
  //       from: null,
  //       template: '<p>Hi {firstName} {lastName},</p><p><br></p><p>You have been added to the Campaign: {campaign_name} of Event: {event_name}. You can login to our mobile app with your existing user credentials and start scanning leads for this campaign.</p><p><br></p><p><br></p><p>Google Play: <a href="https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share" rel="noopener noreferrer" target="_blank">https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share</a></p><p>Apple App Store: <a href="https://apps.apple.com/nz/app/expogenie-leads/id6469518790" rel="noopener noreferrer" target="_blank">https://apps.apple.com/nz/app/expogenie-leads/id6469518790</a></p><p><br></p><p>Thanks</p><p>ExpoGenie</p>',
  //       templateType: 3,
  //       default: true
  //     };

  //     return [_welcomeEmailTemplate, _resetEmailTemplate, _campEmailTemplate];
  //   }
}

export enum CustomFieldType {
  LEAD = "lead",
  QUESTIONNAIRE = "questionnaire",
}

export enum ConfigType {
  LABEL = "label",
  INTEGRATION = "integration",
}

export enum RecordDeletion {
  DELETE_ALL = "1",
  ATTRIBUTE_ALL = "2",
}

export enum EventStatusType {
  ACTIVE_EVENTS = "Active Events",
  ENDED_EVENTS = "Ended Events",
  UPCOMING_EVENTS = "Upcoming Events",
}

export enum CampaignStatusType {
  ACTIVE_CAMPAIGNS = "Active Campaigns",
  ENDED_CAMPAIGNS = "Ended Campaigns",
  UPCOMING_CAMPAIGNS = "Upcoming Campaigns",
}

export enum StockTypeNames {
  Giveaway = "giveaway",
  SOG_Stock = "sog",
  Selling_Stock = "selling",
}

export class CONSTANTS {
  // Sessions
  static readonly LOGGED_IN_USER = "aXNMb2dnZWRJbg";
  static readonly IMPERSANET_USER = "aMJDv4JAnA0ag3KQP7";
  static readonly IMPERSANET_EVENT_ORGANIZER = "sqAsDvhjn98aQP7";

  // Date Time Formats
  static readonly LOCALE_EN_US = "en-US";
  static readonly MOMENT_FORMAT_DATE = "YYYY-MM-DD";
  static readonly FORMAT_DATE = "yyyy-MM-dd";
  static readonly INTL_FORMAT_DATE = "MM-dd-yyyy";
  static readonly FORMAT_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ssZZZZZ";
  static readonly DEFAULT_DATE = "2020-01-01";

  static readonly SPONSOR_REMOVAL_CONFIRMATION_TITLE = "Delete Event Sponsor?";
  static readonly SPONSOR_REMOVAL_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this sponsor from the list?";

  static readonly USER_REMOVAL_CONFIRMATION_TITLE = "Delete Booth Staff?";
  static readonly USER_REMOVAL_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this user from the list?";

  static readonly EVENT_ORGANIZER_REMOVAL_CONFIRMATION_TITLE =
    "Delete Event Admin?";
  static readonly EVENT_ORGANIZER_REMOVAL_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this user from the list?";

  static readonly FIELD_REMOVAL_CONFIRMATION_TITLE = "Delete Field?";
  static readonly FIELD_REMOVAL_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this field?";

  static readonly EVENT_TITLE = "Event Setup Form";
  static readonly CAMPAIGN_TITLE = "Lead Campaign Form";

  static readonly MESSAGE_SELECT_USER_TO_PROCEED = "Select user to proceed.";

  static readonly CONFIRMED = "confirmed";
  static readonly CANCELLED = "cancelled";
  static readonly DELETE = "Delete";
  static readonly DISABLE = "Disable";
  static readonly APPROVE = "Approve";

  static readonly TENANT_ADMIN = "Event Admin";
  static readonly SUPER_ADMIN = "Super Admin";
  static readonly SPONSOR_ADMIN = "Sponsor Admin";
  static readonly STAFF = "Staff";
  static readonly BOX_WIDTH = "200px";
  static readonly BOX_HEIGHT = "240px";

  static readonly LABEL_BOOTH_STAFF = "Booth Staff";
  static readonly LABEL_SPONSORS = "Sponsors";
  static readonly KEY_BOOTH_STAFF = "booth_staff_label";
  static readonly SEPARATION_KEY = "###";
  static readonly EMPTY = "";

  static readonly TASK_DELETE_CONFIRMATION_TITLE = "Delete Level?";
  static readonly TASK_DELETE_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this task from the fields?";

  static readonly LEVEL_DELETE_CONFIRMATION_TITLE = "Delete Level?";
  static readonly LEVEL_DELETE_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this level from the fields?";

  static readonly BULK_LEVEL_DELETE_CONFIRMATION_TITLE =
    "Delete the selected Levels?";
  static readonly BULK_LEVEL_DELETE_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete these selected levels?";

  static readonly TASK_SUB_DELETE_CONFIRMATION_TITLE =
    "Delete Task Submission?";
  static readonly TASK_SUB_DELETE_CONFIRMATION_MESSAGE =
    "Are you sure you want to delete this task Submission?";
  static readonly TASK_SUB_RESPONSE_MESSAGE_SUCCESS =
    "Task Submission was deleted successfully.";
  static readonly TASK_SUB_RESPONSE_MESSAGE_FAILURE =
    "Task Submission failed due to an error.";

  static readonly emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  static readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  static defaultField = {
    id: Utility.generateUUID(),
    title: ["", Validators.required],
    type: "text",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static nameField = {
    id: Utility.generateUUID(),
    title: ["Name", Validators.required],
    type: "text",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static mobileField = {
    id: Utility.generateUUID(),
    title: ["Mobile", Validators.required],
    type: "text",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static genderField = {
    id: Utility.generateUUID(),
    title: ["Gender", Validators.required],
    type: "radio",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static maritalField = {
    id: Utility.generateUUID(),
    title: ["Marital Status", Validators.required],
    type: "email",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static ageField = {
    id: Utility.generateUUID(),
    title: ["Age", Validators.required],
    type: "select",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static occupationField = {
    id: Utility.generateUUID(),
    title: ["Occupation", Validators.required],
    type: "select",
    required: true,
    visibility: true,
    helpText: "",
    options: [""],
    mapSource: "",
  };

  static _welcomeEmailTemplate = {
    title: "Welcome Email Template",
    to: null,
    subject: "Welcome to ExpoGenie Lead Scanning",
    from: null,
    template:
      '<p>Hi {firstName} {lastName},</p><p><br></p><p>Welcome to ExpoGenie Lead Scanning. We are excited to have you on board. You can login to the lead scanning portal/app with the following credentials.</p><p><br></p><p>Portal: {site_url}</p><p><br></p><p>User: {email}</p><p>Password: {password}</p><p><br></p><p>Google Play: <a href="https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share" rel="noopener noreferrer" target="_blank">https://play.google.com/store/apps/details?id=com.e2esp.expogenie&amp;pcampaignid=web_share</a></p><p>Apple App Store: <a href="https://apps.apple.com/nz/app/expogenie-leads/id6469518790" rel="noopener noreferrer" target="_blank">https://apps.apple.com/nz/app/expogenie-leads/id6469518790</a></p><p><br></p><p>Thanks</p><p>ExpoGenie</p>',
    type: 1,
    default: true,
  };
}

export const EventTypeData = [
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213a",
    name: "Apartment Storming",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213b",
    name: "CCs at Stores",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213c",
    name: "DDS",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213d",
    name: "Mall Activation",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213e",
    name: "Sampling",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213f",
    name: "School Activation",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
];

export const DealsData = [
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213g",
    name: "Buy Everyday Cup of tea at RS 10",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213h",
    name: "Exclusive Home Delivery Offer",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213i",
    name: "Free Sampling",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213j",
    name: "Unit Sold",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213k",
    name: "Buy 1 Get 1 Free",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "cd5fa417-b667-482d-b208-798d9da3213l",
    name: "No Deal",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
];

export const CheckistData = [
  {
    id: "a45ed264-366e-4860-bc73-91a9fe7f1bc1",
    tenantId: "874be33c-7c3a-45e4-9cb5-60fa12575f64",
    name: "Safety Checklist",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "43e383da-45bc-4a85-9263-ff07c224c534",
    tenantId: "874be33c-7c3a-45e4-9cb5-60fa12575f64",
    name: "Dry Checklist",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "bb5f8adf-ad2f-4e68-80e3-bcab7ddaac8c",
    tenantId: "874be33c-7c3a-45e4-9cb5-60fa12575f64",
    name: "Wet Checklist",
    status: true,
    createdAt: null,
    updatedAt: null,
  },
];
