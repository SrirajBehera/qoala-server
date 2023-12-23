const vision = require("@google-cloud/vision");

const serviceAccountValues = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: Buffer.from(process.env.PRIVATE_KEY_BASE64, "base64").toString(
    "utf-8"
  ),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const CONFIG = {
  credentials: {
    private_key: serviceAccountValues.private_key,
    client_email: serviceAccountValues.client_email,
  },
};

const detectTextfromOCR = async (image_link) => {
  try {
    // Creates a client
    const client = new vision.ImageAnnotatorClient(CONFIG);

    // Performs text detection on the file
    const [result] = await client.textDetection(image_link);
    const detections = result.textAnnotations;
    const [text, ...others] = detections;
    // console.log(`Text: ${text.description}`);

    const ocrOutput = text.description;

    // Define regular expressions for extraction
    const idNumberRegex = /(\d\s\d{4}\s\d{5}\s\d{2}\s\d)/;
    const nameRegex = /Name (.+)/;
    const lastNameRegex = /Last name (.+)/;
    const dobRegex = /Date of Birth (\d{1,2} [A-Za-z]+\. \d{4})/;
    const issueDateRegex = /(\d{1,2} [A-Za-z]+\. \d{4})[\n\s]+Date of Issue/;
    const expiryDateRegex = /(\d{1,2} [A-Za-z]+\. \d{4})[\n\s]+Date of Expiry/;

    // Extract information using regular expressions with null checks
    const idNumberMatch = ocrOutput.match(idNumberRegex);
    const nameMatch = ocrOutput.match(nameRegex);
    const lastNameMatch = ocrOutput.match(lastNameRegex);
    const dobMatch = ocrOutput.match(dobRegex);
    const issueDateMatch = ocrOutput.match(issueDateRegex);
    const expiryDateMatch = ocrOutput.match(expiryDateRegex);

    const matches = [
      idNumberMatch,
      nameMatch,
      lastNameMatch,
      dobMatch,
      issueDateMatch,
      expiryDateMatch,
    ];

    // Count the non-null matches
    const nonNullMatches = matches.filter((match) => match !== null);

    // Calculate the percentage
    const percentageSuccess = (nonNullMatches.length / matches.length) * 100;

    return {
      idNumber: idNumberMatch ? idNumberMatch[1] : "Not found",
      name: nameMatch ? nameMatch[1] : "Not found",
      lastName: lastNameMatch ? lastNameMatch[1] : "Not found",
      dob: dobMatch ? dobMatch[1] : "Not found",
      issueDate: issueDateMatch ? issueDateMatch[1] : "Not found",
      expiryDate: expiryDateMatch ? expiryDateMatch[1] : "Not found",
      percentageSuccess,
      rawData: ocrOutput
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = detectTextfromOCR
