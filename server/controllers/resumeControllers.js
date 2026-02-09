import imagekit from "../config/imageKit.js";
import Resume from "../models/Resumes.js";
import fs from "fs";
import puppeteer from "puppeteer";
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({
      message: "Resume has been created successfully !",
      resume: newResume,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.deleteOne({ _id: resumeId, userId });
    return res.status(200).json({ message: "Resume has been deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Cannot found resume" });
    }
    resume._v = undefined;
    resume.created_at = undefined;
    resume.updated_at = undefined;
    return res.status(200).json({ resume });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, public: true });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { resumeId, resumeData, removeBackground } = req.body;
    const userId = req.userId;
    const image = req.file;

    let resumeDataClone;
    try {
      if (typeof resumeData === "string") {
        resumeDataClone = JSON.parse(resumeData);
      } else {
        resumeDataClone = structuredClone(resumeData);
      }
    } catch (e) {
      return res.status(400).json({ message: "Invalid resumeData format" });
    }

    if (image) {
      try {
        const response = await imagekit.files.upload({
          file: fs.createReadStream(image.path),
          fileName: `resume-${resumeId}-${Date.now()}.png`,
        });

        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }

        const transformedUrl = imagekit.url({
          src: response.url,
          transformation: [
            {
              height: "300",
              width: "300",
              focus: "face",
              quality: "75",

              ...(removeBackground ? [{ effect: "remove_background" }] : []),
            },
          ],
        });

        resumeDataClone.personal_info.image = transformedUrl;
      } catch (uploadError) {
        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
        throw new Error("Image upload failed: " + uploadError.message);
      }
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataClone },
      { new: true },
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume: updatedResume,
    });
  } catch (err) {
    console.error(err);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: err.message });
  }
};
export const saveResume = async (req, res) => {
  const { htmlContent } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--single-process"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });
    await browser.close();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "PDF save error",
    });
  }
};
